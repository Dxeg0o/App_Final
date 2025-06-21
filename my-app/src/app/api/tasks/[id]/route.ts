import { NextRequest, NextResponse } from "next/server";
import { getTask, updateTask, deleteTaskById } from "@/utils/taskData";
import { auth0 } from "@/lib/auth0";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // The type of username is `string | undefined` here
  const username = session.user.sub || session.user.email;

  // Add a check to handle the case where username is undefined
  if (!username) {
    return NextResponse.json(
      { error: "Username not found in session" },
      { status: 400 }
    );
  }
  // From this point on, TypeScript knows `username` is a `string`

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
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = session.user.sub || session.user.email;

  // Add the same check here
  if (!username) {
    return NextResponse.json(
      { error: "Username not found in session" },
      { status: 400 }
    );
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
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = session.user.sub || session.user.email;

  // And also add the check here
  if (!username) {
    return NextResponse.json(
      { error: "Username not found in session" },
      { status: 400 }
    );
  }

  const { id } = await params;
  const taskId = parseInt(id, 10);
  const success = await deleteTaskById(taskId, username);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({});
}
