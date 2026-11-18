import { NextResponse } from 'next/server';
import { reset } from '../../../lib/db';

// POST /api/reset -> re-seed the DB (demo helper)
export async function POST() {
  reset();
  return NextResponse.json({ ok: true });
}
