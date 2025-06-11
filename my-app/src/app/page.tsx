"use client";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Stats from "@/components/Stats";
import { Category, Task } from "@/models/Task";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories] = useState<Category[]>([
    new Category(1, "Trabajo"),
    new Category(2, "Personal"),
  ]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data: Record<string, unknown>[]) =>
        setTasks(data.map((d) => Task.fromObject(d)))
      );
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Administrador de Tareas</h1>
      <TaskForm
        categories={categories}
        onAdd={(t) => setTasks([...tasks, t])}
      />
      <TaskList tasks={tasks} categories={categories} onUpdate={setTasks} />
      <Stats tasks={tasks} />
    </main>
  );
}
