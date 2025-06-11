"use client";

import type { Task } from "@/models/Task";
import { averageDuration, percentageCompleted } from "@/utils/taskUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, ListTodo, Timer } from "lucide-react";

interface Props {
  tasks: Task[];
}

export default function Stats({ tasks }: Props) {
  const percent = percentageCompleted(tasks);
  const average = averageDuration(tasks);
  const avgMinutes = Math.round(average / 60000);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;

  const stats = [
    {
      title: "Total de Tareas",
      value: totalTasks,
      icon: ListTodo,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Completadas",
      value: completedTasks,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "En Progreso",
      value: inProgressTasks,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      title: "Promedio",
      value: `${avgMinutes}min`,
      icon: Timer,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {totalTasks > 0 && (
        <Card className="md:col-span-2 lg:col-span-4 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completado</span>
                <span className="text-sm font-bold">{percent.toFixed(0)}%</span>
              </div>
              <Progress value={percent} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedTasks} de {totalTasks} tareas completadas
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
