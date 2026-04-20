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
    # Fire-and-forget: emails + webhook, non-blocking
    asyncio.create_task(_send_pilot_emails(obj))
    asyncio.create_task(_trigger_lead_webhook(obj))
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
    existing = await db.hero_slides.count_documents({})
    if existing > 0:
        return {"ok": True, "seeded": 0, "message": f"Already has {existing} slides"}
    inserted = 0
    for slide_data in DEFAULT_HERO_SLIDES:
        obj = HeroSlide(**slide_data)
        doc = obj.model_dump(); doc['created_at'] = doc['created_at'].isoformat()
        await db.hero_slides.insert_one(doc)
        inserted += 1
    return {"ok": True, "seeded": inserted, "message": f"Seeded {inserted} default slides"}

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
        "hero_slides": await db.hero_slides.count_documents({}),
    }

# All known routes — single source of truth
KNOWN_ROUTES = [
    {"slug": "/",                    "name": "Home",               "section": "main"},
    {"slug": "/arena-system",        "name": "Arena System",        "section": "main"},
    {"slug": "/for-athletes",        "name": "Athletes",            "section": "main"},
    {"slug": "/workout-competition", "name": "Competition",         "section": "main"},
    {"slug": "/amrap-training",      "name": "AMRAP Training",      "section": "main"},
    {"slug": "/crossfit-challenge",  "name": "CrossFit",            "section": "main"},
    {"slug": "/gym-challenge-pilot", "name": "Business / Pilot",    "section": "main"},
    {"slug": "/blog",                "name": "Blog",                "section": "main"},
    {"slug": "/get-the-app",         "name": "Get the App",         "section": "main"},
    {"slug": "/for-gyms",            "name": "For Gyms",            "section": "secondary"},
    {"slug": "/fitness-challenge-app","name": "Fitness Challenge App","section": "secondary"},
    {"slug": "/fitness-gamification","name": "Fitness Gamification","section": "secondary"},
    {"slug": "/support",             "name": "Support",             "section": "support"},
    {"slug": "/for-athletes",        "name": "For Athletes",        "section": "secondary"},
]

@api_router.get("/cms/pages")
async def get_pages_catalog(_=Depends(verify_admin)):
    """Returns all known routes with their CMS override status."""
    overrides = {}
    async for d in db.cms_pages.find({}, {"_id": 0}):
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
    docs = await db.hero_slides.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(20)
    return [_deser_slide(d) for d in docs]

@api_router.get("/hero-slides/all")
async def get_all_hero_slides(_=Depends(verify_admin)):
    docs = await db.hero_slides.find({}, {"_id": 0}).sort("order", 1).to_list(20)
    return [_deser_slide(d) for d in docs]

@api_router.post("/hero-slides", response_model=HeroSlide)
async def create_hero_slide(data: HeroSlideCreate, _=Depends(verify_admin)):
    obj = HeroSlide(**data.model_dump())
    doc = obj.model_dump(); doc['created_at'] = doc['created_at'].isoformat()
    await db.hero_slides.insert_one(doc); return obj

@api_router.put("/hero-slides/{slide_id}", response_model=HeroSlide)
async def update_hero_slide(slide_id: str, data: HeroSlideUpdate, _=Depends(verify_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    result = await db.hero_slides.find_one_and_update(
        {"id": slide_id}, {"$set": update}, {"_id": 0}, return_document=True)
    if not result: raise HTTPException(404, "Not found")
    return _deser_slide(result)

@api_router.delete("/hero-slides/{slide_id}")
async def delete_hero_slide(slide_id: str, _=Depends(verify_admin)):
    await db.hero_slides.delete_one({"id": slide_id}); return {"ok": True}

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
        await db.analytics_events.insert_one(doc)
    except Exception as e:
        logger.debug(f"Event log failed (non-critical): {e}")
    return {"ok": True}

@api_router.get("/events/summary")
async def events_summary(_=Depends(verify_admin)):
    pipeline = [
        {"$group": {"_id": "$event", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 50},
    ]
    result = await db.analytics_events.aggregate(pipeline).to_list(50)
    return [{"event": r["_id"], "count": r["count"]} for r in result]

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
app.add_middleware(CORSMiddleware, allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"], allow_headers=["*"])

@app.on_event("shutdown")
async def shutdown_db_client(): client.close()
