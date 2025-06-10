import { Task, TaskStatus, Category } from "@/models/Task";

let taskId = 0;

export function createTask(
  title: string,
  status: TaskStatus = "pending",
  category?: Category
): Task {
  return new Task(++taskId, title, status, category);
}

export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status);
}

export function filterByCategory(tasks: Task[], categoryId: number): Task[] {
  return tasks.filter((t) => t.category?.id === categoryId);
}

export function percentageCompleted(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === "completed").length;
  return (completed / tasks.length) * 100;
}

export function averageDuration(tasks: Task[]): number {
  const completedTasks = tasks.filter(
    (t) => t.status === "completed" && t.endDate
  );
  if (completedTasks.length === 0) return 0;
  const total = completedTasks.reduce((sum, t) => {
    const end = t.endDate ? t.endDate.getTime() : t.startDate.getTime();
    return sum + (end - t.startDate.getTime());
  }, 0);
  return total / completedTasks.length;
}
