import { NextResponse } from 'next/server';
import { load, save, toPublic } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// POST /api/swipe { profileId, action: 'like' | 'pass' } -> { match, profile? }
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { body = null; }
  const { profileId, action } = body || {};
  if (!['like', 'pass'].includes(action) || !Number.isInteger(profileId)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const db = load();
  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  if (profileId in db.swipes) {
    return NextResponse.json({ error: 'Already swiped' }, { status: 409 });
  }

  db.swipes[profileId] = action;
  // Match only when BOTH sides liked. A pass (or a one-sided like) reveals nothing.
  const match = action === 'like' && profile.likesMe;
  if (match) db.matches.push({ profileId, matchedAt: new Date().toISOString() });
  save(db);

  return NextResponse.json({ match, profile: match ? toPublic(profile) : undefined });
}
