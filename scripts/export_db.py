#!/usr/bin/env python3
"""
ArenaKore DB Export Script
Exports all MongoDB collections to JSON files for migration to MongoDB Atlas.

Usage:
  python3 scripts/export_db.py

Output: scripts/export/<collection>.json
"""
import asyncio, json, os, sys
from datetime import datetime
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / 'backend/.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME   = os.environ.get('DB_NAME', 'test_database')

COLLECTIONS = [
    'ak_users',
    'cms_pages',
    'blog_posts',
    'hero_slides',
    'media_library',
    'pilot_requests',
    'analytics_events',
]

OUTPUT_DIR = Path(__file__).parent / 'export'

def default_serializer(obj):
    if isinstance(obj, datetime): return obj.isoformat()
    raise TypeError(f'Object of type {type(obj)} is not JSON serializable')

async def export():
    client = AsyncIOMotorClient(MONGO_URL)
    db     = client[DB_NAME]
    OUTPUT_DIR.mkdir(exist_ok=True)

    total = 0
    for coll_name in COLLECTIONS:
        coll = db[coll_name]
        docs = await coll.find({}, {"_id": 0}).to_list(None)
        out_path = OUTPUT_DIR / f'{coll_name}.json'
        with open(out_path, 'w') as f:
            json.dump(docs, f, indent=2, default=default_serializer)
        print(f'  ✓ {coll_name:<25} {len(docs):>5} documents → {out_path.name}')
        total += len(docs)

    client.close()
    print(f'\nExport complete: {total} total documents in {OUTPUT_DIR}')
    print(f'Timestamp: {datetime.now().isoformat()}')

if __name__ == '__main__':
    asyncio.run(export())
