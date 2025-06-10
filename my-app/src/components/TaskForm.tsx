"use client";
import { useState } from "react";
import { createTask } from "@/utils/taskUtils";
import { Category } from "@/models/Task";

interface Props {
  categories: Category[];
  onAdd: (task: ReturnType<typeof createTask>) => void;
}

export default function TaskForm({ categories, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | undefined>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim() === "") return;
    const task = createTask(title, "pending", category);
    onAdd(task);
    setTitle("");
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
