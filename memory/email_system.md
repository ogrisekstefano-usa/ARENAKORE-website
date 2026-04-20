# ArenaKore Email System — Test Guide

## Setup
- RESEND_API_KEY → set in `/app/backend/.env`
- FOUNDER_EMAIL  → ogrisek.stefano@gmail.com
- SENDER_EMAIL   → onboarding@resend.dev

## Trigger
POST /api/pilot-requests → fires 2 emails automatically

## Email 1 — Founder Notification
- To: ogrisek.stefano@gmail.com
- Subject: "🔥 New ArenaKore Pilot Request"
- Contains: gym_name, city, owner_name, email, phone, timestamp

## Email 2 — Owner Auto-Reply
- To: {user email from form}
- Subject: "ArenaKore — Pilot Request Received"
- Contains: confirmation + next steps

## Resend Test (curl)
```bash
API_URL=https://talent-card-refactor.preview.emergentagent.com
curl -X POST "$API_URL/api/pilot-requests" \
  -H "Content-Type: application/json" \
  -d '{"gym_name":"Test Box","city":"Roma","owner_name":"Mario Rossi","email":"mario@test.com"}'
```

## Error Handling
- Email failures are logged but NEVER block the API response
- Uses asyncio.create_task() → fire and forget
- Both emails sent in parallel via asyncio.gather()
