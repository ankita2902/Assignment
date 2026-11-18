# Coy Discover

Swipe-based "Discover" tab built with Next.js (App Router). Persistence: JSON file at `data/db.json` (auto-created and seeded on first request).

## Run
```bash
npm install
npm run dev   # http://localhost:3000  (open in mobile view for drag gestures)
```

## Features
- 30 seeded profiles; 10 of them have already liked you (visible only server-side).
- Drag-to-swipe (mobile/desktop), ✕/♥ buttons, ←/→ keys; LIKE/NOPE stamps and fly-out animation.
- Swiped profiles never return (filtered server-side from `/api/feed`; duplicate swipes get 409).
- "It's a match!" screen only when both sides liked; Matches view lists mutual matches.
- State persists across reloads. "Reset demo data" button on the empty state (`POST /api/reset`).

## API
| Method | Path | Description |
|---|---|---|
| GET | `/api/feed` | Profiles not yet swiped on |
| POST | `/api/swipe` | `{profileId, action: "like"\|"pass"}` -> `{match, profile?}` |
| GET | `/api/matches` | Mutual matches, newest first |

## Privacy design
The `likesMe` flag never leaves the server: every profile passes through `toPublic()`, feed order is pre-shuffled so likers aren't clustered, and `/swipe` responds with profile data only on a mutual match.

## Demo tip
Like everyone: you'll get 10 matches. Pass on everyone: you'll get none and nothing is revealed.

> Note: file-based storage needs a writable filesystem (local, VPS, Render). On Vercel, swap `lib/db.js` for SQLite/Turso/Vercel KV.

---

# Part A — Two feature suggestions

## 1. Anonymous "Hint" nudge
Let a user send their crush a vague, privacy-safe hint ("someone from your college added you") with no identity or exact detail revealed, and let them choose how much to disclose (college, year, none).
**Why:** Mutual-only reveal can feel silent. The crush has no reason to open the app or add anyone back. A hint creates curiosity, triggers re-engagement and invites, and drives the viral loop, while the core promise (no identity reveal unless mutual) stays intact.

## 2. Post-match icebreaker / time-boxed chat
When a match happens, give both people a lightweight shared prompt (e.g. "pick a spot for coffee", "this-or-that" questions) and an in-app chat that nudges them within 48 hours.
**Why:** Reveal is the peak moment, then users face an awkward blank screen and often drop off. Guided first interaction turns matches into conversations, which is the real outcome users want and the metric that drives retention.
