import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUser } from '@/utils/userData';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const existing = await findUser(username);
  if (existing) {
    return NextResponse.json({ error: 'User exists' }, { status: 409 });
  }
  const user = await createUser(username, password);
  return NextResponse.json(user, { status: 201 });
}
