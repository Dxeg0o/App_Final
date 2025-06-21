import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '@/utils/userData';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const user = await validateUser(username, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = jwt.sign({ username }, secret, { expiresIn: '1d' });
  const res = NextResponse.json(user);
  res.cookies.set('token', token, { httpOnly: true, path: '/' });
  return res;
}
