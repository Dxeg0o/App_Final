export type Status = "pending" | "in-progress" | "completed";

export interface TaskProps {
  id: number;
  title: string;
  categoryId: number;
  status?: Status;
  startDate?: string;
  endDate?: string;
}

export default class Task {
  id: number;
  title: string;
  categoryId: number;
  status: Status;
  startDate: string;
  endDate: string;

  constructor({
    id,
    title,
    categoryId,
    status = "pending",
    startDate = new Date().toISOString(),
    endDate = "",
  }: TaskProps) {
    this.id = id;
    this.title = title;
    this.categoryId = categoryId;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  markCompleted(): void {
    this.status = "completed";
    this.endDate = new Date().toISOString();
  }

  update(fields: Partial<Omit<TaskProps, "id">>): void {
    Object.assign(this, fields);
  }

  duration(): number | null {
    if (this.startDate && this.endDate) {
      return Date.parse(this.endDate) - Date.parse(this.startDate);
    }
    return null;
  }
}
