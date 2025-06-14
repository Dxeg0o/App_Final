export type TaskStatus = "pending" | "in-progress" | "completed";

export class Category {
  constructor(public id: number, public name: string) {}
}

export class Task {
  public endDate?: Date;
  constructor(
    public id: number,
    public title: string,
    public status: TaskStatus = "pending",
    public category?: Category,
    public startDate: Date = new Date(),
    public description: string = "",
    public dueDate?: Date
  ) {}

  static fromObject(obj: Record<string, unknown>): Task {
    const task = new Task(
      obj.id as number,
      obj.title as string,
      obj.status as TaskStatus,
      obj.category as Category,
      new Date(obj.startDate as string | number | Date),
      (obj.description as string) || "",
      obj.dueDate ? new Date(obj.dueDate as string | number | Date) : undefined
    );
    if (obj.endDate) {
      task.endDate = new Date(obj.endDate as string | number | Date);
    }
    return task;
  }

  markCompleted() {
    this.status = "completed";
    this.endDate = new Date();
  }

  update(
    title: string,
    status: TaskStatus,
    category?: Category,
    description?: string,
    dueDate?: Date
  ) {
    this.title = title;
    this.status = status;
    this.category = category;
    if (description !== undefined) this.description = description;
    this.dueDate = dueDate;
  }
}
