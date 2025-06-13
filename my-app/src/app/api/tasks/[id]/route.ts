import { NextRequest, NextResponse } from "next/server";
import { getTask, updateTask, deleteTaskById } from "@/utils/taskData";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  const task = await getTask(taskId);
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  const body = await request.json();
  const dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
  const task = await updateTask(
    taskId,
    body.title,
    body.status,
    body.category,
    body.description,
    dueDate
  );
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  const success = await deleteTaskById(taskId);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({});
}
