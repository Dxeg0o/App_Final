import clientPromise from './mongodb';
import { Task, TaskStatus, Category } from '@/models/Task';

async function getCollection() {
  const client = await clientPromise;
  return client.db().collection('tasks');
}

export async function getTasks(): Promise<Task[]> {
  const col = await getCollection();
  const docs = await col.find().toArray();
  return docs.map((d: Record<string, unknown>) => Task.fromObject(d));
}

export async function addTask(
  title: string,
  status: TaskStatus = 'pending',
  category?: Category
): Promise<Task> {
  const col = await getCollection();
  const last = await col.find().sort({ id: -1 }).limit(1).toArray();
  const id = last.length ? last[0].id + 1 : 1;
  const task = new Task(id, title, status, category);
  await col.insertOne({ ...task });
  return task;
}

export async function getTask(id: number): Promise<Task | undefined> {
  const col = await getCollection();
  const doc = await col.findOne({ id });
  return doc ? Task.fromObject(doc) : undefined;
}

export async function updateTask(
  id: number,
  title: string,
  status: TaskStatus,
  category?: Category
): Promise<Task | undefined> {
  const col = await getCollection();
  const doc = await col.findOne({ id });
  if (!doc) return undefined;
  const update: Record<string, unknown> = { title, status, category };
  if (status === 'completed' && !doc.endDate) {
    update.endDate = new Date();
  }
  await col.updateOne({ id }, { $set: update });
  return Task.fromObject({ ...doc, ...update, endDate: update.endDate ?? doc.endDate });
}

export async function deleteTaskById(id: number): Promise<boolean> {
  const col = await getCollection();
  const res = await col.deleteOne({ id });
  return res.deletedCount === 1;
}
