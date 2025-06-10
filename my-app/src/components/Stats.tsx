"use client";

import { Task } from "@/models/Task";
import { averageDuration, percentageCompleted } from "@/utils/taskUtils";

interface Props {
  tasks: Task[];
}

export default function Stats({ tasks }: Props) {
  const percent = percentageCompleted(tasks).toFixed(0);
  const average = averageDuration(tasks);
  const avgMinutes = Math.round(average / 60000);

  return (
    <div className="mt-4 text-sm">
      <p>Porcentaje completado: {percent}%</p>
      <p>Promedio de duración: {avgMinutes} minutos</p>
    </div>
  );
}
