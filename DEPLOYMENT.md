# ArenaKore — Production Deployment Guide

## Architecture Overview

```
arenakore.com          →  Frontend (React static build)
api.arenakore.com      →  Backend  (FastAPI + Gunicorn)
MongoDB Atlas          →  Database
Resend                 →  Transactional email
GA4 + /api/events      →  Analytics
```

---

## Step 1 — MongoDB Atlas (Database)

1. Sign up at **https://cloud.mongodb.com**
2. Create a free cluster (M0 Sandbox)
3. Create database user: Settings → Database Access → Add User
4. Allow network access: Settings → Network Access → Allow from anywhere (`0.0.0.0/0`)
5. Get connection string: Connect → Drivers → Copy connection string
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/
   ```
6. Replace in backend `.env`:
   ```
   MONGO_URL=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=arenakore_production
   ```

### Migrate existing data (optional)
```bash
# Export from current instance
python3 scripts/export_db.py

# Import to Atlas
MONGO_URL="mongodb+srv://..." DB_NAME="arenakore_production" python3 scripts/import_db.py
```

---

## Step 2 — Backend Deploy (Render.com recommended)

### Option A: Render.com (Free tier available)

1. Sign up at **https://render.com**
2. New → Web Service → Connect GitHub repo
3. Settings:
   - **Name**: arenakore-api
   - **Environment**: Python
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn backend.server:app -c backend/gunicorn.conf.py`
   - **Root Directory**: `/` (or point to `/app`)
4. Add environment variables (from `.env.example`):
   - `MONGO_URL` = your Atlas connection string
   - `DB_NAME` = `arenakore_production`
   - `JWT_SECRET` = 64-char random hex
   - `ADMIN_PASSWORD` = strong password
   - `ADMIN_EMAIL` = admin@arenakore.com
   - `CORS_ORIGINS` = `https://arenakore.com,https://www.arenakore.com`
   - `RESEND_API_KEY` = your Resend key
   - `FOUNDER_EMAIL` = your email
   - `SENDER_EMAIL` = noreply@arenakore.com
5. Custom domain: Settings → Custom Domain → `api.arenakore.com`

### Option B: VPS (Ubuntu 22.04)
```bash
# Install dependencies
apt update && apt install -y python3-pip nginx certbot python3-certbot-nginx

# Clone and setup
cd /var/www/arenakore
pip3 install -r backend/requirements.txt

# Create systemd service
cat > /etc/systemd/system/arenakore-api.service << EOF
[Unit]
Description=ArenaKore API
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/arenakore
ExecStart=gunicorn backend.server:app -c backend/gunicorn.conf.py
Restart=always
EnvironmentFile=/var/www/arenakore/backend/.env

[Install]
WantedBy=multi-user.target
EOF

systemctl enable arenakore-api
systemctl start arenakore-api

# Nginx reverse proxy
cat > /etc/nginx/sites-available/arenakore-api << EOF
server {
    listen 80;
    server_name api.arenakore.com;
    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -s /etc/nginx/sites-available/arenakore-api /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# SSL
certbot --nginx -d api.arenakore.com
```

---

## Step 3 — Frontend Deploy

### Build for production
```bash
cd frontend

# Create .env.production
cat > .env.production << EOF
REACT_APP_BACKEND_URL=https://api.arenakore.com
REACT_APP_GA_ID=G-XXXXXXXXXX
REACT_APP_APPSTORE_URL=https://apps.apple.com/app/arenakore/id000000000
REACT_APP_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=com.arenakore
EOF

# Build
yarn build
# Output: frontend/build/
```

### Option A: Netlify (Easiest)
1. Sign up at **https://netlify.com**
2. Drag & drop `frontend/build/` folder into Netlify dashboard
3. Site settings → Domain management → Add custom domain: `arenakore.com`
4. SSL auto-configured via Let's Encrypt

### Option B: Vercel
```bash
npm i -g vercel
cd frontend
vercel --prod
# Follow prompts → add arenakore.com as domain
```

### Option C: SiteGround (cPanel)
1. Build locally: `yarn build`
2. Upload `frontend/build/` contents to `public_html/` via FTP or File Manager
3. Create `.htaccess` for SPA routing:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```
4. SSL: cPanel → Let's Encrypt → Install

---

## Step 4 — DNS Configuration

### At your domain registrar (e.g. Namecheap, GoDaddy, Cloudflare):

```
TYPE    NAME              VALUE
──────────────────────────────────────────────────────
A       @                 → Your frontend host IP (or use CNAME for Netlify/Vercel)
CNAME   www               → arenakore.com
CNAME   api               → your-render-app.onrender.com  (or backend VPS IP)
```

#### If using Cloudflare (recommended):
- Enable Cloudflare proxy (orange cloud) for `@` and `www`
- Use "DNS only" (grey cloud) for `api` subdomain
- Set SSL/TLS: Full (strict)

---

## Step 5 — Admin Panel in Production

The admin panel is accessible at:
```
https://arenakore.com/admin
```

Password is controlled by `ADMIN_PASSWORD` env var on the backend.

**Default credentials (change in production!):**
- Password: from `ADMIN_PASSWORD` env var
- Set a strong password, minimum 16 chars

---

## Step 6 — Resend Email Setup

1. Sign up at **https://resend.com**
2. Add domain: Settings → Domains → Add domain → `arenakore.com`
3. Add DNS records as shown by Resend (MX, TXT, DKIM)
4. Create API key: API Keys → Create
5. Update backend `.env`:
   ```
   RESEND_API_KEY=re_XXXXXXXXXXXX
   SENDER_EMAIL=noreply@arenakore.com
   ```

---

## Step 7 — Google Analytics 4

1. Sign up at **https://analytics.google.com**
2. Create property → Web stream → URL: `arenakore.com`
3. Copy Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to frontend `.env.production`:
   ```
   REACT_APP_GA_ID=G-XXXXXXXXXX
   ```

---

## Step 8 — Hero Slides & Media

Hero slides are stored in MongoDB (`hero_slides` collection).

**To persist media across deployments:**
- Store images on external CDN (Cloudflare Images, Cloudinary, AWS S3)
- Use the CMS admin to update image URLs after migration
- Never rely on local file storage for production

---

## Production Checklist

### Backend
- [ ] MongoDB Atlas connected and tested
- [ ] `JWT_SECRET` set to random 64-char hex
- [ ] `ADMIN_PASSWORD` changed from default
- [ ] `CORS_ORIGINS` set to `https://arenakore.com,https://www.arenakore.com`
- [ ] Resend domain verified and API key active
- [ ] SSL certificate valid on `api.arenakore.com`
- [ ] Health check: `GET https://api.arenakore.com/api/` returns `{"message":"Hello World"}`

### Frontend
- [ ] `REACT_APP_BACKEND_URL=https://api.arenakore.com`
- [ ] `REACT_APP_GA_ID` set
- [ ] `yarn build` completes without errors
- [ ] SPA routing configured (`_redirects` or `.htaccess`)
- [ ] SSL certificate valid on `arenakore.com`
- [ ] All pages load correctly
- [ ] Hero slider loads from CMS
- [ ] Pilot form submits and sends emails
- [ ] Language selector persists across reload

### Database
- [ ] All collections migrated from dev → production
- [ ] Admin user seeded (auto on startup)
- [ ] Hero slides seeded (via `/admin` → Hero Slides → Load Defaults)
- [ ] Indexes created (email unique on `ak_users`)

---

## Quick Start Commands

```bash
# Generate JWT_SECRET
python3 -c "import secrets; print(secrets.token_hex(32))"

# Export DB from dev
python3 scripts/export_db.py

# Import DB to production Atlas
MONGO_URL="mongodb+srv://..." DB_NAME="arenakore_production" python3 scripts/import_db.py

# Build frontend
cd frontend && yarn build

# Test backend health
curl https://api.arenakore.com/api/

# Test admin login
curl -X POST https://api.arenakore.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YOUR_ADMIN_PASSWORD"}'
```

---

## Recommended Stack Summary

| Component | Service | Cost |
|-----------|---------|------|
| Domain    | Namecheap / GoDaddy | ~$12/yr |
| DNS + CDN | Cloudflare Free | Free |
| Frontend  | Netlify Free / Vercel | Free |
| Backend   | Render.com (Starter $7/mo) | $7/mo |
| Database  | MongoDB Atlas M0 | Free (512MB) |
| Email     | Resend (3000/mo) | Free |
| Analytics | Google Analytics 4 | Free |
| **Total** | | **~$7/month** |

---

*Generated by ArenaKore deployment system · v1.0 · April 2026*
