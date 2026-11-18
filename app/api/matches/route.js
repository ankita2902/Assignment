import { NextResponse } from 'next/server';
import { load, toPublic } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// GET /api/matches -> mutual matches only, newest first
export async function GET() {
  const db = load();
  const matches = [...db.matches]
    .sort((a, b) => b.matchedAt.localeCompare(a.matchedAt))
    .map((m) => ({ ...toPublic(db.profiles.find((p) => p.id === m.profileId)), matchedAt: m.matchedAt }));
  return NextResponse.json({ matches });
}
