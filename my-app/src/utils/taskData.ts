import prisma from './prisma';
import { Task, TaskStatus, Category } from '@/models/Task';
import type { Task as PrismaTask, Category as PrismaCategory, Prisma } from '@prisma/client';

function toModel(task: PrismaTask & { category?: PrismaCategory | null }): Task {
  const category = task.category
    ? new Category(task.category.id, task.category.name)
    : undefined;
  const t = new Task(
    task.id,
    task.title,
    task.status as TaskStatus,
    category,
    task.startDate,
    task.description ?? '',
    task.dueDate ?? undefined
  );
  if (task.endDate) t.endDate = task.endDate;
  return t;
}

export async function getTasks(): Promise<Task[]> {
  const tasks = await prisma.task.findMany({ include: { category: true } });
  return tasks.map(toModel);
}

export async function addTask(
  title: string,
  status: TaskStatus = 'pending',
  category?: Category,
  description = '',
  dueDate?: Date
): Promise<Task> {
  const data: Prisma.TaskUncheckedCreateInput = {
    title,
    status,
    description,
    dueDate,
  };
  if (category) {
    data.category = {
      connectOrCreate: {
        where: { id: category.id },
        create: { id: category.id, name: category.name },
      },
    };
  }
  const task = await prisma.task.create({ data, include: { category: true } });
  return toModel(task);
}

export async function getTask(id: number): Promise<Task | undefined> {
  const task = await prisma.task.findUnique({ where: { id }, include: { category: true } });
  return task ? toModel(task) : undefined;
}

export async function updateTask(
  id: number,
  title: string,
  status: TaskStatus,
  category?: Category,
  description?: string,
  dueDate?: Date
): Promise<Task | undefined> {
  const existing = await prisma.task.findUnique({ where: { id }, include: { category: true } });
  if (!existing) return undefined;
  const data: Prisma.TaskUncheckedUpdateInput = { title, status, dueDate };
  if (description !== undefined) data.description = description;
  if (status === 'completed' && !existing.endDate) {
    data.endDate = new Date();
  }
  if (category) {
    data.category = {
      connectOrCreate: {
        where: { id: category.id },
        create: { id: category.id, name: category.name },
      },
    };
  } else {
    data.category = { disconnect: true };
  }
  const task = await prisma.task.update({ where: { id }, data, include: { category: true } });
  return toModel(task);
}

export async function deleteTaskById(id: number): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
