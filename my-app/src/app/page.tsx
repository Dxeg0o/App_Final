"use client";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Stats from "@/components/Stats";
import { Category, Task } from "@/models/Task";
import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories] = useState<Category[]>([
    new Category(1, "Trabajo"),
    new Category(2, "Personal"),
  ]);

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Administrador de Tareas</h1>
      <TaskForm
        categories={categories}
        onAdd={(t) => setTasks([...tasks, t])}
      />
      <TaskList tasks={tasks} onUpdate={setTasks} />
      <Stats tasks={tasks} />
    </main>
  );
}
