import { NextRequest, NextResponse } from 'next/server';
import { getTasks, addTask } from '@/utils/taskData';

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const { title, status, category } = await request.json();
  if (!title) {
    return NextResponse.json({ error: 'Title required' }, { status: 400 });
  }
  const task = await addTask(title, status, category);
  return NextResponse.json(task, { status: 201 });
}
