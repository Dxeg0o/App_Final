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
    public startDate: Date = new Date()
  ) {}

  markCompleted() {
    this.status = "completed";
    this.endDate = new Date();
  }

  update(title: string, status: TaskStatus, category?: Category) {
    this.title = title;
    this.status = status;
    this.category = category;
  }
}
