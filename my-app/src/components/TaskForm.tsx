"use client";
import { useState } from "react";
import { Category, Task } from "@/models/Task";

interface Props {
  categories: Category[];
  onAdd: (task: Task) => void;
}

export default function TaskForm({ categories, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim() === "") return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status: "pending", category }),
    });
    if (res.ok) {
      const data = await res.json();
      onAdd(Task.fromObject(data));
      setTitle("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 my-4">
      <input
        className="border p-2 flex-grow"
        placeholder="Nueva tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="border p-2"
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
      <button type="submit" className="bg-blue-600 text-white px-3 py-2">
        Agregar
      </button>
    </form>
  );
}
