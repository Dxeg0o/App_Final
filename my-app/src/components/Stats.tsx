"use client";

import type { Task } from "@/models/Task";
import { averageDuration, percentageCompleted } from "@/utils/taskUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// Cambiar los iconos para ser más tech
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Activity,
  TrendingUp,
} from "lucide-react";

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

  // Actualizar los stats con iconos más tech
  const stats = [
    {
      title: "Total",
      value: totalTasks,
      icon: BarChart3,
      gradient: "from-indigo-400 to-teal-400",
      bgGradient: "from-indigo-500/15 to-teal-500/15",
    },
    {
      title: "Completadas",
      value: completedTasks,
      icon: CheckCircle2,
      gradient: "from-emerald-400 to-green-400",
      bgGradient: "from-emerald-500/15 to-green-500/15",
    },
    {
      title: "En Proceso",
      value: inProgressTasks,
      icon: Activity,
      gradient: "from-amber-400 to-orange-400",
      bgGradient: "from-amber-500/15 to-orange-500/15",
    },
    {
      title: "Tiempo Prom.",
      value: `${avgMinutes}min`,
      icon: Clock,
      gradient: "from-violet-400 to-purple-400",
      bgGradient: "from-violet-500/15 to-purple-500/15",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide truncate">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-white mt-1 truncate">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-r ${stat.bgGradient} group-hover:scale-110 transition-transform duration-200 flex-shrink-0 ml-2`}
                >
                  <stat.icon
                    className={`w-4 h-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Card */}
      {totalTasks > 0 && (
        <Card className="bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white text-base">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Análisis de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">
                Completado
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                {percent.toFixed(0)}%
              </span>
            </div>
            <div className="relative">
              <Progress value={percent} className="h-2 bg-white/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-sm"></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">
                {completedTasks} de {totalTasks} tareas completadas
              </span>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span className="font-medium">¡Sigue así!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
