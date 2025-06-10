import Task, { Status } from "../models/Task";

export const filterByStatus = (tasks: Task[], status: Status): Task[] =>
  tasks.filter((t) => t.status === status);

export const filterByCategory = (tasks: Task[], categoryId: number): Task[] =>
  tasks.filter((t) => t.categoryId === categoryId);

export const completionRate = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === "completed").length;
  return (completed / tasks.length) * 100;
};

export const averageDuration = (tasks: Task[]): number => {
  const durations = tasks
    .map((t) => t.duration())
    .filter((d): d is number => d !== null);
  if (durations.length === 0) return 0;
  return durations.reduce((sum, d) => sum + d, 0) / durations.length;
};
