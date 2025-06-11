import { NextRequest, NextResponse } from "next/server";
import { getTask, updateTask, deleteTaskById } from "@/utils/taskData";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const taskId = parseInt(id);
  const task = await getTask(taskId);
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const taskId = parseInt(id);
  const body = await request.json();
  const task = await updateTask(taskId, body.title, body.status, body.category);
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const taskId = parseInt(id);
  const success = await deleteTaskById(taskId);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({});
}
