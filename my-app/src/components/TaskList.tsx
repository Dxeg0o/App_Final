"use client";
import { useState } from "react";
import { Task, TaskStatus, Category } from "@/models/Task";

interface Props {
  tasks: Task[];
  categories: Category[];
  onUpdate: (tasks: Task[]) => void;
}

export default function TaskList({ tasks, categories, onUpdate }: Props) {
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [category, setCategory] = useState<Category | undefined>();

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  async function handleDelete(id: number) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      onUpdate(tasks.filter((t) => t.id !== id));
    }
  }

  async function handleComplete(task: Task) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, status: "completed", category: task.category }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = tasks.map((t) => (t.id === task.id ? Task.fromObject(data) : t));
      onUpdate(updated);
    }
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setStatus(task.status);
    setCategory(task.category);
  }

  async function saveEdit(task: Task) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status, category }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = tasks.map((t) => (t.id === task.id ? Task.fromObject(data) : t));
      onUpdate(updated);
      setEditingId(null);
    }
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
      <ul className="space-y-3">
        {filtered.map((task) => (
          <li
            key={task.id}
            className="border rounded-md p-4 flex justify-between items-start bg-white dark:bg-gray-800 shadow-sm"
          >
            {editingId === task.id ? (
              <>
                <div className="flex-grow flex gap-2">
                  <input
                    className="border rounded-md p-1 flex-grow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <select
                    className="border rounded-md p-1"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in-progress">En progreso</option>
                    <option value="completed">Completada</option>
                  </select>
                  <select
                    className="border rounded-md p-1"
                    value={category?.id ?? ""}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const cat = categories.find((c) => c.id === id);
                      setCategory(cat);
                    }}
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => saveEdit(task)}
                    className="bg-blue-600 px-2 text-white rounded-md"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 px-2 text-white rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>
                  {task.title}
                  {task.category ? ` - ${task.category.name}` : ""} [{task.status}]
                </span>
                <div className="space-x-2">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleComplete(task)}
                      className="bg-green-500 px-2 text-white rounded-md"
                    >
                      Completar
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(task)}
                    className="bg-yellow-500 px-2 text-white rounded-md"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 px-2 text-white rounded-md"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
