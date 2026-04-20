#!/usr/bin/env python3
"""
ArenaKore DB Import Script
Imports JSON export files into a MongoDB instance (e.g. MongoDB Atlas).

Usage:
  MONGO_URL="mongodb+srv://..." DB_NAME="arenakore_production" python3 scripts/import_db.py

Optional: pass --drop to clear collections before import
"""
import asyncio, json, os, sys, argparse
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / 'backend/.env')

MONGO_URL  = os.environ.get('MONGO_URL')
DB_NAME    = os.environ.get('DB_NAME', 'arenakore_production')
EXPORT_DIR = Path(__file__).parent / 'export'

async def import_db(drop: bool = False):
    if not MONGO_URL:
        print('ERROR: MONGO_URL env var required')
        sys.exit(1)

    client = AsyncIOMotorClient(MONGO_URL)
    db     = client[DB_NAME]
    total  = 0

    for json_file in sorted(EXPORT_DIR.glob('*.json')):
        coll_name = json_file.stem
        with open(json_file) as f:
            docs = json.load(f)
        if not docs:
            print(f'  - {coll_name:<25} (empty, skipped)')
            continue
        coll = db[coll_name]
        if drop:
            await coll.drop()
            print(f'  ⚠ {coll_name} dropped')
        result = await coll.insert_many(docs, ordered=False)
        print(f'  ✓ {coll_name:<25} {len(result.inserted_ids):>5} inserted')
        total += len(result.inserted_ids)

    client.close()
    print(f'\nImport complete: {total} documents into {DB_NAME}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--drop', action='store_true', help='Drop collections before import')
    args = parser.parse_args()
    asyncio.run(import_db(drop=args.drop))
