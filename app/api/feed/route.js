import { NextResponse } from 'next/server';
import { load, toPublic } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// GET /api/feed -> profiles the user has not swiped on yet
export async function GET() {
  const db = load();
  const profiles = db.profiles.filter((p) => !(p.id in db.swipes)).map(toPublic);
  return NextResponse.json({ profiles });
}
