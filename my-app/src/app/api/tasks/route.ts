import { NextRequest, NextResponse } from 'next/server';
import { getTasks, addTask } from '@/utils/taskData';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

function getUsername(request: NextRequest): string | null {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret) as { username: string };
    return decoded.username;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const username = getUsername(request);
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const tasks = await getTasks(username);
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const username = getUsername(request);
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { title, status, category, description, dueDate } = await request.json();
  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }
  const parsedDue = dueDate ? new Date(dueDate) : undefined;
  const task = await addTask(title, status, category, description, parsedDue, username);
  return NextResponse.json(task, { status: 201 });
}
