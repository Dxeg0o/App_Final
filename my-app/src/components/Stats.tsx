"use client";

import type { Task } from "@/models/Task";
import { averageDuration } from "@/utils/taskUtils";
import { Card, CardContent } from "@/components/ui/card";
// Cambiar los iconos para ser más tech
import { CheckCircle2, Clock, Activity, Database } from "lucide-react";

interface Props {
  tasks: Task[];
}

export default function Stats({ tasks }: Props) {
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
      icon: Database,
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
            className="bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide truncate">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-white mt-1 truncate">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-r ${stat.bgGradient} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
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
    </div>
  );
}
