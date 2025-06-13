import { NextRequest, NextResponse } from 'next/server';
import { getTasks, addTask } from '@/utils/taskData';

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const { title, status, category, description, dueDate } = await request.json();
  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }
  const parsedDue = dueDate ? new Date(dueDate) : undefined;
  const task = await addTask(title, status, category, description, parsedDue);
  return NextResponse.json(task, { status: 201 });
}
