import { NextRequest, NextResponse } from "next/server";
import { getTask, updateTask, deleteTaskById } from "@/utils/taskData";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "secret";

function getUsername(request: NextRequest): string | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, secret) as { username: string };
    return decoded.username;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const username = getUsername(request);
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const taskId = parseInt(id, 10);
  const task = await getTask(taskId, username);
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const username = getUsername(request);
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const taskId = parseInt(id, 10);
  const body = await request.json();
  const dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
  const task = await updateTask(
    taskId,
    username,
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const username = getUsername(request);
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const taskId = parseInt(id, 10);
  const success = await deleteTaskById(taskId, username);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({});
}
