import { useState, useEffect } from "react";
import Task, { Status } from "../models/Task";
import {
  filterByStatus,
  completionRate,
  averageDuration,
} from "../utils/functional";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((data: Task[]) => setTasks(data));
  }, []);

  const filtered =
    statusFilter === "all" ? tasks : filterByStatus(tasks, statusFilter);

  return (
    <div>
      <h2>Mis Tareas</h2>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
      >
        <option value="all">Todas</option>
        <option value="pending">Pendiente</option>
        <option value="in-progress">En Progreso</option>
        <option value="completed">Completadas</option>
      </select>

      <ul>
        {filtered.map((t) => (
          <li key={t.id}>
            {t.title} – <strong>{t.status}</strong>
          </li>
        ))}
      </ul>

      <div>
        <p>Completadas: {completionRate(tasks).toFixed(1)}%</p>
        <p>
          Duración promedio: {(averageDuration(tasks) / 1000 / 60).toFixed(1)}{" "}
          minutos
        </p>
      </div>
    </div>
  );
}
