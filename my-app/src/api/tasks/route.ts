// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import * as db from "@/utils/db";
import { validateTaskPayload } from "@/utils/validation";

export async function GET() {
  const tasks = await db.getTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  validateTaskPayload(body);
  const newTask = await db.createTask(body);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  validateTaskPayload(body);
  await db.updateTask(body.id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.error();
  await db.deleteTask(id);
  return NextResponse.json({ success: true });
}
