import clientPromise from './mongodb';
import { Task, TaskStatus, Category } from '@/models/Task';

async function getCollection() {
  const client = await clientPromise;
  return client.db().collection('tasks');
}

export async function getTasks(username: string): Promise<Task[]> {
  const col = await getCollection();
  const docs = await col.find({ username }).toArray();
  return docs.map((d: Record<string, unknown>) => Task.fromObject(d));
}

export async function addTask(
  title: string,
  status: TaskStatus = 'pending',
  category?: Category,
  description = '',
  dueDate?: Date,
  username?: string
): Promise<Task> {
  const col = await getCollection();
  const last = await col.find().sort({ id: -1 }).limit(1).toArray();
  const id = last.length ? last[0].id + 1 : 1;
  const task = new Task(id, title, status, category, new Date(), description, dueDate, username);
  await col.insertOne({ ...task });
  return task;
}

export async function getTask(id: number, username: string): Promise<Task | undefined> {
  const col = await getCollection();
  const doc = await col.findOne({ id, username });
  return doc ? Task.fromObject(doc) : undefined;
}

export async function updateTask(
  id: number,
  username: string,
  title: string,
  status: TaskStatus,
  category?: Category,
  description?: string,
  dueDate?: Date
): Promise<Task | undefined> {
  const col = await getCollection();
  const doc = await col.findOne({ id, username });
  if (!doc) return undefined;
  const update: Record<string, unknown> = { title, status, category };
  if (description !== undefined) {
    update.description = description;
  }
  update.dueDate = dueDate;
  if (status === 'completed' && !doc.endDate) {
    update.endDate = new Date();
  }
  await col.updateOne({ id, username }, { $set: update });
  return Task.fromObject({ ...doc, ...update, endDate: update.endDate ?? doc.endDate });
}

export async function deleteTaskById(id: number, username: string): Promise<boolean> {
  const col = await getCollection();
  const res = await col.deleteOne({ id, username });
  return res.deletedCount === 1;
}
