"use client";
import { useState } from "react";
import { Task, TaskStatus } from "@/models/Task";
import { deleteTask } from "@/utils/taskUtils";

interface Props {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

export default function TaskList({ tasks, onUpdate }: Props) {
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  function handleDelete(id: number) {
    onUpdate(deleteTask(tasks, id));
  }

  function handleComplete(task: Task) {
    task.markCompleted();
    onUpdate([...tasks]);
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <label>Filtrar:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as TaskStatus | "all")}
          className="border p-1"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendiente</option>
          <option value="in-progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>
      </div>
      <ul className="space-y-2">
        {filtered.map((task) => (
          <li key={task.id} className="border p-2 flex justify-between">
            <span>
              {task.title}
              {task.category ? ` - ${task.category.name}` : ""} [{task.status}]
            </span>
            <div className="space-x-2">
              {task.status !== "completed" && (
                <button
                  onClick={() => handleComplete(task)}
                  className="bg-green-500 px-2 text-white"
                >
                  Completar
                </button>
              )}
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-600 px-2 text-white"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
