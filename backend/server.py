from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, hashlib, hmac, asyncio, bcrypt, jwt, secrets
import resend
from openai import OpenAI
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Logging first
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# MongoDB
client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ─── AUTH HELPERS ─────────────────────────────────────────────
JWT_SECRET    = os.environ.get('JWT_SECRET', 'arenakore-fallback-secret')
JWT_ALGORITHM = 'HS256'

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def _set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access,  httponly=True, secure=False, samesite="lax", max_age=3600,   path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")

def _clear_auth_cookies(response: Response):
    response.delete_cookie("access_token",  path="/")
    response.delete_cookie("refresh_token", path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(401, "Invalid token type")
        user = await db.website_users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(401, "User not found")
        user.pop("password_hash", None)
        console_user = {k: v for k, v in user.items() if k != 'password_hash'}
        logger.info(f"AUTH USER: {console_user}")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

# ─── USER MODEL ───────────────────────────────────────────────
class AKUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    password_hash: str
    role: str = "athlete"
    ak_credits: int = 0
    rank: str = "Rookie"
    level: int = 1
    sport_preference: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

def _safe_user(u: dict) -> dict:
    """Return user dict without password, safe for API responses."""
    u = dict(u)
    u.pop("password_hash", None)
    u.pop("_id", None)
    if isinstance(u.get("created_at"), datetime):
        u["created_at"] = u["created_at"].isoformat()
    return u

# ─── AUTH ENDPOINTS ───────────────────────────────────────────
class RegisterIn(BaseModel):
    email: str
    password: str
    name: str

class LoginIn(BaseModel):
    email: str
    password: str

@api_router.post("/auth/register")
async def register(data: RegisterIn, response: Response):
    email = data.email.lower().strip()
    existing = await db.website_users.find_one({"email": email})
    if existing:
        raise HTTPException(400, "Email already registered")
    user = AKUser(email=email, name=data.name.strip(), password_hash=hash_password(data.password))
    doc = user.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.website_users.insert_one(doc)
    access  = create_access_token(user.id, user.email)
    refresh = create_refresh_token(user.id)
    _set_auth_cookies(response, access, refresh)
    logger.info(f"AUTH USER: {_safe_user(doc)}")
    return {"user": _safe_user(doc), "access_token": access}

@api_router.post("/auth/login")
async def login(data: LoginIn, response: Response):
    email = data.email.lower().strip()
    user  = await db.website_users.find_one({"email": email}, {"_id": 0})
    if not user or not verify_password(data.password, user.get("password_hash", "")):
        raise HTTPException(401, "Invalid credentials")
    access  = create_access_token(user["id"], user["email"])
    refresh = create_refresh_token(user["id"])
    _set_auth_cookies(response, access, refresh)
    safe = _safe_user(user)
    logger.info(f"AUTH USER: {safe}")
    return {"user": safe, "access_token": access}

@api_router.post("/auth/logout")
async def logout(response: Response):
    _clear_auth_cookies(response)
    return {"ok": True}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    logger.info(f"AUTH USER: {current_user}")
    return {"user": current_user}

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(401, "No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(401, "Invalid refresh token")
        user = await db.website_users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(401, "User not found")
        access = create_access_token(user["id"], user["email"])
        response.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"ok": True, "user": _safe_user(user)}
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid refresh token")

@api_router.patch("/auth/me")
async def update_me(updates: Dict[str, Any], current_user: dict = Depends(get_current_user)):
    allowed = {"name", "sport_preference", "ak_credits", "rank", "level"}
    safe_updates = {k: v for k, v in updates.items() if k in allowed}
    if not safe_updates:
        raise HTTPException(400, "No valid fields")
    await db.website_users.update_one({"id": current_user["id"]}, {"$set": safe_updates})
    updated = await db.website_users.find_one({"id": current_user["id"]}, {"_id": 0})
    return {"user": _safe_user(updated)}

# Seed admin on startup
async def _seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@arenakore.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "ArenaKore2026!")
    existing = await db.website_users.find_one({"email": admin_email})
    if not existing:
        user = AKUser(email=admin_email, name="Admin", password_hash=hash_password(admin_password), role="admin")
        doc = user.model_dump(); doc["created_at"] = doc["created_at"].isoformat()
        await db.website_users.insert_one(doc)
        logger.info(f"Admin user seeded: {admin_email}")
    await db.website_users.create_index("email", unique=True)

# ─── ADMIN AUTH ───────────────────────────────────────────────
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'ArenaKore2026!')
ADMIN_SECRET   = os.environ.get('ADMIN_SECRET', 'ak-cms-secret-2026')
APP_ENV        = os.environ.get('APP_ENV', 'development')
IS_PROD        = APP_ENV == 'production'

# Resend email config
resend.api_key     = os.environ.get('RESEND_API_KEY', '')
FOUNDER_EMAIL      = os.environ.get('FOUNDER_EMAIL', 'ogrisek.stefano@gmail.com')
SENDER_EMAIL       = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# OpenAI client for AI translation
openai_client = OpenAI(
    api_key=os.environ.get('OPENAI_API_KEY', ''),
    base_url=os.environ.get('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
)

# ─── EMAIL HELPERS ────────────────────────────────────────────

def _founder_html(req) -> str:
    phone = req.phone or "—"
    ts    = req.created_at.strftime('%d/%m/%Y %H:%M UTC')
    rows  = ''.join(
        f'<tr style="border-bottom:1px solid #1a1a1a;">'
        f'<td style="padding:14px 18px;font-size:11px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px;width:35%;background:#050505;">{k}</td>'
        f'<td style="padding:14px 18px;font-size:14px;font-weight:600;color:#fff;">{v}</td></tr>'
        for k, v in [
            ('Gym Name', req.gym_name), ('City', req.city),
            ('Owner', req.owner_name), ('Email', req.email),
            ('Phone', phone), ('Submitted', ts)
        ]
    )
    return f"""<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden;">

  <tr><td style="background:#FFD700;padding:20px 32px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#000;text-transform:uppercase;letter-spacing:2px;">ArenaKore — Founder Alert</p>
    <p style="margin:6px 0 0;font-size:22px;font-weight:900;color:#000;">🔥 New Gym Ready for ArenaKore</p>
  </td></tr>

  <tr><td style="padding:28px 32px 8px;">
    <p style="margin:0;font-size:14px;color:#a1a1aa;">New pilot request received:</p>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;">
      {rows}
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border-left:4px solid #FF2D2D;border-radius:8px;padding:20px;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0;font-size:15px;font-weight:900;color:#FF2D2D;text-transform:uppercase;letter-spacing:1px;">⚡ ACTION REQUIRED</p>
        <p style="margin:8px 0 4px;font-size:14px;color:#fff;font-weight:700;">Reply within 5 minutes.</p>
        <p style="margin:0;font-size:12px;color:#a1a1aa;">This is a hot lead. Speed of first response is the #1 conversion factor.</p>
        <p style="margin:14px 0 0;">
          <a href="mailto:{req.email}" style="display:inline-block;background:#FFD700;color:#000;font-size:12px;font-weight:900;text-transform:uppercase;padding:10px 20px;border-radius:8px;text-decoration:none;letter-spacing:1px;">
            Reply to {req.owner_name} →
          </a>
        </p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:16px 32px;border-top:1px solid #1a1a1a;">
    <p style="margin:0;font-size:11px;color:#333;">ArenaKore CMS · Automated Lead Alert</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>"""


def _owner_html(req) -> str:
    steps = ''.join(
        f'<tr><td style="padding:12px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:36px;">'
        f'<span style="font-size:13px;font-weight:900;color:{c};font-family:Arial,sans-serif;">{n}</span></td>'
        f'<td style="padding:12px 0 12px 14px;border-bottom:1px solid #1a1a1a;font-size:13px;color:#e0e0e0;line-height:1.5;">{t}</td></tr>'
        for n, c, t in [
            ('01', '#00FFFF', 'We select 20–30 active members for your pilot'),
            ('02', '#FFD700', 'We launch your first challenge — within 48 hours'),
            ('03', '#00FFFF', 'You see engagement, attendance and performance data'),
            ('04', '#FFD700', "You don't need to prepare anything. Just stay ready."),
        ]
    )
    return f"""<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden;">

  <tr><td style="padding:32px 32px 0;text-align:center;">
    <p style="margin:0;font-size:30px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:3px;">ARENA<span style="color:#00FFFF;">KORE</span></p>
  </td></tr>

  <tr><td style="padding:28px 32px 8px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#00FFFF;text-transform:uppercase;letter-spacing:2px;">Pilot Request</p>
    <p style="margin:8px 0 0;font-size:24px;font-weight:900;color:#fff;line-height:1.2;">You're in.</p>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.7;">
      Hi {req.owner_name},<br><br>
      Your ArenaKore pilot request for <strong style="color:#FFD700;">{req.gym_name}</strong> is confirmed.<br>
      We'll contact you shortly to activate your gym.
    </p>
  </td></tr>

  <tr><td style="padding:0 32px 8px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:1px;">What will happen</p>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">{steps}</table>
  </td></tr>

  <tr><td style="padding:0 32px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border-radius:12px;">
      <tr><td style="padding:20px;text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;">Status</p>
        <p style="margin:0;font-size:22px;font-weight:900;color:#FFD700;text-transform:uppercase;">Confirmed ✓</p>
        <p style="margin:10px 0 0;font-size:12px;color:#a1a1aa;">You don't need to prepare anything.<br>Stay ready.</p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 28px;">
    <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.7;">
      ArenaKore Team
    </p>
  </td></tr>

  <tr><td style="padding:16px 32px;border-top:1px solid #1a1a1a;">
    <p style="margin:0;font-size:11px;color:#333;">
      Questions? <a href="mailto:support@arenakore.com" style="color:#00FFFF;">support@arenakore.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>"""


async def _send_with_retry(to: str, subject: str, html: str, max_retries: int = 1) -> bool:
    """Send email with one retry on failure. Returns True if delivered."""
    for attempt in range(max_retries + 1):
        try:
            result = await asyncio.to_thread(resend.Emails.send, {
                "from": f"ArenaKore <{SENDER_EMAIL}>",
                "to": [to],
                "subject": subject,
                "html": html,
            })
            logger.info(f"✓ Email → {to} | id:{result.get('id','?')} | attempt:{attempt+1}")
            return True
        except Exception as e:
            if attempt < max_retries:
                logger.warning(f"⟳ Email retry ({attempt+1}/{max_retries}) → {to}: {e}")
                await asyncio.sleep(1)
            else:
                logger.error(f"✗ Email FAILED (all retries exhausted) → {to}: {e}")
    return False


async def _send_pilot_emails(req):
    """Fire-and-forget: both emails in parallel, retry once, never raise."""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set — skipping emails")
        return
    results = await asyncio.gather(
        _send_with_retry(
            FOUNDER_EMAIL,
            "🔥 New Gym Ready for ArenaKore",
            _founder_html(req),
        ),
        _send_with_retry(
            req.email,
            "You're in. ArenaKore pilot request received.",
            _owner_html(req),
        ),
        return_exceptions=True,
    )
    logger.info(f"Email dispatch complete — founder:{results[0]} owner:{results[1]}")


async def _trigger_lead_webhook(req):
    """Internal webhook trigger — logs and forwards to /api/internal/lead-alert for CRM/Slack/WhatsApp."""
    try:
        payload = {
            "gym_name":   req.gym_name,
            "city":       req.city,
            "owner_name": req.owner_name,
            "email":      req.email,
            "phone":      req.phone or "",
            "source":     "pilot-form",
        }
        logger.info(f"[WEBHOOK] Lead alert fired: {payload['gym_name']} / {payload['email']}")
        # Future: forward payload to Slack / WhatsApp / CRM here
    except Exception as e:
        logger.error(f"[WEBHOOK] Lead alert failed: {e}")

def _make_token(password: str) -> str:
    return hashlib.sha256(f"{ADMIN_SECRET}:{password}".encode()).hexdigest()

ADMIN_TOKEN = _make_token(ADMIN_PASSWORD)

async def verify_admin(creds: HTTPAuthorizationCredentials = Depends(security)):
    if not creds or not hmac.compare_digest(creds.credentials, ADMIN_TOKEN):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

class AdminLogin(BaseModel):
    password: str

@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    if not hmac.compare_digest(data.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"token": ADMIN_TOKEN, "ok": True}

@api_router.get("/admin/verify")
async def admin_verify(_=Depends(verify_admin)):
    return {"ok": True}

# ─── EXISTING MODELS ──────────────────────────────────────────
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

@api_router.get("/")
async def root(): return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(inp: StatusCheckCreate):
    obj = StatusCheck(**inp.model_dump())
    doc = obj.model_dump(); doc['timestamp'] = doc['timestamp'].isoformat()
    await db.website_status_checks.insert_one(doc); return obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.website_status_checks.find({}, {"_id": 0}).to_list(1000)
    for d in docs:
        if isinstance(d.get('timestamp'), str): d['timestamp'] = datetime.fromisoformat(d['timestamp'])
    return docs

@api_router.get("/download/arenakore-zip")
async def download_zip():
    return FileResponse("/app/frontend/public/arenakore-site.zip", filename="arenakore-site.zip",
                        media_type="application/zip", headers={"Content-Disposition": "attachment; filename=arenakore-site.zip"})

# ─── PILOT REQUESTS ───────────────────────────────────────────
class PilotRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    gym_name: str; city: str; owner_name: str; email: str
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PilotRequestCreate(BaseModel):
    gym_name: str; city: str; owner_name: str; email: str; phone: Optional[str] = None

@api_router.post("/pilot-requests", response_model=PilotRequest)
async def create_pilot_request(data: PilotRequestCreate):
    obj = PilotRequest(**data.model_dump())
    doc = obj.model_dump(); doc['created_at'] = doc['created_at'].isoformat()
    await db.website_pilot_requests.insert_one(doc)
    logger.info(f"Pilot request: {obj.gym_name} — {obj.email}")
    # Fire-and-forget: emails + webhook, non-blocking
    asyncio.create_task(_send_pilot_emails(obj))
    asyncio.create_task(_trigger_lead_webhook(obj))
    return obj

@api_router.get("/pilot-requests", response_model=List[PilotRequest])
async def get_pilot_requests(_=Depends(verify_admin)):
    docs = await db.website_pilot_requests.find({}, {"_id": 0}).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str): d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs

# ─── CMS: BLOG POSTS ──────────────────────────────────────────
class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str; title: str; seo_title: str = ''; meta_description: str = ''
    category: str = 'General'; read_time: str = '5 min read'; date: str = ''
    excerpt: str = ''; content: str; featured_image: str = ''
    published: bool = True
    translations: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    slug: str; title: str; seo_title: str = ''; meta_description: str = ''
    category: str = 'General'; read_time: str = '5 min read'; date: str = ''
    excerpt: str = ''; content: str; featured_image: str = ''; published: bool = True
    translations: Optional[Dict[str, Any]] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str]=None; seo_title: Optional[str]=None; meta_description: Optional[str]=None
    category: Optional[str]=None; read_time: Optional[str]=None; date: Optional[str]=None
    excerpt: Optional[str]=None; content: Optional[str]=None; featured_image: Optional[str]=None
    published: Optional[bool]=None; translations: Optional[Dict[str, Any]] = None

def _deserialize_post(d):
    for f in ('created_at', 'updated_at'):
        if isinstance(d.get(f), str): d[f] = datetime.fromisoformat(d[f])
    return d

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    docs = await db.website_blog_posts.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [_deserialize_post(d) for d in docs]

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    doc = await db.website_blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not doc: raise HTTPException(404, "Not found")
    return _deserialize_post(doc)

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(data: BlogPostCreate, _=Depends(verify_admin)):
    existing = await db.website_blog_posts.find_one({"slug": data.slug})
    if existing: raise HTTPException(400, f"Slug '{data.slug}' already exists")
    obj = BlogPost(**data.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.website_blog_posts.insert_one(doc); return obj

@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, data: BlogPostUpdate, _=Depends(verify_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    update['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.website_blog_posts.find_one_and_update(
        {"id": post_id}, {"$set": update}, {"_id": 0}, return_document=True)
    if not result: raise HTTPException(404, "Not found")
    return _deserialize_post(result)

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, _=Depends(verify_admin)):
    await db.website_blog_posts.delete_one({"id": post_id})
    return {"ok": True}

class BlogTranslateRequest(BaseModel):
    target_lang: str
    target_lang_name: str = ''

@api_router.post("/blog/{post_id}/translate")
async def translate_blog_post(post_id: str, req: BlogTranslateRequest, _=Depends(verify_admin)):
    """Translate all blog post fields from EN to target language using AI."""
    doc = await db.website_blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not doc: raise HTTPException(404, "Post not found")

    lang = req.target_lang.lower()
    lang_name = req.target_lang_name or lang

    # Fields to translate (EN source values)
    fields = {
        "title":            doc.get("title", ""),
        "seo_title":        doc.get("seo_title", ""),
        "meta_description": doc.get("meta_description", ""),
        "excerpt":          doc.get("excerpt", ""),
        "content":          doc.get("content", ""),
    }
    to_translate = {k: v for k, v in fields.items() if v}
    if not to_translate:
        raise HTTPException(400, "No English content to translate")

    prompt_items = "\n".join([f"[{k}]: {v[:800]}" for k, v in to_translate.items()])
    system_msg = f"""You are a professional translator for ArenaKore, a competitive sports/fitness platform.
Translate the following blog post fields from English to {lang_name}.
Tone: bold, direct, competitive — matching a fitness brand.
Preserve markdown, ALL CAPS headings, brand names (ArenaKore, NEXUS, K-Rating, K-Flux, KORE ID, DNA).
Return a JSON object with ONLY the translated fields.
For slug: generate a URL-friendly slug in {lang_name} (lowercase, hyphens, no accents)."""

    try:
        import json as _json
        resp = await asyncio.to_thread(
            lambda: openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": f"Translate to {lang_name}:\n{prompt_items}"},
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
            )
        )
        translated = _json.loads(resp.choices[0].message.content)
    except Exception as e:
        logger.error(f"Blog translation error: {e}")
        raise HTTPException(500, f"Translation failed: {str(e)}")

    # Auto-generate slug from title if not provided
    if "slug" not in translated and "title" in translated:
        import unicodedata, re
        t = translated["title"].lower()
        t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()
        translated["slug"] = re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:80]

    # Merge into existing translations
    existing = doc.get("translations") or {}
    existing[lang] = {**(existing.get(lang) or {}), **translated}

    await db.website_blog_posts.update_one(
        {"id": post_id},
        {"$set": {"translations": existing, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    logger.info(f"Blog post {post_id} translated {len(translated)} fields → {lang}")
    return {"ok": True, "translated": len(translated), "lang": lang, "fields": translated}

@api_router.post("/blog/seed/demo")
async def seed_demo_blog(_=Depends(verify_admin)):
    count = await db.website_blog_posts.count_documents({})
    if count > 0: return {"ok": True, "seeded": 0, "message": "Already has posts"}
    return {"ok": True, "seeded": 0, "message": "Send posts via POST /api/blog"}

# Seed default hero slides
DEFAULT_HERO_SLIDES = [
    {"image_url": "https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png", "sport_label": "CROSSFIT",    "position": "center 15%", "order": 0},
    {"image_url": "https://images.unsplash.com/photo-1726195221766-e4594ff9d025?crop=entropy&cs=srgb&fm=jpg&q=90&w=1600", "sport_label": "RUNNING",    "position": "center center", "order": 1},
    {"image_url": "https://images.pexels.com/photos/30050101/pexels-photo-30050101.jpeg?auto=compress&cs=tinysrgb&w=1600", "sport_label": "BASKETBALL", "position": "center center", "order": 2},
    {"image_url": "https://images.pexels.com/photos/6011896/pexels-photo-6011896.jpeg?auto=compress&cs=tinysrgb&w=1600",  "sport_label": "SWIMMING",   "position": "center center", "order": 3},
    {"image_url": "https://images.pexels.com/photos/29015508/pexels-photo-29015508.jpeg?auto=compress&cs=tinysrgb&w=1600","sport_label": "MMA",        "position": "center 20%",   "order": 4},
    {"image_url": "https://images.pexels.com/photos/33453950/pexels-photo-33453950.jpeg?auto=compress&cs=tinysrgb&w=1600","sport_label": "SURF",       "position": "center center", "order": 5},
]

@api_router.post("/hero-slides/seed")
async def seed_hero_slides(_=Depends(verify_admin)):
    existing = await db.website_hero_slides.count_documents({})
    if existing > 0:
        return {"ok": True, "seeded": 0, "message": f"Already has {existing} slides"}
    inserted = 0
    for slide_data in DEFAULT_HERO_SLIDES:
        obj = HeroSlide(**slide_data)
        doc = obj.model_dump(); doc['created_at'] = doc['created_at'].isoformat()
        await db.website_hero_slides.insert_one(doc)
        inserted += 1
    return {"ok": True, "seeded": inserted, "message": f"Seeded {inserted} default slides"}

# ─── CMS: PAGES ───────────────────────────────────────────────
class PageMeta(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str; seo_title: str = ''; meta_description: str = ''; h1: str = ''
    translations: Optional[Dict[str, Any]] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PageMetaCreate(BaseModel):
    slug: str; seo_title: str = ''; meta_description: str = ''; h1: str = ''

class PageMetaUpdate(BaseModel):
    seo_title: Optional[str]=None; meta_description: Optional[str]=None; h1: Optional[str]=None
    translations: Optional[Dict[str, Any]] = None

@api_router.get("/pages", response_model=List[PageMeta])
async def get_pages(_=Depends(verify_admin)):
    docs = await db.website_cms_pages.find({}, {"_id": 0}).to_list(100)
    for d in docs:
        if isinstance(d.get('updated_at'), str): d['updated_at'] = datetime.fromisoformat(d['updated_at'])
    return docs

@api_router.get("/pages/{slug:path}", response_model=PageMeta)
async def get_page_meta(slug: str):
    doc = await db.website_cms_pages.find_one({"slug": slug}, {"_id": 0})
    if not doc: raise HTTPException(404, "Not found")
    if isinstance(doc.get('updated_at'), str): doc['updated_at'] = datetime.fromisoformat(doc['updated_at'])
    return doc

@api_router.put("/pages/{slug:path}", response_model=PageMeta)
async def upsert_page_meta(slug: str, data: PageMetaUpdate, _=Depends(verify_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    update['updated_at'] = datetime.now(timezone.utc).isoformat()
    update['slug'] = slug
    doc = await db.website_cms_pages.find_one({"slug": slug})
    if doc:
        await db.website_cms_pages.update_one({"slug": slug}, {"$set": update})
    else:
        update['id'] = str(uuid.uuid4())
        await db.website_cms_pages.insert_one(update)
    result = await db.website_cms_pages.find_one({"slug": slug}, {"_id": 0})
    if isinstance(result.get('updated_at'), str): result['updated_at'] = datetime.fromisoformat(result['updated_at'])
    return result

class PageSeoTranslateRequest(BaseModel):
    target_lang: str
    target_lang_name: str = ''

@api_router.post("/pages/{slug:path}/translate")
async def translate_page_seo(slug: str, req: PageSeoTranslateRequest, _=Depends(verify_admin)):
    """Translate page SEO metadata (seo_title, meta_description, h1) from EN to target language."""
    doc = await db.website_cms_pages.find_one({"slug": slug}, {"_id": 0})
    lang = req.target_lang.lower()
    lang_name = req.target_lang_name or lang

    # EN source fields — from the page itself (or empty)
    fields = {
        "seo_title":        (doc or {}).get("seo_title", ""),
        "meta_description": (doc or {}).get("meta_description", ""),
        "h1":               (doc or {}).get("h1", ""),
    }
    # Try to get H1 default from DEFAULT_PAGES if not set
    defaults = DEFAULT_PAGES.get(slug.lstrip('/'), [])
    if not fields["h1"]:
        for s in defaults:
            if isinstance(s, dict) and s.get("key") == "hero_h1":
                en_val = s.get("translations", {}).get("en", "")
                if en_val: fields["h1"] = en_val; break

    to_translate = {k: v for k, v in fields.items() if v}
    if not to_translate:
        raise HTTPException(400, "No English content to translate. Add SEO title and meta description first.")

    prompt_items = "\n".join([f"[{k}]: {v}" for k, v in to_translate.items()])
    system_msg = f"""You are a professional SEO translator for ArenaKore, a competitive sports/fitness platform.
Translate the following page SEO metadata from English to {lang_name}.
Keep the tone bold and competitive. Preserve brand names (ArenaKore, NEXUS, K-Rating).
SEO titles: max 60 characters. Meta descriptions: max 155 characters.
Return a JSON object with the translated fields."""

    try:
        import json as _json
        resp = await asyncio.to_thread(
            lambda: openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": f"Translate to {lang_name}:\n{prompt_items}"},
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
            )
        )
        translated = _json.loads(resp.choices[0].message.content)
    except Exception as e:
        logger.error(f"Page SEO translation error: {e}")
        raise HTTPException(500, f"Translation failed: {str(e)}")

    # Merge into existing translations
    existing = (doc or {}).get("translations") or {}
    existing[lang] = {**(existing.get(lang) or {}), **translated}

    update = {
        "translations": existing,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "slug": slug
    }
    if doc:
        await db.website_cms_pages.update_one({"slug": slug}, {"$set": update})
    else:
        update['id'] = str(uuid.uuid4())
        await db.website_cms_pages.insert_one(update)

    logger.info(f"Page SEO {slug} translated {len(translated)} fields → {lang}")
    return {"ok": True, "translated": len(translated), "lang": lang, "fields": translated}

# ─── CMS: MEDIA LIBRARY ───────────────────────────────────────
class MediaItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str; alt_text: str = ''; tag: str = 'general'
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MediaItemCreate(BaseModel):
    image_url: str; alt_text: str = ''; tag: str = 'general'

@api_router.get("/media", response_model=List[MediaItem])
async def get_media(_=Depends(verify_admin)):
    docs = await db.website_media_library.find({}, {"_id": 0}).sort("uploaded_at", -1).to_list(200)
    for d in docs:
        if isinstance(d.get('uploaded_at'), str): d['uploaded_at'] = datetime.fromisoformat(d['uploaded_at'])
    return docs

@api_router.post("/media", response_model=MediaItem)
async def add_media(data: MediaItemCreate, _=Depends(verify_admin)):
    obj = MediaItem(**data.model_dump())
    doc = obj.model_dump(); doc['uploaded_at'] = doc['uploaded_at'].isoformat()
    await db.website_media_library.insert_one(doc); return obj

@api_router.delete("/media/{item_id}")
async def delete_media(item_id: str, _=Depends(verify_admin)):
    await db.website_media_library.delete_one({"id": item_id}); return {"ok": True}

# ─── CMS CONTENT (Multi-language sections) ───────────────────

# Default content — EN source of truth
DEFAULT_PAGES: Dict[str, List[Dict]] = {
    "homepage": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "NEXUS VALIDATION SYSTEM", "it": "SISTEMA DI VALIDAZIONE NEXUS", "es": "SISTEMA DE VALIDACIÓN NEXUS"}},
        {"key": "hero_h1_line1",       "field_type": "heading", "translations": {"en": "ENTER", "it": "ENTRA", "es": "ENTRA"}},
        {"key": "hero_h1_line2",       "field_type": "heading", "translations": {"en": "THE ARENA.", "it": "NELL'ARENA.", "es": "AL ARENA."}},
        {"key": "hero_sub",            "field_type": "text",    "translations": {"en": "A performance validation system. NEXUS analyzes, selects and evaluates every challenge.", "it": "Un sistema di validazione delle performance. NEXUS analizza, seleziona e valuta ogni sfida.", "es": "Un sistema de validación del rendimiento. NEXUS analiza, selecciona y evalúa cada desafío."}},
        {"key": "hero_scroll",         "field_type": "label",   "translations": {"en": "Scroll to learn more", "it": "Scorri per sapere di più", "es": "Desliza para saber más"}},
        {"key": "hero_nexus_line",     "field_type": "text",    "translations": {"en": "NEXUS creates and selects challenges designed by professional coaches and validated on thousands of athletes.", "it": "NEXUS crea e seleziona sfide progettate da coach professionisti e validate su migliaia di atleti.", "es": "NEXUS crea y selecciona desafíos diseñados por entrenadores profesionales y validados con miles de atletas."}},
        {"key": "cta_primary",         "field_type": "cta",     "translations": {"en": "Enter the Arena", "it": "Entra nell'Arena", "es": "Entra al Arena"}},
        {"key": "cta_secondary",       "field_type": "cta",     "translations": {"en": "Download the App", "it": "Scarica l'App", "es": "Descargar la App"}},
        {"key": "stats_active",        "field_type": "label",   "translations": {"en": "Active KORE", "it": "KORE Attivi", "es": "KORE Activos"}},
        {"key": "stats_rating",        "field_type": "label",   "translations": {"en": "Max K-Rating", "it": "K-Rating Max", "es": "K-Rating Máximo"}},
        {"key": "stats_validated",     "field_type": "label",   "translations": {"en": "Rep Validated", "it": "Rep Verificate", "es": "Reps Verificadas"}},
        {"key": "stats_excuses",       "field_type": "label",   "translations": {"en": "Excuses Accepted", "it": "Scuse Accettate", "es": "Excusas Aceptadas"}},
        {"key": "sport_selector_title","field_type": "heading", "translations": {"en": "What's your arena?", "it": "Qual è la tua arena?", "es": "¿Cuál es tu arena?"}},
        {"key": "sport_selector_sub",  "field_type": "text",    "translations": {"en": "Your discipline. NEXUS executes the rest.", "it": "La tua disciplina. NEXUS fa il resto.", "es": "Tu disciplina. NEXUS hace el resto."}},
        {"key": "problem_badge",       "field_type": "label",   "translations": {"en": "THE PROBLEM", "it": "IL PROBLEMA", "es": "EL PROBLEMA"}},
        {"key": "problem_h2",          "field_type": "heading", "translations": {"en": "TRAINING WITHOUT COMPETITION DOESN'T LAST.", "it": "SENZA COMPETIZIONE L'ALLENAMENTO NON DURA.", "es": "SIN COMPETICIÓN EL ENTRENAMIENTO NO DURA."}},
        {"key": "problem_p1",          "field_type": "text",    "translations": {"en": "No pressure — missing a session has no consequence.", "it": "Nessuna pressione — saltare una sessione non ha conseguenze.", "es": "Sin presión — faltar a una sesión no tiene consecuencias."}},
        {"key": "problem_p2",          "field_type": "text",    "translations": {"en": "No accountability — nobody notices if you don't show up.", "it": "Nessuna responsabilità — nessuno nota se non ti presenti.", "es": "Sin responsabilidad — nadie nota si no apareces."}},
        {"key": "problem_p3",          "field_type": "text",    "translations": {"en": "No reason to come back — progress feels invisible.", "it": "Nessun motivo per tornare — i progressi sembrano invisibili.", "es": "Sin razón para volver — el progreso parece invisible."}},
        {"key": "insight_line1",       "field_type": "heading", "translations": {"en": "PEOPLE DON'T COME BACK", "it": "LE PERSONE NON TORNANO", "es": "LA GENTE NO VUELVE"}},
        {"key": "insight_line2",       "field_type": "heading", "translations": {"en": "TO TRAIN.", "it": "AD ALLENARSI.", "es": "A ENTRENAR."}},
        {"key": "insight_line3",       "field_type": "heading", "translations": {"en": "THEY COME BACK", "it": "TORNANO", "es": "VUELVEN"}},
        {"key": "insight_line4",       "field_type": "heading", "translations": {"en": "TO NOT LOSE.", "it": "PER NON PERDERE.", "es": "PARA NO PERDER."}},
        {"key": "insight_body",        "field_type": "richtext","translations": {"en": "Behavioral science is clear: loss aversion is 2x more motivating than the desire to gain.", "it": "La scienza comportamentale è chiara: l'avversione alla perdita è 2x più motivante del desiderio di guadagno.", "es": "La ciencia del comportamiento es clara: la aversión a la pérdida es 2 veces más motivadora que el deseo de ganar."}},
        {"key": "solution_badge",      "field_type": "label",   "translations": {"en": "THE SYSTEM", "it": "IL SISTEMA", "es": "EL SISTEMA"}},
        {"key": "solution_h2",         "field_type": "heading", "translations": {"en": "NEXUS VALIDATES. ATHLETES PROVE.", "it": "NEXUS VALIDA. GLI ATLETI DIMOSTRANO.", "es": "NEXUS VALIDA. LOS ATLETAS DEMUESTRAN."}},
        {"key": "solution_feat1",      "field_type": "text",    "translations": {"en": "Daily challenges — new challenge every day. Every session has stakes.", "it": "Sfide quotidiane — una nuova sfida ogni giorno. Ogni sessione ha posta in gioco.", "es": "Desafíos diarios — un nuevo desafío cada día. Cada sesión tiene algo en juego."}},
        {"key": "solution_feat2",      "field_type": "text",    "translations": {"en": "Live rankings — K-Rating updates in real-time. Public, permanent, undeniable.", "it": "Ranking live — il K-Rating si aggiorna in tempo reale. Pubblico, permanente, innegabile.", "es": "Rankings en vivo — el K-Rating se actualiza en tiempo real. Público, permanente, innegable."}},
        {"key": "solution_feat3",      "field_type": "text",    "translations": {"en": "Visible performance — NEXUS validates every rep. You can't fake your score.", "it": "Performance visibile — NEXUS valida ogni rep. Non puoi falsificare il tuo punteggio.", "es": "Rendimiento visible — NEXUS valida cada rep. No puedes falsificar tu puntuación."}},
        {"key": "how_badge",           "field_type": "label",   "translations": {"en": "VALIDATION PROCESS", "it": "PROCESSO DI VALIDAZIONE", "es": "PROCESO DE VALIDACIÓN"}},
        {"key": "how_h2",              "field_type": "heading", "translations": {"en": "NEXUS ANALYZES. SELECTS. EVALUATES.", "it": "NEXUS ANALIZZA. SELEZIONA. VALUTA.", "es": "NEXUS ANALIZA. SELECCIONA. EVALÚA."}},
        {"key": "how_s1_title",        "field_type": "heading", "translations": {"en": "NEXUS analyzes", "it": "NEXUS analizza", "es": "NEXUS analiza"}},
        {"key": "how_s1_desc",         "field_type": "text",    "translations": {"en": "NEXUS scans performance data and maps the athletic profile. Every metric feeds the evaluation.", "it": "NEXUS scansiona i dati di performance e mappa il profilo atletico. Ogni metrica alimenta la valutazione.", "es": "NEXUS escanea los datos de rendimiento y mapea el perfil atlético. Cada métrica alimenta la evaluación."}},
        {"key": "how_s2_title",        "field_type": "heading", "translations": {"en": "Track your performance", "it": "Traccia le performance", "es": "Mide tu rendimiento"}},
        {"key": "how_s2_desc",         "field_type": "text",    "translations": {"en": "NEXUS validates every rep in real-time. Bad form doesn't count.", "it": "NEXUS valida ogni rep in tempo reale. La forma scorretta non conta.", "es": "NEXUS valida cada rep en tiempo real. La mala técnica no cuenta."}},
        {"key": "how_s3_title",        "field_type": "heading", "translations": {"en": "Climb the ranking", "it": "Scala il ranking", "es": "Escala el ranking"}},
        {"key": "how_s3_desc",         "field_type": "text",    "translations": {"en": "K-Rating updates after every session. Public. Permanent.", "it": "Il K-Rating si aggiorna dopo ogni sessione. Pubblico. Permanente.", "es": "El K-Rating se actualiza después de cada sesión. Público. Permanente."}},
        {"key": "how_s4_title",        "field_type": "heading", "translations": {"en": "NEXUS evaluates", "it": "NEXUS valuta", "es": "NEXUS evalúa"}},
        {"key": "how_s4_desc",         "field_type": "text",    "translations": {"en": "Your rank updates. A new challenge is assigned. The validation never stops.", "it": "Il tuo rank si aggiorna. Una nuova sfida viene assegnata. La validazione non si ferma.", "es": "Tu ranking se actualiza. Se asigna un nuevo desafío. La validación nunca se detiene."}},
        {"key": "how_s5_title",        "field_type": "heading", "translations": {"en": "Result", "it": "Risultato", "es": "Resultado"}},
        {"key": "how_s5_desc",         "field_type": "text",    "translations": {"en": "The certified result is permanent data. Your profile updates. Your rank reflects what you have proven.", "it": "Il risultato certificato è un dato permanente. Il tuo profilo si aggiorna. Il tuo rank riflette ciò che hai dimostrato.", "es": "El resultado certificado es un dato permanente. Tu perfil se actualiza. Tu ranking refleja lo que has demostrado."}},
        {"key": "how_s6_title",        "field_type": "heading", "translations": {"en": "New test", "it": "Nuova prova", "es": "Nueva prueba"}},
        {"key": "how_s6_desc",         "field_type": "text",    "translations": {"en": "NEXUS assigns the next challenge. The validation cycle never ends. You keep improving.", "it": "NEXUS assegna la prossima sfida. Il ciclo di validazione non si ferma. Continui a migliorare.", "es": "NEXUS asigna el próximo desafío. El ciclo de validación nunca termina. Sigues mejorando."}},
        {"key": "value_h2",            "field_type": "heading", "translations": {"en": "YOU DON'T TRAIN HERE. YOU MEASURE YOUR LEVEL.", "it": "QUI NON TI ALLENI. VALUTI IL TUO LIVELLO.", "es": "AQUÍ NO ENTRENAS. MIDES TU NIVEL."}},
        {"key": "value_body",          "field_type": "text",    "translations": {"en": "This is not a training program. It is a system that measures capabilities through structured, comparable and relevant challenges.", "it": "Non è un programma di allenamento. È un sistema che misura le capacità attraverso prove strutturate, comparabili e rilevanti.", "es": "No es un programa de entrenamiento. Es un sistema que mide las capacidades a través de pruebas estructuradas, comparables y relevantes."}},
        {"key": "cta_primary",         "field_type": "cta",     "translations": {"en": "Enter the Arena", "it": "Entra nell'Arena", "es": "Entra al Arena"}},
        {"key": "cta_secondary",       "field_type": "cta",     "translations": {"en": "Download the App", "it": "Scarica l'App", "es": "Descargar la App"}},
        {"key": "disciplines_badge",   "field_type": "label",   "translations": {"en": "EVERY ARENA", "it": "OGNI ARENA", "es": "CADA ARENA"}},
        {"key": "disciplines_h2",      "field_type": "heading", "translations": {"en": "BUILT FOR EVERY DISCIPLINE.", "it": "COSTRUITA PER OGNI DISCIPLINA.", "es": "CONSTRUIDA PARA CADA DISCIPLINA."}},
        {"key": "disciplines_sub",     "field_type": "text",    "translations": {"en": "One ranking system. One identity. Any sport.", "it": "Un sistema di ranking. Un'identità. Qualsiasi sport.", "es": "Un sistema de ranking. Una identidad. Cualquier deporte."}},
        {"key": "positioning_badge",   "field_type": "label",   "translations": {"en": "THE PLATFORM", "it": "LA PIATTAFORMA", "es": "LA PLATAFORMA"}},
        {"key": "positioning_h2",      "field_type": "heading", "translations": {"en": "ONE SYSTEM. ANY DISCIPLINE.", "it": "UN SISTEMA. QUALSIASI DISCIPLINA.", "es": "UN SISTEMA. CUALQUIER DISCIPLINA."}},
        {"key": "positioning_body",    "field_type": "richtext","translations": {"en": "ArenaKore is a competition platform designed for any performance-based activity — from fitness and CrossFit to basketball, running, swimming and beyond.", "it": "ArenaKore è una piattaforma di competizione progettata per qualsiasi attività basata sulle performance — dal fitness e CrossFit al basket, alla corsa, al nuoto e oltre.", "es": "ArenaKore es una plataforma de competición diseñada para cualquier actividad basada en el rendimiento — desde fitness y CrossFit hasta baloncesto, running, natación y más."}},
        {"key": "gyms_badge",          "field_type": "label",   "translations": {"en": "FOR GYM OWNERS", "it": "PER TITOLARI DI PALESTRE", "es": "PARA DUEÑOS DE GIMNASIO"}},
        {"key": "gyms_h2",             "field_type": "heading", "translations": {"en": "BUILT FOR GYMS THAT WANT ENGAGED MEMBERS.", "it": "COSTRUITA PER PALESTRE CHE VOGLIONO ISCRITTI COINVOLTI.", "es": "CONSTRUIDA PARA GIMNASIOS QUE QUIEREN MIEMBROS COMPROMETIDOS."}},
        {"key": "gyms_body",           "field_type": "richtext","translations": {"en": "The average gym loses 80% of new members within 6 months. ArenaKore gives you a competition layer that makes members come back.", "it": "La palestra media perde l'80% dei nuovi iscritti entro 6 mesi. ArenaKore ti dà un livello competitivo che fa tornare gli iscritti.", "es": "El gimnasio promedio pierde el 80% de los nuevos miembros en 6 meses. ArenaKore te da una capa competitiva que hace que los miembros vuelvan."}},
        {"key": "gyms_f1",             "field_type": "text",    "translations": {"en": "+40% member retention", "it": "+40% fidelizzazione iscritti", "es": "+40% retención de miembros"}},
        {"key": "gyms_f2",             "field_type": "text",    "translations": {"en": "Live challenge system — no manual setup", "it": "Sistema di sfide live — senza gestione manuale", "es": "Sistema de desafíos en vivo — sin configuración manual"}},
        {"key": "gyms_f3",             "field_type": "text",    "translations": {"en": "Box vs box competition across locations", "it": "Competizione box vs box tra location", "es": "Competición box vs box entre sedes"}},
        {"key": "gyms_f4",             "field_type": "text",    "translations": {"en": "14-day free pilot. No commitment.", "it": "Pilot gratuito 14 giorni. Zero impegno.", "es": "Piloto gratuito 14 días. Sin compromiso."}},
        {"key": "gyms_cta",            "field_type": "cta",     "translations": {"en": "Start a 14-day Pilot", "it": "Avvia il Pilot 14 Giorni", "es": "Iniciar Piloto de 14 Días"}},
        {"key": "gyms_athletes_cta",   "field_type": "cta",     "translations": {"en": "For Athletes", "it": "Per Atleti", "es": "Para Atletas"}},
        # Discipline card images (URL fields — editable from admin)
        {"key": "d1_img",              "field_type": "image",   "translations": {"en": "https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/g6ba12ic_ChatGPT%20Image%20Apr%2015%2C%202026%2C%2011_23_53%20AM.png", "it": "", "es": ""}},
        {"key": "d2_img",              "field_type": "image",   "translations": {"en": "https://images.unsplash.com/photo-1589104666851-dffe3a15aace?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", "it": "", "es": ""}},
        {"key": "d3_img",              "field_type": "image",   "translations": {"en": "https://images.pexels.com/photos/30050102/pexels-photo-30050102.jpeg?auto=compress&cs=tinysrgb&w=800", "it": "", "es": ""}},
        {"key": "d4_img",              "field_type": "image",   "translations": {"en": "https://images.unsplash.com/photo-1682353242312-2e1f8c5dfd9a?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", "it": "", "es": ""}},
        {"key": "d5_img",              "field_type": "image",   "translations": {"en": "https://images.pexels.com/photos/36494151/pexels-photo-36494151.jpeg?auto=compress&cs=tinysrgb&w=800", "it": "", "es": ""}},
        {"key": "d6_img",              "field_type": "image",   "translations": {"en": "https://images.pexels.com/photos/20071425/pexels-photo-20071425.jpeg?auto=compress&cs=tinysrgb&w=800", "it": "", "es": ""}},
        {"key": "d7_img",              "field_type": "image",   "translations": {"en": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", "it": "", "es": ""}},
        {"key": "d8_img",              "field_type": "image",   "translations": {"en": "https://images.unsplash.com/photo-1758521959549-27f581bc400f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800", "it": "", "es": ""}},
        # Discipline card image positions (CSS object-position, e.g. "50% 30%")
        {"key": "d1_pos", "field_type": "position", "translations": {"en": "50% 50%", "it": "", "es": ""}},
        {"key": "d2_pos", "field_type": "position", "translations": {"en": "50% 30%", "it": "", "es": ""}},
        {"key": "d3_pos", "field_type": "position", "translations": {"en": "50% 40%", "it": "", "es": ""}},
        {"key": "d4_pos", "field_type": "position", "translations": {"en": "50% 50%", "it": "", "es": ""}},
        {"key": "d5_pos", "field_type": "position", "translations": {"en": "50% 40%", "it": "", "es": ""}},
        {"key": "d6_pos", "field_type": "position", "translations": {"en": "50% 60%", "it": "", "es": ""}},
        {"key": "d7_pos", "field_type": "position", "translations": {"en": "50% 50%", "it": "", "es": ""}},
        {"key": "d8_pos", "field_type": "position", "translations": {"en": "50% 30%", "it": "", "es": ""}},
        {"key": "final_h2",            "field_type": "heading", "translations": {"en": "START NOW.", "it": "INIZIA ORA.", "es": "EMPIEZA AHORA."}},
        {"key": "final_sub",           "field_type": "text",    "translations": {"en": "Compete or fall behind.", "it": "Compete o resta indietro.", "es": "Compite o quédate atrás."}},
    ],
    "get-the-app": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "FREE DOWNLOAD", "it": "DOWNLOAD GRATUITO", "es": "DESCARGA GRATUITA"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "DOWNLOAD. ENTER. EXECUTE.", "it": "SCARICA. ENTRA. ESEGUI.", "es": "DESCARGA. ENTRA. EJECUTA."}},
        {"key": "hero_tension",        "field_type": "text",    "translations": {"en": "Someone is already ahead.", "it": "Qualcuno è già davanti a te.", "es": "Alguien ya está por delante de ti."}},
        {"key": "hero_sub1",           "field_type": "text",    "translations": {"en": "Track your performance.", "it": "Traccia le tue performance.", "es": "Mide tu rendimiento."}},
        {"key": "hero_sub2",           "field_type": "text",    "translations": {"en": "Get ranked. Compete.", "it": "Vieni classificato. Compete.", "es": "Obtén un ranking. Compite."}},
        {"key": "available",           "field_type": "label",   "translations": {"en": "Available now", "it": "Disponibile ora", "es": "Disponible ahora"}},
        {"key": "download_time",       "field_type": "text",    "translations": {"en": "Download in 10 seconds", "it": "Scarica in 10 secondi", "es": "Descarga en 10 segundos"}},
        {"key": "free_note",           "field_type": "label",   "translations": {"en": "Free · No credit card · Available worldwide", "it": "Gratis · Senza carta di credito · Disponibile ovunque", "es": "Gratis · Sin tarjeta de crédito · Disponible en todo el mundo"}},
        {"key": "what_badge",          "field_type": "label",   "translations": {"en": "WHAT YOU GET", "it": "COSA OTTIENI", "es": "QUÉ OBTIENES"}},
        {"key": "what_h2",             "field_type": "heading", "translations": {"en": "THREE THINGS. ZERO EXCUSES.", "it": "TRE COSE. ZERO SCUSE.", "es": "TRES COSAS. CERO EXCUSAS."}},
        {"key": "track_badge",         "field_type": "label",   "translations": {"en": "01 / TRACK", "it": "01 / TRACCIA", "es": "01 / MIDE"}},
        {"key": "track_headline",      "field_type": "heading", "translations": {"en": "Every performance is recorded.", "it": "Ogni performance viene registrata.", "es": "Cada rendimiento queda registrado."}},
        {"key": "track_body",          "field_type": "richtext","translations": {"en": "NEXUS validates every rep, every result. Nothing is lost. Nothing is inflated. Your history is permanent.", "it": "NEXUS valida ogni rep, ogni risultato. Niente va perso. Niente viene gonfiato. La tua storia è permanente.", "es": "NEXUS valida cada rep, cada resultado. Nada se pierde. Nada se infla. Tu historial es permanente."}},
        {"key": "rank_badge",          "field_type": "label",   "translations": {"en": "02 / RANK", "it": "02 / RANK", "es": "02 / RANKING"}},
        {"key": "rank_headline",       "field_type": "heading", "translations": {"en": "You are not training. You are competing.", "it": "Non ti stai allenando. Stai competendo.", "es": "No estás entrenando. Estás compitiendo."}},
        {"key": "rank_body",           "field_type": "richtext","translations": {"en": "K-Rating from 0 to 1000. Updated after every session. Compared globally. You always know where you stand.", "it": "K-Rating da 0 a 1000. Aggiornato dopo ogni sessione. Confrontato globalmente. Sai sempre dove ti trovi.", "es": "K-Rating de 0 a 1000. Actualizado después de cada sesión. Comparado globalmente. Siempre sabes dónde estás."}},
        {"key": "challenge_badge",     "field_type": "label",   "translations": {"en": "03 / CHALLENGE", "it": "03 / SFIDA", "es": "03 / DESAFÍO"}},
        {"key": "challenge_headline",  "field_type": "heading", "translations": {"en": "Launch or accept challenges anytime.", "it": "Lancia o accetta sfide in qualsiasi momento.", "es": "Lanza o acepta desafíos en cualquier momento."}},
        {"key": "challenge_body",      "field_type": "richtext","translations": {"en": "Direct 1v1. Open events. Live competitions. The Arena is always open. There is always someone to beat.", "it": "Diretto 1vs1. Eventi aperti. Competizioni live. L'Arena è sempre aperta. C'è sempre qualcuno da battere.", "es": "Duelo directo 1vs1. Eventos abiertos. Competiciones en vivo. La Arena siempre está abierta. Siempre hay alguien a quien superar."}},
        {"key": "next_badge",          "field_type": "label",   "translations": {"en": "THE PROCESS", "it": "IL PROCESSO", "es": "EL PROCESO"}},
        {"key": "next_title",          "field_type": "heading", "translations": {"en": "What happens next", "it": "Cosa succede dopo", "es": "Qué pasa después"}},
        {"key": "next_1",              "field_type": "text",    "translations": {"en": "You perform", "it": "Ti alleni", "es": "Realizas tu actividad"}},
        {"key": "next_2",              "field_type": "text",    "translations": {"en": "You get ranked", "it": "Vieni classificato", "es": "Obtienes una clasificación"}},
        {"key": "next_3",              "field_type": "text",    "translations": {"en": "You get compared", "it": "Vieni confrontato", "es": "Te comparan"}},
        {"key": "next_4",              "field_type": "text",    "translations": {"en": "You come back", "it": "Torni", "es": "Vuelves"}},
        {"key": "sport_badge",         "field_type": "label",   "translations": {"en": "YOUR ARENA", "it": "LA TUA ARENA", "es": "TU ARENA"}},
        {"key": "sport_h2_line1",      "field_type": "heading", "translations": {"en": "Your sport.", "it": "Il tuo sport.", "es": "Tu deporte."}},
        {"key": "sport_h2_line2",      "field_type": "heading", "translations": {"en": "Your arena.", "it": "La tua arena.", "es": "Tu arena."}},
        {"key": "sport_body",          "field_type": "richtext","translations": {"en": "ArenaKore works across any discipline. One identity. One ranking. Any sport.", "it": "ArenaKore funziona in qualsiasi disciplina. Una identità. Un ranking. Qualsiasi sport.", "es": "ArenaKore funciona en cualquier disciplina. Una identidad. Un ranking. Cualquier deporte."}},
        {"key": "proof_badge",         "field_type": "label",   "translations": {"en": "LIVE NOW", "it": "LIVE ORA", "es": "EN VIVO"}},
        {"key": "proof_perf",          "field_type": "text",    "translations": {"en": "1,024 performances tracked today", "it": "1.024 performance registrate oggi", "es": "1.024 rendimientos registrados hoy"}},
        {"key": "proof_athletes",      "field_type": "text",    "translations": {"en": "28 athletes competing now", "it": "28 atleti stanno competendo ora", "es": "28 atletas compitiendo ahora"}},
        {"key": "final_h2_line1",      "field_type": "heading", "translations": {"en": "DOWNLOAD.", "it": "SCARICA.", "es": "DESCARGA."}},
        {"key": "final_h2_line2",      "field_type": "heading", "translations": {"en": "ENTER.", "it": "ENTRA.", "es": "ENTRA."}},
        {"key": "final_h2_line3",      "field_type": "heading", "translations": {"en": "COMPETE.", "it": "COMPETI.", "es": "COMPITE."}},
        {"key": "final_body",          "field_type": "richtext","translations": {"en": "The Arena is open. Your rank is waiting. Every day you delay is a day someone else moves ahead.", "it": "L'Arena è aperta. Il tuo rank ti aspetta. Ogni giorno che aspetti è un giorno in cui qualcun altro avanza.", "es": "La Arena está abierta. Tu ranking te espera. Cada día que esperas es un día que alguien más avanza."}},
        {"key": "final_free",          "field_type": "label",   "translations": {"en": "Free to download · Available worldwide", "it": "Gratis · Disponibile ovunque", "es": "Gratis · Disponible en todo el mundo"}},
        {"key": "final_learn",         "field_type": "cta",     "translations": {"en": "Learn about the Arena System", "it": "Scopri il Sistema Arena", "es": "Conocer el Sistema Arena"}},
    ],
    "for-athletes": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "FOR ATHLETES", "it": "PER ATLETI", "es": "PARA ATLETAS"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "YOU DON'T TRAIN. YOU COMPETE.", "it": "NON TI ALLENI. COMPETE.", "es": "NO ENTRENAS. COMPITES."}},
        {"key": "hero_sub",            "field_type": "heading", "translations": {"en": "NEXUS eliminates choice and assigns relevant challenges for your level.", "it": "NEXUS elimina la scelta e assegna sfide rilevanti per il tuo livello.", "es": "NEXUS elimina la elección y asigna desafíos relevantes para tu nivel."}},
        {"key": "hero_cta",            "field_type": "cta",     "translations": {"en": "Start Your First Challenge", "it": "Inizia la Tua Prima Sfida", "es": "Empieza Tu Primer Desafío"}},
        {"key": "hero_tagline",        "field_type": "text",    "translations": {"en": "You are not just training. You are competing.", "it": "Non ti stai solo allenando. Stai competendo.", "es": "No solo estás entrenando. Estás compitiendo."}},
        {"key": "identity_pretext",    "field_type": "text",    "translations": {"en": "ONCE YOU ENTER, YOU'RE NOT JUST AN ATHLETE.", "it": "UNA VOLTA CHE ENTRI, NON SEI PIÙ SOLO UN ATLETA.", "es": "UNA VEZ QUE ENTRAS, NO ERES SOLO UN ATLETA."}},
        {"key": "identity_h2_line1",   "field_type": "heading", "translations": {"en": "YOU ARE A", "it": "SEI UN", "es": "ERES UN"}},
        {"key": "identity_h2_line2",   "field_type": "heading", "translations": {"en": "KORE.", "it": "KORE.", "es": "KORE."}},
        {"key": "identity_body",       "field_type": "richtext","translations": {"en": "A KORE is not a user. Not a member. Not a subscriber. A KORE is a competitor with a permanent record, a certified rank, and an identity built entirely on real performance.", "it": "Un KORE non è un utente. Non è un iscritto. Non è un abbonato. Un KORE è un competitor con un record permanente, un rank certificato e un'identità costruita interamente sulla performance reale.", "es": "Un KORE no es un usuario. No es un miembro. No es un suscriptor. Un KORE es un competidor con un historial permanente, un ranking certificado y una identidad construida completamente sobre el rendimiento real."}},
        {"key": "kore_badge",          "field_type": "label",   "translations": {"en": "THE KORE SYSTEM", "it": "IL SISTEMA KORE", "es": "EL SISTEMA KORE"}},
        {"key": "kore_h2",             "field_type": "heading", "translations": {"en": "WHAT IT MEANS TO BE A KORE.", "it": "COSA SIGNIFICA ESSERE UN KORE.", "es": "QUÉ SIGNIFICA SER UN KORE."}},
        {"key": "kore_challenges",     "field_type": "text",    "translations": {"en": "CHALLENGES — NEXUS-assigned. Daily. Permanent. Every challenge you execute becomes your record.", "it": "SFIDE — Assegnate da NEXUS. Quotidiane. Permanenti. Ogni sfida che esegui diventa parte del tuo record.", "es": "DESAFÍOS — Asignados por NEXUS. Diarios. Permanentes. Cada desafío que ejecutas forma parte de tu historial."}},
        {"key": "kore_ranking",        "field_type": "text",    "translations": {"en": "RANKING — K-Rating from 0 to 1000. Earned through performance. Updated after every session.", "it": "RANKING — K-Rating da 0 a 1000. Guadagnato attraverso le performance. Aggiornato dopo ogni sessione.", "es": "RANKING — K-Rating de 0 a 1000. Ganado a través del rendimiento. Actualizado después de cada sesión."}},
        {"key": "kore_competition",    "field_type": "text",    "translations": {"en": "COMPETITION — The Arena never closes. There is always someone above you. Always someone coming for your rank.", "it": "COMPETIZIONE — L'Arena non chiude mai. C'è sempre qualcuno sopra di te. Sempre qualcuno che punta al tuo rank.", "es": "COMPETICIÓN — La Arena nunca cierra. Siempre hay alguien por encima de ti. Siempre alguien que va a por tu ranking."}},
        {"key": "kore_visibility",     "field_type": "text",    "translations": {"en": "VISIBILITY — Your performance is public. Your history is permanent. You can't hide your numbers here.", "it": "VISIBILITÀ — La tua performance è pubblica. La tua storia è permanente. Non puoi nascondere i tuoi numeri qui.", "es": "VISIBILIDAD — Tu rendimiento es público. Tu historial es permanente. No puedes ocultar tus números aquí."}},
        {"key": "kflux_badge",         "field_type": "label",   "translations": {"en": "K-FLUX", "it": "K-FLUX", "es": "K-FLUX"}},
        {"key": "kflux_h2",            "field_type": "heading", "translations": {"en": "EVERY ACTION GENERATES K-FLUX.", "it": "OGNI AZIONE GENERA K-FLUX.", "es": "CADA ACCIÓN GENERA K-FLUX."}},
        {"key": "kflux_body",          "field_type": "richtext","translations": {"en": "K-Flux is the currency of the Arena. It doesn't come from showing up. It comes from performing. From being consistent. From pushing past the rep you were about to skip.", "it": "Il K-Flux è la valuta dell'Arena. Non arriva dal presentarsi. Arriva dal performare. Dall'essere costanti. Dal superare la rep che stavi per saltare.", "es": "El K-Flux es la moneda de la Arena. No viene de aparecer. Viene de rendir. De ser constante. De superar la rep que ibas a saltarte."}},
        {"key": "nexus_badge",         "field_type": "label",   "translations": {"en": "NEXUS ENGINE", "it": "MOTORE NEXUS", "es": "MOTOR NEXUS"}},
        {"key": "nexus_h2",            "field_type": "heading", "translations": {"en": "SCAN. TRACK. EVOLVE.", "it": "SCANSIONA. TRACCIA. EVOLVI.", "es": "ESCANEA. MIDE. EVOLUCIONA."}},
        {"key": "nexus_body",          "field_type": "richtext","translations": {"en": "NEXUS creates and selects challenges designed by professional coaches and validated on thousands of athletes. NEXUS does not watch you train. It measures every execution and certifies the result.", "it": "NEXUS non ti guarda allenarti. Ti giudica. Il Puppet Motion Detection traccia ogni articolazione, ogni angolo, ogni rep. Una rep che non soddisfa lo standard non conta. Non è punizione. È verità.", "es": "NEXUS no te observa entrenar. Te juzga. El Puppet Motion Detection rastrea cada articulación, cada ángulo, cada rep. Una rep que no cumple el estándar no cuenta. No es castigo. Es verdad."}},
        {"key": "challenges_badge",    "field_type": "label",   "translations": {"en": "THE ARENA", "it": "L'ARENA", "es": "LA ARENA"}},
        {"key": "challenges_h2",       "field_type": "heading", "translations": {"en": "CHALLENGE ANYONE.", "it": "SFIDA CHIUNQUE.", "es": "DESAFÍA A CUALQUIERA."}},
        {"key": "final_badge",         "field_type": "label",   "translations": {"en": "THE FINAL CHOICE", "it": "LA SCELTA FINALE", "es": "LA ELECCIÓN FINAL"}},
        {"key": "final_h2",            "field_type": "heading", "translations": {"en": "COMPETE OR FALL BEHIND.", "it": "COMPETE O RESTA INDIETRO.", "es": "COMPITE O QUÉDATE ATRÁS."}},
        {"key": "final_body",          "field_type": "text",    "translations": {"en": "Right now, someone is training harder than you. They're in the Arena. Are you?", "it": "In questo momento qualcuno si sta allenando più di te. È nell'Arena. Ci sei anche tu?", "es": "Ahora mismo alguien está entrenando más duro que tú. Están en la Arena. ¿Estás tú?"}},
        {"key": "final_cta",           "field_type": "cta",     "translations": {"en": "Enter the Arena", "it": "Entra nell'Arena", "es": "Entra en la Arena"}},
        {"key": "final_t1",            "field_type": "label",   "translations": {"en": "Free to start", "it": "Gratis per iniziare", "es": "Gratis para empezar"}},
        {"key": "final_t2",            "field_type": "label",   "translations": {"en": "Reps validated", "it": "Rep verificate", "es": "Reps verificadas"}},
        {"key": "final_t3",            "field_type": "label",   "translations": {"en": "Rank earned", "it": "Rank guadagnato", "es": "Ranking ganado"}},
    ],
    "gym-pilot": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "14-DAY PILOT · GYMS", "it": "PILOT 14 GIORNI · PALESTRE", "es": "PILOTO 14 DÍAS · GIMNASIOS"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "COACHES CREATE THE CHALLENGES.", "it": "I COACH CREANO LE SFIDE.", "es": "LOS COACHES CREAN LOS DESAFÍOS."}},
        {"key": "hero_sub",            "field_type": "text",    "translations": {"en": "NEXUS selects and distributes the most effective protocols.", "it": "NEXUS seleziona e distribuisce i protocolli più efficaci.", "es": "NEXUS selecciona y distribuye los protocolos más efectivos."}},
        {"key": "hero_cta",            "field_type": "cta",     "translations": {"en": "Start your pilot — Free", "it": "Avvia il tuo pilot — Gratis", "es": "Inicia tu piloto — Gratis"}},
        {"key": "reinforcement_1",     "field_type": "text",    "translations": {"en": "No setup. No disruption. We activate your athletes in 48 hours.", "it": "Nessun setup. Nessuna interruzione. Attiviamo i tuoi atleti in 48 ore.", "es": "Sin configuración. Sin interrupciones. Activamos a tus atletas en 48 horas."}},
        {"key": "reinforcement_2",     "field_type": "text",    "translations": {"en": "20–30 athletes. 14 days. Real results.", "it": "20–30 atleti. 14 giorni. Risultati reali.", "es": "20–30 atletas. 14 días. Resultados reales."}},
        {"key": "problem_badge",       "field_type": "label",   "translations": {"en": "THE REAL PROBLEM", "it": "IL VERO PROBLEMA", "es": "EL VERDADERO PROBLEMA"}},
        {"key": "problem_h2",          "field_type": "heading", "translations": {"en": "THE PROBLEM ISN'T ACQUISITION. IT'S RETENTION.", "it": "IL PROBLEMA NON È L'ACQUISIZIONE. È LA RETENTION.", "es": "EL PROBLEMA NO ES LA CAPTACIÓN. ES LA RETENCIÓN."}},
        {"key": "solution_h2",         "field_type": "heading", "translations": {"en": "ARENAKORE TRANSFORMS YOUR GYM INTO A COMPETITIVE SYSTEM.", "it": "ARENAKORE TRASFORMA LA TUA PALESTRA IN UN SISTEMA COMPETITIVO.", "es": "ARENAKORE TRANSFORMA TU GIMNASIO EN UN SISTEMA COMPETITIVO."}},
        {"key": "how_badge",           "field_type": "label",   "translations": {"en": "HOW THE PILOT WORKS", "it": "COME FUNZIONA IL PILOT", "es": "CÓMO FUNCIONA EL PILOTO"}},
        {"key": "how_h2",              "field_type": "heading", "translations": {"en": "4 STEPS. 14 DAYS.", "it": "4 PASSI. 14 GIORNI.", "es": "4 PASOS. 14 DÍAS."}},
        {"key": "step1_title",         "field_type": "heading", "translations": {"en": "We activate 20–30 members", "it": "Attiviamo 20–30 membri", "es": "Activamos 20–30 miembros"}},
        {"key": "step1_desc",          "field_type": "text",    "translations": {"en": "We select your most engaged members for the launch. Onboarded in 30 minutes.", "it": "Selezioniamo i membri più coinvolti per il lancio. Onboarding in 30 minuti.", "es": "Seleccionamos a los miembros más comprometidos para el lanzamiento. Onboarding en 30 minutos."}},
        {"key": "step2_title",         "field_type": "heading", "translations": {"en": "We launch the challenges", "it": "Lanciamo le sfide", "es": "Lanzamos los desafíos"}},
        {"key": "step2_desc",          "field_type": "text",    "translations": {"en": "We set up the first week of custom challenges on your programming. No change to your method.", "it": "Impostiamo la prima settimana di challenge personalizzate sulla tua programmazione. Nessun cambio al tuo metodo.", "es": "Configuramos la primera semana de desafíos personalizados en tu programación. Sin cambios en tu método."}},
        {"key": "step3_title",         "field_type": "heading", "translations": {"en": "We track performance", "it": "Tracciamo le performance", "es": "Medimos el rendimiento"}},
        {"key": "step3_desc",          "field_type": "text",    "translations": {"en": "NEXUS validates every rep. K-Rating updates after each session. You see who trains, who climbs, who's at risk.", "it": "NEXUS valida ogni rep. Il K-Rating si aggiorna dopo ogni sessione. Vedi chi si allena, chi scala, chi rischia.", "es": "NEXUS valida cada rep. El K-Rating se actualiza tras cada sesión. Ves quién entrena, quién sube, quién está en riesgo."}},
        {"key": "step4_title",         "field_type": "heading", "translations": {"en": "Your gym becomes competitive", "it": "La palestra diventa competitiva", "es": "Tu gimnasio se vuelve competitivo"}},
        {"key": "step4_desc",          "field_type": "text",    "translations": {"en": "After 14 days you have real data: more attendance, more interaction, visible ranking. Then you decide.", "it": "Dopo 14 giorni hai dati reali: più presenze, più interazione, ranking visibile. Poi decidi tu.", "es": "Después de 14 días tienes datos reales: más asistencia, más interacción, ranking visible. Tú decides."}},
        {"key": "offer_badge",         "field_type": "label",   "translations": {"en": "THE PILOT OFFER", "it": "L'OFFERTA PILOT", "es": "LA OFERTA PILOTO"}},
        {"key": "offer_h2",            "field_type": "heading", "translations": {"en": "TEST IT. ZERO RISK.", "it": "TESTALO. ZERO RISCHI.", "es": "PRUÉBALO. RIESGO CERO."}},
        {"key": "offer_body",          "field_type": "richtext","translations": {"en": "No contract. No credit card. Just 14 days to see what happens when your gym becomes competitive.", "it": "Nessun contratto. Nessuna carta di credito. Solo 14 giorni per vedere cosa succede quando la tua palestra diventa competitiva.", "es": "Sin contrato. Sin tarjeta de crédito. Solo 14 días para ver qué pasa cuando tu gimnasio se vuelve competitivo."}},
        {"key": "form_title",          "field_type": "heading", "translations": {"en": "REQUEST YOUR PILOT", "it": "RICHIEDI IL PILOT", "es": "SOLICITA EL PILOTO"}},
        {"key": "form_subtitle",       "field_type": "label",   "translations": {"en": "No credit card · No commitment", "it": "Nessuna carta di credito · Zero impegno", "es": "Sin tarjeta de crédito · Sin compromiso"}},
        {"key": "faq_h2",              "field_type": "heading", "translations": {"en": "FREQUENTLY ASKED QUESTIONS", "it": "DOMANDE FREQUENTI", "es": "PREGUNTAS FRECUENTES"}},
        {"key": "final_h2",            "field_type": "heading", "translations": {"en": "TWO WEEKS.", "it": "DUE SETTIMANE.", "es": "DOS SEMANAS."}},
        {"key": "final_sub",           "field_type": "text",    "translations": {"en": "Then you decide.", "it": "Poi decidi tu.", "es": "Luego decides tú."}},
        {"key": "final_cta",           "field_type": "cta",     "translations": {"en": "Start the Pilot", "it": "Avvia il Pilot", "es": "Iniciar el Piloto"}},
    ],
    "arena-system": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "PERFORMANCE VALIDATION SYSTEM", "it": "SISTEMA DI VALIDAZIONE DELLE PERFORMANCE", "es": "SISTEMA DE VALIDACIÓN DEL RENDIMIENTO"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "NOT A PLATFORM. A SYSTEM.", "it": "NON È UNA PIATTAFORMA. È UN SISTEMA.", "es": "NO ES UNA PLATAFORMA. ES UN SISTEMA."}},
        {"key": "hero_sub",            "field_type": "text",    "translations": {"en": "A system designed to test and measure real performance.", "it": "Un sistema progettato per testare e misurare le performance reali.", "es": "Un sistema diseñado para testear y medir el rendimiento real."}},
        {"key": "hero_sub2",           "field_type": "text",    "translations": {"en": "Any sport. Any discipline. One system.", "it": "Qualsiasi sport. Qualsiasi disciplina. Un sistema.", "es": "Cualquier deporte. Cualquier disciplina. Un sistema."}},
        {"key": "not_fitness_app",     "field_type": "label",   "translations": {"en": "This is not a fitness app. NEXUS runs the system. Athletes execute.", "it": "Questo non è un'app fitness. NEXUS gestisce il sistema. Gli atleti eseguono.", "es": "Esto no es una app de fitness. NEXUS gestiona el sistema. Los atletas ejecutan."}},
        {"key": "what_badge",          "field_type": "label",   "translations": {"en": "WHAT IT DOES", "it": "COSA FA", "es": "QUÉ HACE"}},
        {"key": "what_h2",             "field_type": "heading", "translations": {"en": "THREE THINGS.", "it": "TRE COSE.", "es": "TRES COSAS."}},
        {"key": "what_h2_2",           "field_type": "heading", "translations": {"en": "NO COMPROMISE.", "it": "SENZA COMPROMESSI.", "es": "SIN COMPROMISO."}},
        {"key": "track_title",         "field_type": "heading", "translations": {"en": "Track performance.", "it": "Traccia le performance.", "es": "Mide el rendimiento."}},
        {"key": "track_body",          "field_type": "richtext","translations": {"en": "Every rep, every result — captured and certified. Nothing is lost. Nothing is inflated. Your history is permanent.", "it": "Ogni rep, ogni risultato — catturati e certificati. Niente va perso. Niente viene gonfiato. La tua storia è permanente.", "es": "Cada rep, cada resultado — capturados y certificados. Nada se pierde. Nada se infla. Tu historial es permanente."}},
        {"key": "rank_title",          "field_type": "heading", "translations": {"en": "Rank every result.", "it": "Classifica ogni risultato.", "es": "Clasifica cada resultado."}},
        {"key": "rank_body",           "field_type": "richtext","translations": {"en": "K-Rating from 0 to 1000. Public. Permanent. Updated after every session. Compared globally. You always know where you stand.", "it": "K-Rating da 0 a 1000. Pubblico. Permanente. Aggiornato dopo ogni sessione. Confrontato globalmente. Sai sempre dove ti trovi.", "es": "K-Rating de 0 a 1000. Público. Permanente. Actualizado después de cada sesión. Comparado globalmente. Siempre sabes dónde estás."}},
        {"key": "challenge_title",     "field_type": "heading", "translations": {"en": "Create continuous competition.", "it": "Crea competizione continua.", "es": "Crea competición continua."}},
        {"key": "challenge_body",      "field_type": "richtext","translations": {"en": "New challenges every day. Open or 1v1. Across disciplines. The Arena never closes. There is always someone to beat.", "it": "Nuove sfide ogni giorno. Aperte o 1vs1. In tutte le discipline. L'Arena non chiude mai. C'è sempre qualcuno da battere.", "es": "Nuevos desafíos cada día. Abiertos o 1vs1. En todas las disciplinas. La Arena nunca cierra. Siempre hay alguien a quien superar."}},
        {"key": "why_badge",           "field_type": "label",   "translations": {"en": "BEHAVIORAL SCIENCE", "it": "SCIENZA DEL COMPORTAMENTO", "es": "CIENCIA DEL COMPORTAMIENTO"}},
        {"key": "why_h2",              "field_type": "heading", "translations": {"en": "COMPETITION CHANGES BEHAVIOR.", "it": "LA COMPETIZIONE CAMBIA IL COMPORTAMENTO.", "es": "LA COMPETICIÓN CAMBIA EL COMPORTAMIENTO."}},
        {"key": "why_1",               "field_type": "heading", "translations": {"en": "Visibility creates pressure.", "it": "La visibilità crea pressione.", "es": "La visibilidad crea presión."}},
        {"key": "why_1_body",          "field_type": "text",    "translations": {"en": "When your score is public, skipping a session has a cost. Visibility is the most powerful behavioral lever in competitive sport.", "it": "Quando il tuo punteggio è pubblico, saltare una sessione ha un costo. La visibilità è la leva comportamentale più potente nello sport competitivo.", "es": "Cuando tu puntuación es pública, saltarse una sesión tiene un coste. La visibilidad es la palanca conductual más poderosa en el deporte competitivo."}},
        {"key": "why_2",               "field_type": "heading", "translations": {"en": "Ranking creates engagement.", "it": "Il ranking crea coinvolgimento.", "es": "El ranking crea participación."}},
        {"key": "why_2_body",          "field_type": "text",    "translations": {"en": "Nobody ignores a leaderboard they're on. K-Rating gives every athlete a personal stake in every session.", "it": "Nessuno ignora una classifica in cui si trova. Il K-Rating dà a ogni atleta un interesse personale in ogni sessione.", "es": "Nadie ignora un ranking en el que está. El K-Rating le da a cada atleta un interés personal en cada sesión."}},
        {"key": "why_3",               "field_type": "heading", "translations": {"en": "Repetition creates consistency.", "it": "La ripetizione crea costanza.", "es": "La repetición crea consistencia."}},
        {"key": "why_3_body",          "field_type": "text",    "translations": {"en": "Daily challenges with real consequences build training habits that self-motivation alone cannot sustain.", "it": "Le sfide quotidiane con conseguenze reali costruiscono abitudini di allenamento che la sola automotivazione non può sostenere.", "es": "Los desafíos diarios con consecuencias reales crean hábitos de entrenamiento que la automotivación sola no puede sostener."}},
        {"key": "sport_badge",         "field_type": "label",   "translations": {"en": "ANY DISCIPLINE", "it": "QUALSIASI DISCIPLINA", "es": "CUALQUIER DISCIPLINA"}},
        {"key": "sport_h2",            "field_type": "heading", "translations": {"en": "WORKS IN ANY DISCIPLINE.", "it": "FUNZIONA IN QUALSIASI DISCIPLINA.", "es": "FUNCIONA EN CUALQUIER DISCIPLINA."}},
        {"key": "sport_body",          "field_type": "richtext","translations": {"en": "ArenaKore is not built for one sport. It's built for any activity where performance can be measured, validated and compared.", "it": "ArenaKore non è costruita per uno sport. È costruita per qualsiasi attività in cui le performance possono essere misurate, validate e confrontate.", "es": "ArenaKore no está construida para un deporte. Está construida para cualquier actividad donde el rendimiento se pueda medir, validar y comparar."}},
        {"key": "nexus_badge",         "field_type": "label",   "translations": {"en": "POWERED BY NEXUS", "it": "ALIMENTATO DA NEXUS", "es": "IMPULSADO POR NEXUS"}},
        {"key": "nexus_callout",       "field_type": "heading", "translations": {"en": "NEXUS VALIDATES EVERY REP.", "it": "NEXUS VALIDA OGNI REP.", "es": "NEXUS VALIDA CADA REP."}},
        {"key": "nexus_body",          "field_type": "text",    "translations": {"en": "Puppet Motion Detection. Real-time bio-analysis. Bad form doesn't count. The score is always real.", "it": "Puppet Motion Detection. Bio-analisi in tempo reale. La forma scorretta non conta. Il punteggio è sempre reale.", "es": "Puppet Motion Detection. Bio-análisis en tiempo real. La mala técnica no cuenta. La puntuación siempre es real."}},
        {"key": "final_h2",            "field_type": "heading", "translations": {"en": "ENTER THE SYSTEM.", "it": "ENTRA NEL SISTEMA.", "es": "ENTRA EN EL SISTEMA."}},
        {"key": "final_body",          "field_type": "richtext","translations": {"en": "ArenaKore is a universal competition system for any performance-based activity.", "it": "ArenaKore è un sistema di competizione universale per qualsiasi attività basata sulle performance.", "es": "ArenaKore es un sistema de competición universal para cualquier actividad basada en el rendimiento."}},
    ],
    "competition": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "WORKOUT COMPETITION", "it": "COMPETIZIONE ALLENAMENTO", "es": "COMPETICIÓN ENTRENAMIENTO"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "TRAIN TO WIN. COMPETE TO PROVE IT.", "it": "ALLENATI PER VINCERE. COMPETE PER DIMOSTRARLO.", "es": "ENTRENA PARA GANAR. COMPITE PARA DEMOSTRARLO."}},
        {"key": "intro_h2",            "field_type": "heading", "translations": {"en": "Training without competition is just exercise.", "it": "L'allenamento senza competizione è solo esercizio.", "es": "Entrenar sin competición es solo ejercicio."}},
        {"key": "intro_body",          "field_type": "richtext","translations": {"en": "ArenaKore converts every training session into a competitive event. Your performance is ranked against real athletes globally. Not likes. Not followers. Rankings based on verified results.", "it": "ArenaKore converte ogni sessione di allenamento in un evento competitivo. Le tue performance vengono classificate contro atleti reali globalmente. Non like. Non follower. Rankings basati su risultati verificati.", "es": "ArenaKore convierte cada sesión de entrenamiento en un evento competitivo. Tu rendimiento se clasifica frente a atletas reales globalmente. No likes. No seguidores. Rankings basados en resultados verificados."}},
        {"key": "problem_h2",          "field_type": "heading", "translations": {"en": "Why competitive athletes leave mainstream apps.", "it": "Perché gli atleti competitivi abbandonano le app tradizionali.", "es": "Por qué los atletas competitivos abandonan las apps convencionales."}},
        {"key": "solution_h2",         "field_type": "heading", "translations": {"en": "The arena where performance is everything.", "it": "L'arena dove la performance è tutto.", "es": "La arena donde el rendimiento lo es todo."}},
        {"key": "solution_body",       "field_type": "richtext","translations": {"en": "In ArenaKore, you earn your rank. NEXUS validates every movement. K-Rating tracks your score from 0 to 1000. Every challenge updates your permanent record.", "it": "In ArenaKore, guadagni il tuo rank. NEXUS valida ogni movimento. Il K-Rating traccia il tuo punteggio da 0 a 1000. Ogni sfida aggiorna il tuo record permanente.", "es": "En ArenaKore, ganas tu ranking. NEXUS valida cada movimiento. El K-Rating rastrea tu puntuación de 0 a 1000. Cada desafío actualiza tu historial permanente."}},
        {"key": "prove_it",            "field_type": "cta",     "translations": {"en": "PROVE IT.", "it": "DIMOSTRALO.", "es": "DEMUÉSTRALO."}},
    ],
    "amrap": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "AMRAP TRAINING", "it": "ALLENAMENTO AMRAP", "es": "ENTRENAMIENTO AMRAP"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "AS MANY REPS AS POSSIBLE. WE'RE COUNTING.", "it": "IL MAGGIOR NUMERO DI REP POSSIBILE. LI CONTIAMO NOI.", "es": "LA MAYOR CANTIDAD DE REPS POSIBLE. NOSOTROS CONTAMOS."}},
        {"key": "intro_h2",            "field_type": "heading", "translations": {"en": "AMRAP is simple. Executing it correctly is not.", "it": "AMRAP è semplice. Eseguirlo correttamente no.", "es": "AMRAP es simple. Ejecutarlo correctamente no."}},
        {"key": "intro_body",          "field_type": "richtext","translations": {"en": "NEXUS tracks every rep in your AMRAP, validates form in real-time, and gives you a certified score comparable against other athletes.", "it": "NEXUS traccia ogni rep del tuo AMRAP, valida la forma in tempo reale e ti dà un punteggio certificato confrontabile con altri atleti.", "es": "NEXUS rastrea cada rep de tu AMRAP, valida la técnica en tiempo real y te da una puntuación certificada comparable con otros atletas."}},
        {"key": "problem_h2",          "field_type": "heading", "translations": {"en": "The AMRAP problem nobody talks about.", "it": "Il problema AMRAP di cui nessuno parla.", "es": "El problema AMRAP del que nadie habla."}},
        {"key": "problem_body",        "field_type": "richtext","translations": {"en": "You count your own reps — accuracy varies. Bad form reps count the same as good ones. No way to compare results between athletes fairly.", "it": "Conti le tue rep — l'accuratezza varia. Le rep con forma scorretta contano come quelle buone. Nessun modo di confrontare i risultati tra atleti in modo equo.", "es": "Cuentas tus propias reps — la precisión varía. Las reps con mala técnica cuentan igual que las buenas. No hay forma de comparar resultados entre atletas de forma justa."}},
        {"key": "solution_h2",         "field_type": "heading", "translations": {"en": "AMRAP the way it was designed to be done.", "it": "AMRAP come è stato progettato per essere fatto.", "es": "AMRAP como fue diseñado para hacerse."}},
        {"key": "prove_it",            "field_type": "cta",     "translations": {"en": "PROVE IT.", "it": "DIMOSTRALO.", "es": "DEMUÉSTRALO."}},
    ],
    "crossfit": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "CROSSFIT CHALLENGE", "it": "SFIDA CROSSFIT", "es": "DESAFÍO CROSSFIT"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "BOX VS BOX. NO EXCUSES.", "it": "BOX VS BOX. ZERO SCUSE.", "es": "BOX VS BOX. SIN EXCUSAS."}},
        {"key": "intro_h2",            "field_type": "heading", "translations": {"en": "Your box. Their box. One winner.", "it": "Il tuo box. Il loro box. Un solo vincitore.", "es": "Tu box. Su box. Un solo ganador."}},
        {"key": "intro_body",          "field_type": "richtext","translations": {"en": "ArenaKore transforms CrossFit from individual effort to inter-box competition. Coaches set the WOD. Athletes perform. NEXUS validates every rep. The leaderboard shows who actually did the work.", "it": "ArenaKore trasforma il CrossFit dallo sforzo individuale alla competizione inter-box. I coach impostano il WOD. Gli atleti performano. NEXUS valida ogni rep. La classifica mostra chi ha davvero fatto il lavoro.", "es": "ArenaKore transforma CrossFit de esfuerzo individual a competición inter-box. Los coaches programan el WOD. Los atletas rinden. NEXUS valida cada rep. El leaderboard muestra quién realmente hizo el trabajo."}},
        {"key": "problem_h2",          "field_type": "heading", "translations": {"en": "CrossFit deserves better than spreadsheets.", "it": "Il CrossFit merita di meglio dei fogli di calcolo.", "es": "CrossFit merece algo mejor que hojas de cálculo."}},
        {"key": "solution_h2",         "field_type": "heading", "translations": {"en": "Built for the intensity of CrossFit.", "it": "Costruita per l'intensità del CrossFit.", "es": "Construida para la intensidad del CrossFit."}},
        {"key": "prove_it",            "field_type": "cta",     "translations": {"en": "PROVE IT.", "it": "DIMOSTRALO.", "es": "DEMUÉSTRALO."}},
    ],
    "gamification": [
        {"key": "hero_badge",          "field_type": "label",   "translations": {"en": "FITNESS GAMIFICATION", "it": "GAMIFICATION FITNESS", "es": "GAMIFICACIÓN FITNESS"}},
        {"key": "hero_h1",             "field_type": "heading", "translations": {"en": "GAMIFY FITNESS. DOMINATE RETENTION.", "it": "GAMIFICA IL FITNESS. DOMINA LA RETENTION.", "es": "GAMIFICA EL FITNESS. DOMINA LA RETENCIÓN."}},
        {"key": "intro_h2",            "field_type": "heading", "translations": {"en": "Gamification is not a gimmick. It's behavioral science.", "it": "La gamification non è un trucco. È scienza comportamentale.", "es": "La gamificación no es un truco. Es ciencia conductual."}},
        {"key": "intro_body",          "field_type": "richtext","translations": {"en": "The reason most fitness apps fail isn't the features — it's the psychology. People stop when there's no consequence. ArenaKore applies proven gamification mechanics: rankings, challenges, streaks, validated progress, and public results.", "it": "Il motivo per cui la maggior parte delle app fitness fallisce non sono le funzionalità — è la psicologia. Le persone si fermano quando non ci sono conseguenze. ArenaKore applica meccaniche di gamification comprovate: ranking, sfide, streak, progressi validati e risultati pubblici.", "es": "La razón por la que la mayoría de las apps de fitness fracasan no son las funciones — es la psicología. La gente para cuando no hay consecuencias. ArenaKore aplica mecánicas de gamificación probadas: rankings, desafíos, rachas, progreso validado y resultados públicos."}},
        {"key": "stat_engagement",     "field_type": "text",    "translations": {"en": "+30% engagement", "it": "+30% coinvolgimento", "es": "+30% participación"}},
        {"key": "stat_retention",      "field_type": "text",    "translations": {"en": "+40% retention", "it": "+40% fidelizzazione", "es": "+40% retención"}},
        {"key": "problem_h2",          "field_type": "heading", "translations": {"en": "Why 80% of gym members quit within 6 months.", "it": "Perché l'80% degli iscritti in palestra abbandona entro 6 mesi.", "es": "Por qué el 80% de los miembros del gimnasio abandona en 6 meses."}},
        {"key": "solution_h2",         "field_type": "heading", "translations": {"en": "The gamification system that actually changes behavior.", "it": "Il sistema di gamification che cambia davvero il comportamento.", "es": "El sistema de gamificación que realmente cambia el comportamiento."}},
        {"key": "solution_body",       "field_type": "richtext","translations": {"en": "ArenaKore's NEXUS engine creates real stakes. Your K-Rating is public. Your challenges are permanent. Your DNA score evolves. Every training decision has a visible, measurable consequence.", "it": "Il motore NEXUS di ArenaKore crea posta in gioco reale. Il tuo K-Rating è pubblico. Le tue sfide sono permanenti. Il tuo DNA score evolve. Ogni decisione di allenamento ha una conseguenza visibile e misurabile.", "es": "El motor NEXUS de ArenaKore crea apuestas reales. Tu K-Rating es público. Tus desafíos son permanentes. Tu puntuación de ADN evoluciona. Cada decisión de entrenamiento tiene una consecuencia visible y medible."}},
        {"key": "prove_it",            "field_type": "cta",     "translations": {"en": "PROVE IT.", "it": "DIMOSTRALO.", "es": "DEMUÉSTRALO."}},
    ],
}
# ─── SEED ALL CONTENT ─────────────────────────────────────────

@api_router.post("/cms/seed-all")
async def seed_all_content(force: bool = False, translate: bool = True, _=Depends(verify_admin)):
    """Seed ALL pages with EN content + optional AI translation to IT/ES."""
    import json as _json
    results = {}
    for slug, sections in DEFAULT_PAGES.items():
        existing = await db.website_cms_content.find_one({"slug": slug})
        if existing and not force:
            results[slug] = {"status": "skipped", "reason": "already exists"}
            continue
        # Start with default sections
        final_sections = [dict(s) for s in sections]

        # AI translate if requested
        now = datetime.now(timezone.utc).isoformat()
        if translate and openai_client.api_key:
            for lang, lang_name in [("it", "Italian"), ("es", "Spanish")]:
                to_tr = [{"key": s["key"], "en": s.get("translations", {}).get("en", "")} for s in final_sections if s.get("translations", {}).get("en")]
                if not to_tr: continue
                prompt = "\n".join([f"{i+1}. [{x['key']}]: {x['en']}" for i, x in enumerate(to_tr)])
                try:
                    resp = await asyncio.to_thread(lambda ln=lang_name: openai_client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[{"role": "system", "content": f"Translate ArenaKore UI strings from English to {ln}. Keep bold, direct, competitive tone. Preserve ALL CAPS headings. Return JSON {{key: translation}}"}, {"role": "user", "content": prompt}],
                        response_format={"type": "json_object"}, temperature=0.3, max_tokens=2000))
                    translations = _json.loads(resp.choices[0].message.content)
                    for s in final_sections:
                        k = s["key"]
                        if k in translations:
                            s.setdefault("translations", {})[lang] = translations[k]
                except Exception as e:
                    logger.error(f"Translate {slug}→{lang}: {e}")

        data = {"slug": slug, "sections": final_sections, "id": str(uuid.uuid4()), "updated_at": now, "history": []}
        if existing:
            await db.website_cms_content.update_one({"slug": slug}, {"$set": {"sections": final_sections, "updated_at": now}})
        else:
            await db.website_cms_content.insert_one(data)
        # Auto-publish — archive old, create new published version
        await db.website_cms_versions.update_many({"slug": slug, "status": "published", "is_global": False}, {"$set": {"status": "archived"}})
        await db.website_cms_versions.insert_one({
            "id": str(uuid.uuid4()), "version_id": str(uuid.uuid4()), "slug": slug, "is_global": False,
            "status": "published", "sections": final_sections, "sections_count": len(final_sections),
            "created_at": now, "published_at": now, "created_by": "seed-all", "note": "Auto-seeded with AI translations",
        })
        results[slug] = {"status": "seeded", "sections": len(final_sections)}

    return {"ok": True, "results": results, "total_seeded": sum(1 for v in results.values() if v.get("status") == "seeded")}


# Required keys per page — must exist in ALL active languages before publishing
REQUIRED_KEYS: Dict[str, List[str]] = {
    "homepage":     ["hero_h1_line1", "hero_h1_line2", "hero_sub", "cta_primary", "cta_secondary"],
    "get-the-app":  ["hero_h1", "hero_tension", "hero_sub1", "final_line1"],
    "for-athletes": ["hero_h1", "identity_h2", "final_h2"],
    "gym-pilot":    ["hero_h1", "hero_sub", "offer_h2", "final_h2"],
    "arena-system": ["hero_h1", "hero_sub", "what_h2", "final_h2"],
    "competition":  ["hero_h1", "intro_h2"],
    "amrap":        ["hero_h1", "intro_h2"],
    "crossfit":     ["hero_h1", "intro_h2"],
    "gamification": ["hero_h1", "intro_h2"],
}
ACTIVE_LANGUAGES = ["en", "it", "es"]

def _compute_status(sections: list, slug: str) -> dict:
    """Compute Draft/Ready/Published status per language."""
    required = REQUIRED_KEYS.get(slug, [])
    result = {}
    for lang in ACTIVE_LANGUAGES:
        total = len(sections)
        filled = sum(1 for s in sections if (s.get("translations", {}) if isinstance(s, dict) else s.translations).get(lang, ""))
        has_required = all(
            any((s.get("key") if isinstance(s, dict) else s.key) == k and (s.get("translations", {}) if isinstance(s, dict) else s.translations).get(lang, "")
                for s in sections)
            for k in required
        )
        if total == 0:
            status = "empty"
        elif not has_required:
            status = "draft"
        elif filled == total:
            status = "published"
        else:
            status = "ready"
        result[lang] = {"status": status, "filled": filled, "total": total, "pct": round(filled/total*100) if total else 0, "has_required": has_required}
    return result


class ContentSection(BaseModel):
    key: str
    field_type: str = "text"  # text | heading | richtext | cta | label
    translations: Dict[str, str] = {}

class PageContentDoc(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    page_name: str = ""
    sections: List[ContentSection] = []
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TranslateRequest(BaseModel):
    target_lang: str           # e.g. "fr", "de"
    target_lang_name: str = "" # e.g. "French"
    keys: Optional[List[str]] = None  # None = translate all

async def _get_or_default_page(slug: str) -> dict:
    doc = await db.website_cms_content.find_one({"slug": slug}, {"_id": 0})
    if doc:
        return doc
    defaults = DEFAULT_PAGES.get(slug, [])
    return {"slug": slug, "sections": defaults}

@api_router.get("/cms/content/{slug}")
async def get_page_content(slug: str, lang: str = "en",
                            preview: bool = False,
                            request: Request = None):
    """
    Public: returns ONLY published version.
    Dev mode: falls back to latest draft if no published version.
    Admin preview (?preview=true + admin token): always shows latest draft.
    """
    # Check if admin preview requested
    is_admin_preview = False
    if preview:
        try:
            token = None
            if request:
                token = request.cookies.get("access_token")
                if not token:
                    auth = request.headers.get("Authorization", "")
                    if auth.startswith("Bearer "): token = auth[7:]
            if token and hmac.compare_digest(token, ADMIN_TOKEN):
                is_admin_preview = True
        except Exception:
            pass

    # Admin preview → return latest draft (from cms_content)
    if is_admin_preview:
        doc = await _get_or_default_page(slug)
        sections = doc.get("sections", [])
    else:
        # Try published version first
        pub = await db.website_cms_versions.find_one(
            {"slug": slug, "status": "published", "is_global": False},
            {"_id": 0}, sort=[("published_at", -1)]
        )
        if pub:
            sections = pub.get("sections", [])
        elif IS_PROD:
            # PRODUCTION: no published version → return empty + log error
            logger.error(f"CMS PRODUCTION ERROR: No published version for /{slug} [{lang}]")
            return {}
        else:
            # DEV: allow draft preview
            logger.warning(f"CMS DEV: No published version for /{slug} — serving draft")
            doc = await _get_or_default_page(slug)
            sections = doc.get("sections", [])

    result = {}
    for section in sections:
        t = section.get("translations", {}) if isinstance(section, dict) else section.translations
        k = section.get("key") if isinstance(section, dict) else section.key
        result[k] = t.get(lang) or t.get("en", "")
    return result

@api_router.get("/cms/content/{slug}/full")
async def get_page_content_full(slug: str, _=Depends(verify_admin)):
    """Admin endpoint — returns full structure with all translations (current draft)."""
    return await _get_or_default_page(slug)

@api_router.put("/cms/content/{slug}")
async def update_page_content(slug: str, sections: List[ContentSection],
                               note: Optional[str] = None,
                               created_by: Optional[str] = "admin",
                               auto_publish: bool = True,   # DEFAULT: save = publish immediately
                               _=Depends(verify_admin)):
    doc = await db.website_cms_content.find_one({"slug": slug})
    now = datetime.now(timezone.utc).isoformat()
    version_id = str(uuid.uuid4())
    final_status = "published" if auto_publish else "draft"

    version = {
        "id": str(uuid.uuid4()),
        "version_id": version_id,
        "slug": slug,
        "is_global": False,
        "status": final_status,
        "sections": [s.model_dump() for s in sections],
        "sections_count": len(sections),
        "created_at": now,
        "created_by": (created_by or "admin").strip(),
        "note": (note.strip() if note and note.strip() else "No note provided"),
        "published_at": now if auto_publish else None,
    }

    # If publishing, archive previous published version
    if auto_publish:
        await db.website_cms_versions.update_many(
            {"slug": slug, "status": "published", "is_global": False},
            {"$set": {"status": "archived"}}
        )

    await db.website_cms_versions.insert_one(version)

    # Keep only last 20 versions per slug
    all_versions = await db.website_cms_versions.find(
        {"slug": slug, "is_global": False}, {"_id": 0, "id": 1}
    ).sort("created_at", -1).to_list(None)
    if len(all_versions) > 20:
        old_ids = [v["id"] for v in all_versions[20:]]
        await db.website_cms_versions.delete_many({"id": {"$in": old_ids}})

    data = {
        "slug": slug,
        "sections": [s.model_dump() for s in sections],
        "updated_at": now,
        "latest_version_id": version_id,
    }
    if doc:
        await db.website_cms_content.update_one({"slug": slug}, {"$set": data})
    else:
        data["id"] = str(uuid.uuid4())
        data["history"] = []
        await db.website_cms_content.insert_one(data)
    return {"ok": True, "slug": slug, "sections": len(sections), "version_id": version_id}

@api_router.get("/cms/versions/{slug}")
async def get_versions(slug: str, _=Depends(verify_admin)):
    versions = await db.website_cms_versions.find(
        {"slug": slug, "is_global": False}, {"_id": 0, "sections": 0}
    ).sort("created_at", -1).to_list(20)
    return versions

@api_router.post("/cms/versions/{slug}/publish/{version_id}")
async def publish_version(slug: str, version_id: str, _=Depends(verify_admin)):
    now = datetime.now(timezone.utc).isoformat()
    # Unpublish current published version
    await db.website_cms_versions.update_many(
        {"slug": slug, "status": "published", "is_global": False},
        {"$set": {"status": "archived"}}
    )
    # Publish selected version
    result = await db.website_cms_versions.find_one_and_update(
        {"slug": slug, "version_id": version_id},
        {"$set": {"status": "published", "published_at": now}},
        {"_id": 0}, return_document=True
    )
    if not result:
        raise HTTPException(404, "Version not found")
    # Also update cms_content with published sections
    if result.get("sections"):
        await db.website_cms_content.update_one(
            {"slug": slug}, {"$set": {"sections": result["sections"], "published_version_id": version_id, "published_at": now}},
            upsert=True
        )
    logger.info(f"Published version {version_id} for /{slug}")
    return {"ok": True, "slug": slug, "version_id": version_id, "published_at": now}

@api_router.post("/cms/versions/{slug}/rollback/{version_id}")
async def rollback_version(slug: str, version_id: str, _=Depends(verify_admin)):
    """Rollback: create a new draft from an old version's content."""
    old = await db.website_cms_versions.find_one({"slug": slug, "version_id": version_id})
    if not old:
        raise HTTPException(404, "Version not found")
    sections = old.get("sections", [])
    now = datetime.now(timezone.utc).isoformat()
    new_version_id = str(uuid.uuid4())
    new_version = {
        "id": str(uuid.uuid4()),
        "version_id": new_version_id,
        "slug": slug,
        "is_global": False,
        "status": "draft",
        "sections": sections,
        "sections_count": len(sections),
        "created_at": now,
        "published_at": None,
        "rolled_back_from": version_id,
    }
    await db.website_cms_versions.insert_one(new_version)
    await db.website_cms_content.update_one(
        {"slug": slug}, {"$set": {"sections": sections, "updated_at": now, "latest_version_id": new_version_id}},
        upsert=True
    )
    logger.info(f"Rolled back /{slug} to version {version_id}")
    return {"ok": True, "slug": slug, "new_version_id": new_version_id, "rolled_back_from": version_id}

# ─── CMS VERSION ANALYTICS ────────────────────────────────────

class CTAClickEvent(BaseModel):
    key: str
    text: str
    language: str = "en"
    page: str = ""
    position: str = ""
    variant_id: Optional[str] = None   # A/B variant
    url: Optional[str] = None

@api_router.post("/cms/cta-click")
async def track_cta_click(data: CTAClickEvent):
    now = datetime.now(timezone.utc).isoformat()
    await db.website_cms_cta_clicks.update_one(
        {"key": data.key, "language": data.language, "page": data.page,
         "position": data.position, "variant_id": data.variant_id},
        {"$inc": {"clicks": 1}, "$set": {
            "last_click": now, "text": data.text, "key": data.key,
            "language": data.language, "page": data.page,
            "position": data.position, "variant_id": data.variant_id,
        }},
        upsert=True
    )
    await db.website_analytics_events.insert_one({
        "event": "cta_click",
        "params": {"key": data.key, "text": data.text, "language": data.language,
                   "page": data.page, "position": data.position, "variant_id": data.variant_id},
        "url": data.url, "ts": now, "server_ts": now,
    })
    return {"ok": True}

# ─── A/B TESTING ──────────────────────────────────────────────

class ABVariant(BaseModel):
    id: str                  # "A" | "B" | "C"
    text: str
    weight: int = 50         # 0–100, determines probability

class ABTestKey(BaseModel):
    key: str
    variants: List[ABVariant]

@api_router.get("/cms/ab-tests/{slug}")
async def get_ab_tests(slug: str):
    """Public — returns all A/B tests for a page as {key: [variants]}."""
    doc = await db.cms_ab_tests.find_one({"slug": slug}, {"_id": 0})
    if not doc: return {}
    result = {}
    for t in doc.get("tests", []):
        result[t["key"]] = t.get("variants", [])
    return result

@api_router.put("/cms/ab-tests/{slug}")
async def upsert_ab_tests(slug: str, tests: List[ABTestKey], _=Depends(verify_admin)):
    now = datetime.now(timezone.utc).isoformat()
    data = {"slug": slug, "tests": [t.model_dump() for t in tests], "updated_at": now}
    if await db.cms_ab_tests.find_one({"slug": slug}):
        await db.cms_ab_tests.update_one({"slug": slug}, {"$set": data})
    else:
        data["id"] = str(uuid.uuid4())
        await db.cms_ab_tests.insert_one(data)
    return {"ok": True, "slug": slug, "tests": len(tests)}

@api_router.get("/cms/ab-analytics/{slug}")
async def get_ab_analytics(slug: str, _=Depends(verify_admin)):
    """Returns click stats grouped by key + variant_id."""
    docs = await db.website_cms_cta_clicks.find({"page": slug, "variant_id": {"$ne": None}}, {"_id": 0}).to_list(500)
    result = {}
    for d in docs:
        k = d["key"]
        vid = d.get("variant_id", "default")
        if k not in result: result[k] = {}
        result[k][vid] = result[k].get(vid, 0) + d.get("clicks", 0)
    # Build structured output
    output = []
    for key, variants in result.items():
        total = sum(variants.values())
        rows = [{"variant_id": v, "clicks": c, "pct": round(c/total*100) if total else 0}
                for v, c in sorted(variants.items())]
        output.append({"key": key, "total_clicks": total, "variants": rows})
    return sorted(output, key=lambda x: -x["total_clicks"])

@api_router.get("/cms/cta-analytics")
async def get_cta_analytics(_=Depends(verify_admin)):
    docs = await db.website_cms_cta_clicks.find({}, {"_id": 0}).sort("clicks", -1).to_list(200)
    return docs

# ─── CONVERSION TRACKING ──────────────────────────────────────

class ConversionEvent(BaseModel):
    source_cta_key: str
    page: str = ""
    position: str = ""
    action: str              # "app_download" | "pilot_submit"
    language: str = "en"
    url: Optional[str] = None

@api_router.post("/cms/conversion")
async def track_conversion(data: ConversionEvent):
    now = datetime.now(timezone.utc).isoformat()
    await db.website_cms_conversions.update_one(
        {"source_cta_key": data.source_cta_key, "action": data.action, "page": data.page, "position": data.position},
        {"$inc": {"conversions": 1}, "$set": {
            "source_cta_key": data.source_cta_key, "action": data.action,
            "page": data.page, "position": data.position,
            "language": data.language, "last_conversion": now,
        }},
        upsert=True
    )
    await db.website_analytics_events.insert_one({
        "event": "conversion_event",
        "params": {"source_cta_key": data.source_cta_key, "action": data.action, "page": data.page, "position": data.position, "language": data.language},
        "url": data.url, "ts": now, "server_ts": now,
    })
    return {"ok": True}

@api_router.get("/cms/conversion-analytics")
async def get_conversion_analytics(_=Depends(verify_admin)):
    clicks   = await db.website_cms_cta_clicks.find({}, {"_id": 0}).to_list(500)
    convs    = await db.website_cms_conversions.find({}, {"_id": 0}).to_list(500)
    # Build conversion map: key+page+position → conversions
    conv_map = {}
    for c in convs:
        k = f"{c['source_cta_key']}::{c.get('page','')}::{c.get('position','')}"
        conv_map[k] = conv_map.get(k, 0) + c.get("conversions", 0)
    # Join clicks with conversions
    result = []
    for cl in sorted(clicks, key=lambda x: -x.get("clicks", 0)):
        k = f"{cl['key']}::{cl.get('page','')}::{cl.get('position','')}"
        c_count = conv_map.get(k, 0)
        c_rate  = round((c_count / cl["clicks"]) * 100, 1) if cl["clicks"] > 0 and c_count > 0 else 0
        result.append({**cl, "conversions": c_count, "conversion_rate": c_rate})
    # Also add conversions with no matching click entry
    click_keys = {f"{c['key']}::{c.get('page','')}::{c.get('position','')}" for c in clicks}
    for c in convs:
        k = f"{c['source_cta_key']}::{c.get('page','')}::{c.get('position','')}"
        if k not in click_keys:
            result.append({"key": c["source_cta_key"], "page": c.get("page",""), "position": c.get("position",""), "language": c.get("language","en"), "clicks": 0, "conversions": c.get("conversions",0), "conversion_rate": 0})
    return sorted(result, key=lambda x: -(x.get("conversions",0) + x.get("clicks",0)))


@api_router.get("/cms/content/{slug}/completeness")
async def check_completeness(slug: str, _=Depends(verify_admin)):
    doc = await _get_or_default_page(slug)
    sections = doc.get("sections", [])
    if not sections: return {}
    return _compute_status(sections, slug)

@api_router.get("/cms/content/{slug}/status")
async def get_page_status(slug: str, _=Depends(verify_admin)):
    doc = await _get_or_default_page(slug)
    sections = doc.get("sections", [])
    status = _compute_status(sections, slug)
    required = REQUIRED_KEYS.get(slug, [])
    missing = {lang: [k for k in required if not any(
        (s.get("key") if isinstance(s, dict) else s.key) == k and
        (s.get("translations", {}) if isinstance(s, dict) else s.translations).get(lang, "")
        for s in sections
    )] for lang in ACTIVE_LANGUAGES}
    return {"slug": slug, "status_per_lang": status, "required_keys": required,
            "missing_required": {k: v for k, v in missing.items() if v}}

# ─── CMS USAGE TRACKING ───────────────────────────────────────

class UsageLog(BaseModel):
    slug: str
    lang: str
    keys: List[str]
    url: Optional[str] = None

@api_router.post("/cms/usage")
async def log_usage(data: UsageLog):
    now = datetime.now(timezone.utc).isoformat()
    for key in data.keys[:50]:  # cap at 50 keys per request
        await db.website_cms_usage_keys.update_one(
            {"slug": data.slug, "key": key},
            {"$set": {"last_seen": now}, "$inc": {"count": 1}, "$addToSet": {"langs": data.lang}},
            upsert=True
        )
    return {"ok": True}

@api_router.get("/cms/coverage")
async def get_key_coverage(_=Depends(verify_admin)):
    used_docs = await db.website_cms_usage_keys.find({}, {"_id": 0}).sort("count", -1).to_list(500)
    coverage = {}
    used_by_slug = {}
    for doc in used_docs:
        s = doc["slug"]; k = doc["key"]
        if s not in used_by_slug: used_by_slug[s] = {}
        used_by_slug[s][k] = doc
    for slug, defaults in DEFAULT_PAGES.items():
        coverage[slug] = []
        all_keys = {s["key"] for s in defaults}
        used_keys = used_by_slug.get(slug, {})
        for key in all_keys:
            u = used_keys.get(key, {})
            coverage[slug].append({"key": key, "in_cms": True, "count": u.get("count", 0), "langs": u.get("langs", []), "used": key in used_keys, "last_seen": u.get("last_seen", "")})
        for key, u in used_keys.items():
            if key not in all_keys:
                coverage[slug].append({"key": key, "in_cms": False, "count": u.get("count", 0), "langs": u.get("langs", []), "used": True, "last_seen": u.get("last_seen", "")})
    return coverage



@api_router.post("/cms/content/{slug}/translate")
async def translate_page_content(slug: str, req: TranslateRequest, _=Depends(verify_admin)):
    """Use OpenAI to translate all EN content into a new language."""
    doc = await _get_or_default_page(slug)
    sections = doc.get("sections", [])
    if not sections:
        raise HTTPException(400, "No content to translate")

    target = req.target_lang.lower()
    lang_name = req.target_lang_name or target

    # Collect EN texts to translate
    to_translate = []
    for s in sections:
        t = s.get("translations", {}) if isinstance(s, dict) else s.translations
        k = s.get("key") if isinstance(s, dict) else s.key
        if req.keys and k not in req.keys:
            continue
        en_text = t.get("en", "")
        if en_text:
            to_translate.append({"key": k, "en": en_text})

    if not to_translate:
        raise HTTPException(400, "Nothing to translate")

    # Batch translate with OpenAI
    prompt_items = "\n".join([f"{i+1}. [{item['key']}]: {item['en']}" for i, item in enumerate(to_translate)])
    system_msg = f"""You are a professional translator for ArenaKore, a competitive sports platform.
Translate the following texts from English to {lang_name}.
Keep the tone BOLD, DIRECT, and COMPETITIVE.
Preserve ALL CAPS formatting for headings.
Return ONLY a JSON object mapping keys to translated strings.
Format: {{"key1": "translation1", "key2": "translation2"}}"""

    try:
        resp = await asyncio.to_thread(
            lambda: openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt_items},
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
            )
        )
        import json
        translations = json.loads(resp.choices[0].message.content)
    except Exception as e:
        logger.error(f"Translation error: {e}")
        raise HTTPException(500, f"Translation failed: {str(e)}")

    # Merge translations back into sections
    updated_sections = []
    for s in sections:
        sec = dict(s) if isinstance(s, dict) else s.model_dump()
        k = sec["key"]
        if k in translations:
            sec["translations"][target] = translations[k]
        updated_sections.append(sec)

    # Save
    data = {"slug": slug, "sections": updated_sections, "updated_at": datetime.now(timezone.utc).isoformat()}
    if await db.website_cms_content.find_one({"slug": slug}):
        await db.website_cms_content.update_one({"slug": slug}, {"$set": data})
    else:
        data["id"] = str(uuid.uuid4())
        await db.website_cms_content.insert_one(data)

    logger.info(f"Translated {len(translations)} keys for {slug} → {target}")
    return {"ok": True, "translated": len(translations), "lang": target, "slug": slug}

@api_router.get("/cms/pages-list")
async def get_cms_pages_list(_=Depends(verify_admin)):
    """Returns list of all pages with CMS content status.
    Includes BOTH pages in DEFAULT_PAGES AND any pages seeded via seed_cms.py.
    """
    # All pages that exist in DB (from seed_cms.py or DEFAULT_PAGES seed)
    db_pages = {}
    async for doc in db.website_cms_content.find({}, {"slug": 1, "updated_at": 1, "_id": 0}):
        slug = doc["slug"]
        # Count sections for this slug
        count = await db.website_cms_content.count_documents({"slug": slug}) if False else None
        db_pages[slug] = doc

    # Count sections per slug (each page is one document with embedded sections array)
    section_counts = {}
    async for doc in db.website_cms_content.find({}, {"slug": 1, "sections": 1, "_id": 0}):
        slug = doc.get("slug", "")
        if slug:
            secs = doc.get("sections", [])
            section_counts[slug] = len(secs) if isinstance(secs, list) else 1

    # Build list: DEFAULT_PAGES first (with section count from code), then DB-only pages
    result = []
    seen = set()

    for slug in DEFAULT_PAGES:
        seen.add(slug)
        db_count = section_counts.get(slug, 0)
        result.append({
            "slug": slug,
            "name": slug.replace("-", " ").title(),
            "has_content": slug in db_pages,
            "section_count": max(db_count, len(DEFAULT_PAGES.get(slug, []))),
            "source": "default",
        })

    # Add DB-only pages (created via seed_cms.py — not in DEFAULT_PAGES)
    for slug in db_pages:
        if slug not in seen:
            result.append({
                "slug": slug,
                "name": slug.replace("-", " ").title(),
                "has_content": True,
                "section_count": section_counts.get(slug, 0),
                "source": "custom",
            })

    return result



# ─── CMS GLOBAL CONTENT ───────────────────────────────────────

GLOBAL_DEFAULTS = [
    # NAVBAR
    {"key": "nav_home",             "group": "navbar",    "translations": {"en": "Home",           "it": "Home",          "es": "Inicio"}},
    {"key": "nav_arena_system",     "group": "navbar",    "translations": {"en": "Arena System",   "it": "Arena System",  "es": "Sistema Arena"}},
    {"key": "nav_athletes",         "group": "navbar",    "translations": {"en": "Athletes",       "it": "Atleti",        "es": "Atletas"}},
    {"key": "nav_competition",      "group": "navbar",    "translations": {"en": "Competition",    "it": "Competizione",  "es": "Competición"}},
    {"key": "nav_amrap",            "group": "navbar",    "translations": {"en": "AMRAP",          "it": "AMRAP",         "es": "AMRAP"}},
    {"key": "nav_crossfit",         "group": "navbar",    "translations": {"en": "CrossFit",       "it": "CrossFit",      "es": "CrossFit"}},
    {"key": "nav_gyms",             "group": "navbar",    "translations": {"en": "For Gyms & Coaches", "it": "Per Palestre & Coach", "es": "Para Gimnasios & Coaches"}},
    {"key": "nav_gamification",     "group": "navbar",    "translations": {"en": "Gamification",    "it": "Gamification",  "es": "Gamificación"}},
    {"key": "nav_business",         "group": "navbar",    "translations": {"en": "Business",       "it": "Business",      "es": "Business"}},
    {"key": "nav_blog",             "group": "navbar",    "translations": {"en": "Blog",           "it": "Blog",          "es": "Blog"}},
    {"key": "nav_cta",              "group": "navbar",    "translations": {"en": "Start Your Challenge", "it": "Inizia la Sfida", "es": "Empieza Tu Desafío"}},
    # CTA BUTTONS
    {"key": "cta_get_app",          "group": "cta",       "translations": {"en": "Get the App",    "it": "Scarica l'App", "es": "Descarga la App"}},
    {"key": "cta_download_app",     "group": "cta",       "translations": {"en": "Download the App","it": "Scarica l'App","es": "Descarga la App"}},
    {"key": "cta_start_challenge",  "group": "cta",       "translations": {"en": "Start Your Challenge","it": "Inizia la Sfida","es": "Empieza Tu Desafío"}},
    {"key": "cta_for_gyms",         "group": "cta",       "translations": {"en": "For Gyms & Coaches","it": "Per Palestre & Coach","es": "Para Gimnasios & Coaches"}},
    {"key": "cta_for_athletes",     "group": "cta",       "translations": {"en": "For Athletes",   "it": "Per Atleti",    "es": "Para Atletas"}},
    {"key": "cta_pilot",            "group": "cta",       "translations": {"en": "Start Your Pilot","it": "Avvia il Pilot","es": "Inicia el Piloto"}},
    {"key": "cta_enter_arena",      "group": "cta",       "translations": {"en": "Enter the Arena","it": "Entra nell'Arena","es": "Entra en la Arena"}},
    {"key": "cta_learn_more",       "group": "cta",       "translations": {"en": "Learn more",     "it": "Scopri di più", "es": "Saber más"}},
    {"key": "cta_explore",          "group": "cta",       "translations": {"en": "Explore",        "it": "Esplora",       "es": "Explorar"}},
    # FOOTER
    {"key": "footer_tagline",       "group": "footer",    "translations": {"en": "Global competition platform for athletes and gyms.", "it": "Piattaforma competitiva globale per atleti e palestre.", "es": "Plataforma de competición global para atletas y gimnasios."}},
    {"key": "footer_copyright",     "group": "footer",    "translations": {"en": "© 2026 ArenaKore. All rights reserved.", "it": "© 2026 ArenaKore. Tutti i diritti riservati.", "es": "© 2026 ArenaKore. Todos los derechos reservados."}},
    {"key": "footer_nexus",         "group": "footer",    "translations": {"en": "NEXUS ONLINE",   "it": "NEXUS ONLINE",  "es": "NEXUS ONLINE"}},
    {"key": "footer_pages_title",   "group": "footer",    "translations": {"en": "PAGES",          "it": "PAGINE",        "es": "PÁGINAS"}},
    {"key": "footer_support_title", "group": "footer",    "translations": {"en": "SUPPORT",        "it": "SUPPORTO",      "es": "SOPORTE"}},
    {"key": "footer_language_label","group": "footer",    "translations": {"en": "Language & Region","it": "Lingua & Regione","es": "Idioma y Región"}},
    {"key": "footer_signin",        "group": "footer",    "translations": {"en": "Sign in",        "it": "Accedi",        "es": "Iniciar sesión"}},
    # SYSTEM / MICROCOPY
    {"key": "prove_it",             "group": "system",    "translations": {"en": "PROVE IT.",      "it": "DIMOSTRALO.",   "es": "DEMUÉSTRALO."}},
    {"key": "loading",              "group": "microcopy", "translations": {"en": "Loading...",     "it": "Caricamento...", "es": "Cargando..."}},
    {"key": "save",                 "group": "microcopy", "translations": {"en": "Save",           "it": "Salva",         "es": "Guardar"}},
    {"key": "cancel",               "group": "microcopy", "translations": {"en": "Cancel",         "it": "Annulla",       "es": "Cancelar"}},
    {"key": "delete",               "group": "microcopy", "translations": {"en": "Delete",         "it": "Elimina",       "es": "Eliminar"}},
    {"key": "edit",                 "group": "microcopy", "translations": {"en": "Edit",           "it": "Modifica",      "es": "Editar"}},
    {"key": "sign_in",              "group": "microcopy", "translations": {"en": "Sign In",        "it": "Accedi",        "es": "Iniciar sesión"}},
    {"key": "email_placeholder",    "group": "microcopy", "translations": {"en": "Email",          "it": "Email",         "es": "Correo electrónico"}},
    {"key": "password_placeholder", "group": "microcopy", "translations": {"en": "Password",       "it": "Password",      "es": "Contraseña"}},
    {"key": "form_error_required",  "group": "microcopy", "translations": {"en": "Please fill all required fields.", "it": "Compila tutti i campi obbligatori.", "es": "Por favor, rellena todos los campos obligatorios."}},
    {"key": "form_success",         "group": "microcopy", "translations": {"en": "Sent successfully!", "it": "Inviato con successo!", "es": "¡Enviado con éxito!"}},
    {"key": "form_error_send",      "group": "microcopy", "translations": {"en": "Error sending. Try again.", "it": "Errore nell'invio. Riprova.", "es": "Error al enviar. Inténtalo de nuevo."}},
    {"key": "back_to_site",         "group": "microcopy", "translations": {"en": "← Back to site", "it": "← Torna al sito", "es": "← Volver al sitio"}},
    {"key": "empty_no_items",       "group": "microcopy", "translations": {"en": "No items yet.",  "it": "Nessun elemento.", "es": "Sin elementos."}},
    {"key": "scroll_more",          "group": "microcopy", "translations": {"en": "Scroll to learn more", "it": "Scorri per sapere di più", "es": "Desliza para saber más"}},
    {"key": "available_worldwide",  "group": "microcopy", "translations": {"en": "Free · Available worldwide", "it": "Gratis · Disponibile ovunque", "es": "Gratis · Disponible en todo el mundo"}},
    {"key": "live_badge",           "group": "microcopy", "translations": {"en": "LIVE",           "it": "LIVE",          "es": "EN VIVO"}},
    {"key": "free_download",        "group": "microcopy", "translations": {"en": "Free Download",  "it": "Download Gratuito", "es": "Descarga Gratuita"}},
]

@api_router.get("/cms/global")
async def get_global_content(lang: str = "en"):
    docs = await db.website_cms_global.find({}, {"_id": 0}).to_list(200)
    items = docs if docs else GLOBAL_DEFAULTS
    return {item["key"]: item.get("translations", {}).get(lang) or item.get("translations", {}).get("en", "") for item in items}

@api_router.get("/cms/global/full")
async def get_global_full(_=Depends(verify_admin)):
    docs = await db.website_cms_global.find({}, {"_id": 0}).to_list(200)
    return docs if docs else GLOBAL_DEFAULTS

@api_router.put("/cms/global")
async def update_global_content(items: List[Dict[str, Any]], _=Depends(verify_admin)):
    for item in items:
        k = item.get("key")
        if not k: continue
        item["updated_at"] = datetime.now(timezone.utc).isoformat()
        if await db.website_cms_global.find_one({"key": k}):
            await db.website_cms_global.update_one({"key": k}, {"$set": item})
        else:
            item.setdefault("id", str(uuid.uuid4()))
            await db.website_cms_global.insert_one(item)
    return {"ok": True, "updated": len(items)}

@api_router.post("/cms/global/seed")
async def seed_global_content(force: bool = False, _=Depends(verify_admin)):
    count = await db.website_cms_global.count_documents({})
    if count > 0 and not force:
        return {"ok": True, "seeded": 0, "message": f"Already has {count} items. Use ?force=true to reseed."}
    if force:
        await db.website_cms_global.drop()
    for item in GLOBAL_DEFAULTS:
        doc = {**item, "id": str(uuid.uuid4()), "updated_at": datetime.now(timezone.utc).isoformat()}
        await db.website_cms_global.insert_one(doc)
    return {"ok": True, "seeded": len(GLOBAL_DEFAULTS), "total": len(GLOBAL_DEFAULTS)}

@api_router.post("/cms/global/translate")
async def translate_global_content(req: TranslateRequest, _=Depends(verify_admin)):
    docs = await db.website_cms_global.find({}, {"_id": 0}).to_list(200)
    items = docs if docs else GLOBAL_DEFAULTS
    target = req.target_lang.lower()
    lang_name = req.target_lang_name or target
    to_translate = [{"key": d["key"], "en": d.get("translations", {}).get("en", "")} for d in items if d.get("translations", {}).get("en")]
    if not to_translate: raise HTTPException(400, "Nothing to translate")
    prompt = "\n".join([f"{i+1}. [{x['key']}]: {x['en']}" for i, x in enumerate(to_translate)])
    try:
        import json as _json
        resp = await asyncio.to_thread(lambda: openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": f"Translate ArenaKore UI strings EN→{lang_name}. Bold, direct. Return JSON: {{key: translation}}"}, {"role": "user", "content": prompt}],
            response_format={"type": "json_object"}, temperature=0.3))
        translations = _json.loads(resp.choices[0].message.content)
    except Exception as e: raise HTTPException(500, str(e))
    for item in items:
        k = item["key"]
        if k in translations:
            item.setdefault("translations", {})[target] = translations[k]
            item["updated_at"] = datetime.now(timezone.utc).isoformat()
            if await db.website_cms_global.find_one({"key": k}):
                await db.website_cms_global.update_one({"key": k}, {"$set": item})
            else:
                item["id"] = str(uuid.uuid4())
                await db.website_cms_global.insert_one(item)
    return {"ok": True, "translated": len(translations), "lang": target}


# ─── STATS ────────────────────────────────────────────────────
@api_router.get("/sitemap.xml", response_class=Response)
async def sitemap_xml():
    """Dynamic sitemap covering all pages × all languages."""
    base_url = "https://www.arenakore.com"
    pages = [
        {"path": "/",                     "priority": "1.0", "changefreq": "weekly"},
        {"path": "/arena-system",         "priority": "0.9", "changefreq": "weekly"},
        {"path": "/for-athletes",         "priority": "0.9", "changefreq": "weekly"},
        {"path": "/for-gyms-and-coaches", "priority": "0.9", "changefreq": "weekly"},
        {"path": "/competition",          "priority": "0.8", "changefreq": "monthly"},
        {"path": "/amrap",                "priority": "0.7", "changefreq": "monthly"},
        {"path": "/crossfit",             "priority": "0.7", "changefreq": "monthly"},
        {"path": "/gamification",         "priority": "0.7", "changefreq": "monthly"},
        {"path": "/get-the-app",          "priority": "0.9", "changefreq": "weekly"},
        {"path": "/arena-matches",        "priority": "0.8", "changefreq": "weekly"},
        {"path": "/support",              "priority": "0.6", "changefreq": "monthly"},
        {"path": "/fitness-challenge-app","priority": "0.6", "changefreq": "monthly"},
        {"path": "/blog",                 "priority": "0.8", "changefreq": "daily"},
    ]
    # Add blog post slugs dynamically
    blog_posts = await db.website_blog_posts.find({"published": True}, {"slug": 1, "_id": 0}).to_list(100)
    for post in blog_posts:
        pages.append({"path": f"/blog/{post['slug']}", "priority": "0.7", "changefreq": "monthly"})

    langs = [("it", "it_IT"), ("en", "en_US"), ("es", "es_ES")]
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    urls = []
    for page in pages:
        url_parts = [f"  <url>"]
        url_parts.append(f"    <loc>{base_url}{page['path']}</loc>")
        url_parts.append(f"    <lastmod>{today}</lastmod>")
        url_parts.append(f"    <changefreq>{page['changefreq']}</changefreq>")
        url_parts.append(f"    <priority>{page['priority']}</priority>")
        # hreflang alternates
        page_path = page["path"]
        for lang_code, _ in langs:
            url_parts.append(f'    <xhtml:link rel="alternate" hreflang="{lang_code}" href="{base_url}{page_path}"/>')
        url_parts.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{base_url}{page_path}"/>')
        url_parts.append(f"  </url>")
        urls.append("\n".join(url_parts))

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(urls) + "\n</urlset>"
    )
    return Response(content=sitemap, media_type="application/xml")

@api_router.get("/robots.txt", response_class=Response)
async def robots_txt():
    """robots.txt — allow all, block /admin."""
    content = """User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/

Sitemap: https://www.arenakore.com/api/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")


async def get_admin_stats(_=Depends(verify_admin)):
    return {
        "blog_posts": await db.website_blog_posts.count_documents({}),
        "pages": await db.website_cms_pages.count_documents({}),
        "media": await db.website_media_library.count_documents({}),
        "pilot_requests": await db.website_pilot_requests.count_documents({}),
        "hero_slides": await db.website_hero_slides.count_documents({}),
    }

# ─── NAVIGATION CONFIG ────────────────────────────────────────
class NavItem(BaseModel):
    key: str
    href: str
    labels: Dict[str, str] = {}   # {en: "Home", it: "Home", es: "Inicio"}
    active: bool = True
    order: int = 0

class NavConfig(BaseModel):
    top_nav: List[NavItem] = []
    bottom_nav: List[NavItem] = []

# Default nav from ALL_PAGES — used when no DB config exists
DEFAULT_TOP_NAV = [
    NavItem(key="home",         href="/",                    labels={"en":"Home","it":"Home","es":"Inicio"},              order=0),
    NavItem(key="arenaSystem",  href="/arena-system",        labels={"en":"Arena System","it":"Arena System","es":"Sistema Arena"}, order=1),
    NavItem(key="athletes",     href="/for-athletes",        labels={"en":"Athletes","it":"Atleti","es":"Atletas"},       order=2),
    NavItem(key="competition",  href="/competition",         labels={"en":"Competition","it":"Competizione","es":"Competición"}, order=3),
    NavItem(key="amrap",        href="/amrap",               labels={"en":"AMRAP","it":"AMRAP","es":"AMRAP"},             order=4),
    NavItem(key="crossfit",     href="/crossfit",            labels={"en":"CrossFit","it":"CrossFit","es":"CrossFit"},    order=5),
    NavItem(key="gamification", href="/gamification",        labels={"en":"Gamification","it":"Gamification","es":"Gamificación"}, order=6),
    NavItem(key="gyms",         href="/for-gyms-and-coaches",labels={"en":"Business","it":"Business","es":"Business"},   order=7),
    NavItem(key="blog",         href="/blog",                labels={"en":"Blog","it":"Blog","es":"Blog"},                order=8),
]

DEFAULT_BOTTOM_NAV = [
    NavItem(key="home",         href="/",                    labels={"en":"Home","it":"Home","es":"Inicio"},              order=0),
    NavItem(key="arenaSystem",  href="/arena-system",        labels={"en":"Arena System","it":"Arena System","es":"Sistema Arena"}, order=1),
    NavItem(key="athletes",     href="/for-athletes",        labels={"en":"Athletes","it":"Atleti","es":"Atletas"},       order=2),
    NavItem(key="competition",  href="/competition",         labels={"en":"Competition","it":"Competizione","es":"Competición"}, order=3),
    NavItem(key="amrap",        href="/amrap",               labels={"en":"AMRAP","it":"AMRAP","es":"AMRAP"},             order=4),
    NavItem(key="crossfit",     href="/crossfit",            labels={"en":"CrossFit","it":"CrossFit","es":"CrossFit"},    order=5),
    NavItem(key="gamification", href="/gamification",        labels={"en":"Gamification","it":"Gamification","es":"Gamificación"}, order=6),
    NavItem(key="gyms",         href="/for-gyms-and-coaches",labels={"en":"For Gyms & Coaches","it":"Per Palestre & Coach","es":"Para Gimnasios & Coaches"}, order=7),
    NavItem(key="fitnessApp",   href="/fitness-challenge-app",labels={"en":"Fitness Challenge App","it":"Fitness Challenge App","es":"Fitness Challenge App"}, order=8),
    NavItem(key="blog",         href="/blog",                labels={"en":"Blog","it":"Blog","es":"Blog"},                order=9),
    NavItem(key="app",          href="/get-the-app",         labels={"en":"Get the App","it":"Scarica App","es":"Descargar App"}, order=10),
]

@api_router.get("/nav/config")
async def get_nav_config():
    """Public: returns current navigation configuration.
    Source of truth = DB. No automatic merging that overrides user choices.
    Defaults are used ONLY when no config has ever been saved.
    """
    doc = await db.website_nav_config.find_one({"type": "nav_config"}, {"_id": 0})
    if not doc:
        return {
            "top_nav":    [i.model_dump() for i in DEFAULT_TOP_NAV],
            "bottom_nav": [i.model_dump() for i in DEFAULT_BOTTOM_NAV],
        }
    # Return exactly what the user saved — no automatic re-insertion
    return {
        "top_nav":    doc.get("top_nav", []),
        "bottom_nav": doc.get("bottom_nav", []),
    }

@api_router.put("/nav/config")
async def update_nav_config(data: NavConfig, _=Depends(verify_admin)):
    """Admin: saves navigation configuration."""
    doc = data.model_dump()
    doc["type"] = "nav_config"
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.website_nav_config.replace_one({"type": "nav_config"}, doc, upsert=True)
    return {"ok": True, "top_nav": len(data.top_nav), "bottom_nav": len(data.bottom_nav)}

@api_router.get("/nav/config/full")
async def get_nav_config_full(_=Depends(verify_admin)):
    """Admin: returns full nav config including all available pages."""
    config = await get_nav_config()
    used_keys = set(i["key"] for i in config["top_nav"]) | set(i["key"] for i in config["bottom_nav"])
    all_pages = [
        {"key": "home",         "href": "/",                     "labels": {"en":"Home","it":"Home","es":"Inicio"}},
        {"key": "arenaSystem",  "href": "/arena-system",         "labels": {"en":"Arena System","it":"Arena System","es":"Sistema Arena"}},
        {"key": "athletes",     "href": "/for-athletes",         "labels": {"en":"Athletes","it":"Atleti","es":"Atletas"}},
        {"key": "competition",  "href": "/competition",          "labels": {"en":"Competition","it":"Competizione","es":"Competición"}},
        {"key": "amrap",        "href": "/amrap",                "labels": {"en":"AMRAP","it":"AMRAP","es":"AMRAP"}},
        {"key": "crossfit",     "href": "/crossfit",             "labels": {"en":"CrossFit","it":"CrossFit","es":"CrossFit"}},
        {"key": "gamification", "href": "/gamification",         "labels": {"en":"Gamification","it":"Gamification","es":"Gamificación"}},
        {"key": "gyms",         "href": "/for-gyms-and-coaches", "labels": {"en":"Business","it":"Business","es":"Business"}},
        {"key": "blog",         "href": "/blog",                 "labels": {"en":"Blog","it":"Blog","es":"Blog"}},
        {"key": "app",          "href": "/get-the-app",          "labels": {"en":"Get the App","it":"Scarica App","es":"Descargar App"}},
        {"key": "fitnessApp",   "href": "/fitness-challenge-app","labels": {"en":"Fitness Challenge App","it":"Fitness Challenge App","es":"Fitness Challenge App"}},
        {"key": "support",      "href": "/support",              "labels": {"en":"Support","it":"Supporto","es":"Soporte"}},
    ]
    return {**config, "all_pages": all_pages}


KNOWN_ROUTES = [
    {"slug": "/",                      "name": "Home",                    "section": "main"},
    {"slug": "/arena-system",          "name": "Arena System",            "section": "main"},
    {"slug": "/for-athletes",          "name": "Athletes",                "section": "main"},
    {"slug": "/competition",           "name": "Competition",             "section": "main"},
    {"slug": "/amrap",                 "name": "AMRAP",                   "section": "main"},
    {"slug": "/crossfit",              "name": "CrossFit",                "section": "main"},
    {"slug": "/gamification",          "name": "Gamification",            "section": "main"},
    {"slug": "/for-gyms-and-coaches",  "name": "For Gyms & Coaches",      "section": "main"},
    {"slug": "/blog",                  "name": "Blog",                    "section": "main"},
    {"slug": "/get-the-app",           "name": "Get the App",             "section": "main"},
    {"slug": "/fitness-challenge-app", "name": "Fitness Challenge App",   "section": "secondary"},
    {"slug": "/support",               "name": "Support",                 "section": "support"},
]

@api_router.get("/cms/pages")
async def get_pages_catalog(_=Depends(verify_admin)):
    """Returns all known routes with their CMS override status."""
    overrides = {}
    async for d in db.website_cms_pages.find({}, {"_id": 0}):
        overrides[d["slug"]] = d

    result = []
    seen = set()
    for route in KNOWN_ROUTES:
        if route["slug"] in seen:
            continue
        seen.add(route["slug"])
        override = overrides.get(route["slug"])
        result.append({
            "slug":             route["slug"],
            "name":             route["name"],
            "section":          route["section"],
            "has_override":     override is not None and bool(override.get("seo_title") or override.get("meta_description") or override.get("h1")),
            "seo_title":        override.get("seo_title", "") if override else "",
            "meta_description": override.get("meta_description", "") if override else "",
            "h1":               override.get("h1", "") if override else "",
            "translations":     override.get("translations") if override else None,
        })
    return result

# ─── HERO SLIDES ──────────────────────────────────────────────

class HeroSlide(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str
    sport_label: str = ''
    position: str = 'center center'
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HeroSlideCreate(BaseModel):
    image_url: str
    sport_label: str = ''
    position: str = 'center center'
    order: int = 0
    active: bool = True

class HeroSlideUpdate(BaseModel):
    image_url: Optional[str] = None
    sport_label: Optional[str] = None
    position: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None

def _deser_slide(d):
    if isinstance(d.get('created_at'), str):
        d['created_at'] = datetime.fromisoformat(d['created_at'])
    return d

@api_router.get("/hero-slides")
async def get_hero_slides():
    docs = await db.website_hero_slides.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(20)
    return [_deser_slide(d) for d in docs]

@api_router.get("/hero-slides/all")
async def get_all_hero_slides(_=Depends(verify_admin)):
    docs = await db.website_hero_slides.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    return [_deser_slide(d) for d in docs]

@api_router.post("/hero-slides", response_model=HeroSlide)
async def create_hero_slide(data: HeroSlideCreate, _=Depends(verify_admin)):
    obj = HeroSlide(**data.model_dump())
    doc = obj.model_dump(); doc['created_at'] = doc['created_at'].isoformat()
    await db.website_hero_slides.insert_one(doc); return obj

@api_router.put("/hero-slides/{slide_id}", response_model=HeroSlide)
async def update_hero_slide(slide_id: str, data: HeroSlideUpdate, _=Depends(verify_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    result = await db.website_hero_slides.find_one_and_update(
        {"id": slide_id}, {"$set": update}, {"_id": 0}, return_document=True)
    if not result: raise HTTPException(404, "Not found")
    return _deser_slide(result)

@api_router.delete("/hero-slides/{slide_id}")
async def delete_hero_slide(slide_id: str, _=Depends(verify_admin)):
    await db.website_hero_slides.delete_one({"id": slide_id}); return {"ok": True}

# ─── ANALYTICS EVENTS ────────────────────────────────────────

class AnalyticsEvent(BaseModel):
    event: str
    params: Dict[str, Any] = {}
    url: Optional[str] = None
    ts: Optional[str] = None

@api_router.post("/events")
async def track_event(data: AnalyticsEvent):
    """Receive frontend analytics events. Non-blocking — always returns 200."""
    try:
        doc = data.model_dump()
        doc['server_ts'] = datetime.now(timezone.utc).isoformat()
        await db.website_analytics_events.insert_one(doc)
    except Exception as e:
        logger.debug(f"Event log failed (non-critical): {e}")
    return {"ok": True}

@api_router.get("/analytics/funnel")
async def get_funnel_analytics(_=Depends(verify_admin)):
    """KPI Dashboard: landing funnel performance metrics."""
    LANDING_EVENTS = ['landing_view', 'landing_scroll_50', 'landing_scroll_90',
                      'cta_start_test_click', 'cta_download_click']

    # Aggregate counts per event and page_slug
    pipeline = [
        {"$match": {"event": {"$in": LANDING_EVENTS}}},
        {"$group": {
            "_id": {"event": "$event", "page_slug": "$params.page_slug", "language": "$params.language"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.event": 1, "count": -1}}
    ]
    raw = await db.website_analytics_events.aggregate(pipeline).to_list(500)

    # Build flat summary
    totals = {e: 0 for e in LANDING_EVENTS}
    by_page: dict = {}
    by_lang: dict = {}

    for r in raw:
        ev   = r["_id"]["event"]
        slug = r["_id"].get("page_slug") or "unknown"
        lang = r["_id"].get("language") or "unknown"
        cnt  = r["count"]
        totals[ev] = totals.get(ev, 0) + cnt

        # By page
        if slug not in by_page:
            by_page[slug] = {e: 0 for e in LANDING_EVENTS}
        by_page[slug][ev] = by_page[slug].get(ev, 0) + cnt

        # By language
        if lang not in by_lang:
            by_lang[lang] = {e: 0 for e in LANDING_EVENTS}
        by_lang[lang][ev] = by_lang[lang].get(ev, 0) + cnt

    # Conversion rates
    def rate(num, den):
        return round(num / den * 100, 1) if den > 0 else 0.0

    lv   = totals['landing_view']
    cta  = totals['cta_start_test_click']
    dl   = totals['cta_download_click']
    s50  = totals['landing_scroll_50']
    s90  = totals['landing_scroll_90']

    conversion_rates = {
        "landing_to_cta":      rate(cta, lv),
        "cta_to_download":     rate(dl, cta),
        "landing_to_download": rate(dl, lv),
        "scroll_50_rate":      rate(s50, lv),
        "scroll_90_rate":      rate(s90, lv),
    }

    # Per-page conversion rates
    by_page_rates = {}
    for slug, counts in by_page.items():
        plv  = counts.get('landing_view', 0)
        pcta = counts.get('cta_start_test_click', 0)
        pdl  = counts.get('cta_download_click', 0)
        by_page_rates[slug] = {
            **counts,
            "landing_to_cta":      rate(pcta, plv),
            "landing_to_download": rate(pdl, plv),
        }

    return {
        "landing_views":    lv,
        "scroll_50":        s50,
        "scroll_90":        s90,
        "cta_clicks":       cta,
        "download_clicks":  dl,
        "conversion_rates": conversion_rates,
        "by_page":          by_page_rates,
        "by_language":      by_lang,
    }

@api_router.get("/events/summary")
async def events_summary(_=Depends(verify_admin)):
    pipeline = [
        {"$group": {"_id": "$event", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 50},
    ]
    result = await db.website_analytics_events.aggregate(pipeline).to_list(50)
    return [{"event": r["_id"], "count": r["count"]} for r in result]

@api_router.get("/events/recent")
async def events_recent(_=Depends(verify_admin)):
    docs = await db.website_analytics_events.find({}, {"_id": 0}).sort("server_ts", -1).to_list(100)
    return docs

class LeadAlertPayload(BaseModel):
    gym_name: str
    city: str
    owner_name: str
    email: str
    phone: Optional[str] = None
    source: Optional[str] = "website"

@api_router.post("/internal/lead-alert")
async def lead_alert(payload: LeadAlertPayload):
    """
    Webhook endpoint for external integrations (Slack, WhatsApp, CRM).
    Receives a lead payload and logs it. Extend to forward to any channel.
    """
    logger.info(
        f"[WEBHOOK] Lead alert — {payload.gym_name} | {payload.city} "
        f"| {payload.owner_name} | {payload.email} | source:{payload.source}"
    )
    # ── Future integrations ──────────────────────────────────────
    # Slack:    POST payload to SLACK_WEBHOOK_URL
    # WhatsApp: Twilio API with payload data
    # CRM:      POST to HubSpot / Pipedrive contact endpoint
    # ─────────────────────────────────────────────────────────────
    return {
        "received": True,
        "gym": payload.gym_name,
        "city": payload.city,
        "owner": payload.owner_name,
        "integrations_ready": ["slack", "whatsapp", "crm"],
        "status": "logged",
    }

# ─── APP SETUP ────────────────────────────────────────────────
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000,https://arenakore.com,https://www.arenakore.com').split(','),
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],
)

@app.on_event("shutdown")
async def shutdown_db_client(): client.close()

@app.on_event("startup")
async def startup_event():
    await _seed_admin()
    logger.info("ArenaKore API started — auth system ready")
