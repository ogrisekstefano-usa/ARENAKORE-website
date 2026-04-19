from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, hashlib, hmac
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
    logger.info(f"Pilot request: {obj.gym_name} — {obj.email}"); return obj

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
