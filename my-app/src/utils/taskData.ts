import { promises as fs } from 'fs';
import { join } from 'path';
import { Task, TaskStatus, Category } from '@/models/Task';

const dataFile = join(process.cwd(), 'my-app', 'data', 'tasks.json');

export async function getTasks(): Promise<Task[]> {
  const data = await fs.readFile(dataFile, 'utf-8');
  return JSON.parse(data) as Task[];
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify(tasks, null, 2));
}

export async function addTask(
  title: string,
  status: TaskStatus = 'pending',
  category?: Category
): Promise<Task> {
  const tasks = await getTasks();
  const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const task = new Task(id, title, status, category);
  tasks.push(task);
  await saveTasks(tasks);
  return task;
}

export async function getTask(id: number): Promise<Task | undefined> {
  const tasks = await getTasks();
  return tasks.find(t => t.id === id);
}

export async function updateTask(
  id: number,
  title: string,
  status: TaskStatus,
  category?: Category
): Promise<Task | undefined> {
  const tasks = await getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return undefined;
  task.title = title;
  task.status = status;
  task.category = category;
  if (status === 'completed' && !task.endDate) {
    task.endDate = new Date();
  }
  await saveTasks(tasks);
  return task;
}

export async function deleteTaskById(id: number): Promise<boolean> {
  const tasks = await getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  await saveTasks(tasks);
  return true;
}
