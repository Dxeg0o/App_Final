import { NextRequest, NextResponse } from 'next/server';
import { getTasks, addTask } from '@/utils/taskData';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const username = session.user.sub || session.user.email;
  const tasks = await getTasks(username);
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const username = session.user.sub || session.user.email;
  const { title, status, category, description, dueDate } = await request.json();
  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }
  const parsedDue = dueDate ? new Date(dueDate) : undefined;
  const task = await addTask(title, status, category, description, parsedDue, username);
  return NextResponse.json(task, { status: 201 });
}
