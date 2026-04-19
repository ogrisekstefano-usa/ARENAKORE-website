from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, hashlib, hmac, asyncio
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone

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

# ─── ADMIN AUTH ───────────────────────────────────────────────
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'ArenaKore2026!')
ADMIN_SECRET   = os.environ.get('ADMIN_SECRET', 'ak-cms-secret-2026')

# Resend email config
resend.api_key     = os.environ.get('RESEND_API_KEY', '')
FOUNDER_EMAIL      = os.environ.get('FOUNDER_EMAIL', 'ogrisek.stefano@gmail.com')
SENDER_EMAIL       = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# ─── EMAIL HELPERS ────────────────────────────────────────────

def _founder_html(req) -> str:
    phone = req.phone or "—"
    ts    = req.created_at.strftime('%d/%m/%Y %H:%M UTC')
    return f"""
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden;">
      <!-- Header -->
      <tr><td style="background:#FFD700;padding:24px 32px;">
        <p style="margin:0;font-size:20px;font-weight:900;color:#000;text-transform:uppercase;letter-spacing:2px;">
          &#128293; New Pilot Request
        </p>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:32px;">
        <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;">New ArenaKore pilot request just received:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;">
          {''.join(f'<tr style="border-bottom:1px solid #1a1a1a;"><td style="padding:14px 18px;font-size:11px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px;width:35%;background:#050505;">{k}</td><td style="padding:14px 18px;font-size:14px;font-weight:600;color:#fff;">{v}</td></tr>'
          for k,v in [('Gym Name', req.gym_name), ('City', req.city), ('Owner', req.owner_name), ('Email', req.email), ('Phone', phone), ('Submitted', ts)])}
        </table>
        <div style="margin-top:28px;padding:20px;background:#111;border-left:4px solid #FFD700;border-radius:8px;">
          <p style="margin:0;font-size:13px;font-weight:700;color:#FFD700;text-transform:uppercase;letter-spacing:1px;">
            &#9889; Reply within 5 minutes.
          </p>
          <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;">High response speed increases conversion by 40%+.</p>
        </div>
        <p style="margin:24px 0 0;font-size:12px;color:#555;">
          Reply to: <a href="mailto:{req.email}" style="color:#00FFFF;">{req.email}</a>
        </p>
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #1a1a1a;">
        <p style="margin:0;font-size:11px;color:#333;">ArenaKore CMS — Automated Notification</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>"""

def _owner_html(req) -> str:
    return f"""
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden;">
      <!-- Header -->
      <tr><td style="background:#000;padding:28px 32px 0;text-align:center;">
        <p style="margin:0;font-size:28px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">
          ARENA<span style="color:#00FFFF;">KORE</span>
        </p>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:32px;">
        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#fff;">Hi {req.owner_name},</p>
        <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.6;">
          We received your request to start a <strong style="color:#fff;">14-day ArenaKore pilot</strong>
          for <strong style="color:#FFD700;">{req.gym_name}</strong>.<br>
          We'll contact you shortly to activate your gym.
        </p>
        <!-- Steps -->
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px;">What happens next</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          {''.join(f'<tr><td style="padding:10px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:32px;"><span style="font-size:18px;font-weight:900;color:{c};">{n}</span></td><td style="padding:10px 0 10px 12px;border-bottom:1px solid #1a1a1a;font-size:13px;color:#e0e0e0;">{t}</td></tr>'
          for n,c,t in [('01','#00FFFF','We select 20–30 active members for the pilot'),('02','#FFD700','We launch your first challenge within 48 hours'),('03','#00FFFF','We track engagement, attendance and performance'),('04','#FFD700','You see the impact. Then you decide.')])}
        </table>
        <!-- CTA -->
        <div style="margin-top:28px;padding:20px;background:#111;border-radius:12px;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Your pilot request</p>
          <p style="margin:0;font-size:20px;font-weight:900;color:#FFD700;text-transform:uppercase;">Confirmed ✓</p>
        </div>
        <p style="margin:28px 0 0;font-size:14px;color:#a1a1aa;line-height:1.6;">
          Talk soon,<br>
          <strong style="color:#fff;">ArenaKore Team</strong>
        </p>
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #1a1a1a;">
        <p style="margin:0;font-size:11px;color:#333;">
          Questions? <a href="mailto:support@arenakore.com" style="color:#00FFFF;">support@arenakore.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>"""

async def _send_pilot_emails(req):
    """Fire-and-forget: send both emails, log errors, never raise."""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set — skipping emails")
        return
    async def _send(to: str, subject: str, html: str):
        try:
            result = await asyncio.to_thread(resend.Emails.send, {
                "from": f"ArenaKore <{SENDER_EMAIL}>",
                "to": [to],
                "subject": subject,
                "html": html,
            })
            logger.info(f"Email sent → {to} | id: {result.get('id', '?')}")
        except Exception as e:
            logger.error(f"Email failed → {to}: {e}")

    await asyncio.gather(
        _send(FOUNDER_EMAIL, "🔥 New ArenaKore Pilot Request", _founder_html(req)),
        _send(req.email,     "ArenaKore — Pilot Request Received", _owner_html(req)),
    )

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
    await db.status_checks.insert_one(doc); return obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
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
    await db.pilot_requests.insert_one(doc)
    logger.info(f"Pilot request: {obj.gym_name} — {obj.email}")
    # Fire-and-forget: non-blocking email dispatch
    asyncio.create_task(_send_pilot_emails(obj))
    return obj

@api_router.get("/pilot-requests", response_model=List[PilotRequest])
async def get_pilot_requests(_=Depends(verify_admin)):
    docs = await db.pilot_requests.find({}, {"_id": 0}).to_list(1000)
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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    slug: str; title: str; seo_title: str = ''; meta_description: str = ''
    category: str = 'General'; read_time: str = '5 min read'; date: str = ''
    excerpt: str = ''; content: str; featured_image: str = ''; published: bool = True

class BlogPostUpdate(BaseModel):
    title: Optional[str]=None; seo_title: Optional[str]=None; meta_description: Optional[str]=None
    category: Optional[str]=None; read_time: Optional[str]=None; date: Optional[str]=None
    excerpt: Optional[str]=None; content: Optional[str]=None; featured_image: Optional[str]=None
    published: Optional[bool]=None

def _deserialize_post(d):
    for f in ('created_at', 'updated_at'):
        if isinstance(d.get(f), str): d[f] = datetime.fromisoformat(d[f])
    return d

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    docs = await db.blog_posts.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [_deserialize_post(d) for d in docs]

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    doc = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not doc: raise HTTPException(404, "Not found")
    return _deserialize_post(doc)

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(data: BlogPostCreate, _=Depends(verify_admin)):
    existing = await db.blog_posts.find_one({"slug": data.slug})
    if existing: raise HTTPException(400, f"Slug '{data.slug}' already exists")
    obj = BlogPost(**data.model_dump())
    doc = obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.blog_posts.insert_one(doc); return obj

@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, data: BlogPostUpdate, _=Depends(verify_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    update['updated_at'] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.find_one_and_update(
        {"id": post_id}, {"$set": update}, {"_id": 0}, return_document=True)
    if not result: raise HTTPException(404, "Not found")
    return _deserialize_post(result)

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, _=Depends(verify_admin)):
    await db.blog_posts.delete_one({"id": post_id})
    return {"ok": True}

@api_router.post("/blog/seed/demo")
async def seed_demo_blog(_=Depends(verify_admin)):
    count = await db.blog_posts.count_documents({})
    if count > 0: return {"ok": True, "seeded": 0, "message": "Already has posts"}
    return {"ok": True, "seeded": 0, "message": "Send posts via POST /api/blog"}

# ─── CMS: PAGES ───────────────────────────────────────────────
class PageMeta(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str; seo_title: str = ''; meta_description: str = ''; h1: str = ''
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PageMetaCreate(BaseModel):
    slug: str; seo_title: str = ''; meta_description: str = ''; h1: str = ''

class PageMetaUpdate(BaseModel):
    seo_title: Optional[str]=None; meta_description: Optional[str]=None; h1: Optional[str]=None

@api_router.get("/pages", response_model=List[PageMeta])
async def get_pages(_=Depends(verify_admin)):
    docs = await db.cms_pages.find({}, {"_id": 0}).to_list(100)
    for d in docs:
        if isinstance(d.get('updated_at'), str): d['updated_at'] = datetime.fromisoformat(d['updated_at'])
    return docs

@api_router.get("/pages/{slug:path}", response_model=PageMeta)
async def get_page_meta(slug: str):
    doc = await db.cms_pages.find_one({"slug": slug}, {"_id": 0})
    if not doc: raise HTTPException(404, "Not found")
    if isinstance(doc.get('updated_at'), str): doc['updated_at'] = datetime.fromisoformat(doc['updated_at'])
    return doc

@api_router.put("/pages/{slug:path}", response_model=PageMeta)
async def upsert_page_meta(slug: str, data: PageMetaUpdate, _=Depends(verify_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    update['updated_at'] = datetime.now(timezone.utc).isoformat()
    update['slug'] = slug
    doc = await db.cms_pages.find_one({"slug": slug})
    if doc:
        await db.cms_pages.update_one({"slug": slug}, {"$set": update})
    else:
        update['id'] = str(uuid.uuid4())
        await db.cms_pages.insert_one(update)
    result = await db.cms_pages.find_one({"slug": slug}, {"_id": 0})
    if isinstance(result.get('updated_at'), str): result['updated_at'] = datetime.fromisoformat(result['updated_at'])
    return result

# ─── CMS: MEDIA LIBRARY ───────────────────────────────────────
class MediaItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str; alt_text: str = ''; tag: str = 'general'
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MediaItemCreate(BaseModel):
    image_url: str; alt_text: str = ''; tag: str = 'general'

@api_router.get("/media", response_model=List[MediaItem])
async def get_media(_=Depends(verify_admin)):
    docs = await db.media_library.find({}, {"_id": 0}).sort("uploaded_at", -1).to_list(200)
    for d in docs:
        if isinstance(d.get('uploaded_at'), str): d['uploaded_at'] = datetime.fromisoformat(d['uploaded_at'])
    return docs

@api_router.post("/media", response_model=MediaItem)
async def add_media(data: MediaItemCreate, _=Depends(verify_admin)):
    obj = MediaItem(**data.model_dump())
    doc = obj.model_dump(); doc['uploaded_at'] = doc['uploaded_at'].isoformat()
    await db.media_library.insert_one(doc); return obj

@api_router.delete("/media/{item_id}")
async def delete_media(item_id: str, _=Depends(verify_admin)):
    await db.media_library.delete_one({"id": item_id}); return {"ok": True}

# ─── STATS ────────────────────────────────────────────────────
@api_router.get("/admin/stats")
async def get_admin_stats(_=Depends(verify_admin)):
    return {
        "blog_posts": await db.blog_posts.count_documents({}),
        "pages": await db.cms_pages.count_documents({}),
        "media": await db.media_library.count_documents({}),
        "pilot_requests": await db.pilot_requests.count_documents({}),
    }

# ─── APP SETUP ────────────────────────────────────────────────
app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"], allow_headers=["*"])

@app.on_event("shutdown")
async def shutdown_db_client(): client.close()
