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
    <div className="mt-4 text-sm space-y-2">
      <div>
        <div className="flex justify-between mb-1">
          <span>Completado</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <p>Promedio de duración: {avgMinutes} minutos</p>
    </div>
  );
}
