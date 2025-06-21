"use client";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Stats from "@/components/Stats";
import Calendar from "@/components/Calendar";
import { Category, Task } from "@/models/Task";
import { useEffect, useState } from "react";
import { Cpu, CalendarIcon, TrendingUp, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { percentageCompleted } from "@/utils/taskUtils";

export default function DashboardClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories] = useState<Category[]>([
    new Category(1, "Desarrollo"),
    new Category(2, "Análisis"),
  ]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data: Record<string, unknown>[]) =>
        setTasks(data.map((d) => Task.fromObject(d)))
      );
  }, []);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercent = percentageCompleted(tasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Tech Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Tech Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Circuit Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Tech Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-teal-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-indigo-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce delay-1500"></div>

        {/* Data Stream Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-teal-500/15 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/15 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Tech Header */}
        <header className="border-b border-slate-700/50 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 via-teal-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-teal-300 to-violet-300 bg-clip-text text-transparent">
                    TaskFlow AI
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Sistema inteligente de gestión de tareas
                  </p>
                </div>
              </div>

              {/* Análisis de Rendimiento */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">
                      Análisis de Rendimiento
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {totalTasks > 0
                      ? `${completedTasks} de ${totalTasks} tareas completadas`
                      : "Listo para procesar tareas"}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    {totalTasks > 0 ? `${progressPercent.toFixed(0)}%` : "0%"}
                  </div>
                  <div className="w-32 relative">
                    <Progress
                      value={totalTasks > 0 ? progressPercent : 0}
                      className="h-2 bg-slate-700/50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-sm"></div>
                  </div>
                  {totalTasks > 0 && progressPercent > 0 && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="font-medium">¡Sigue así!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-600/30 mb-8">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                Calendario
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Panel - Analytics & Input */}
                <div className="xl:col-span-1 space-y-8">
                  <Stats tasks={tasks} />
                  <TaskForm
                    categories={categories}
                    onAdd={(t) => setTasks([...tasks, t])}
                  />
                </div>

                {/* Right Panel - Task Management */}
                <div className="xl:col-span-2">
                  <TaskList
                    tasks={tasks}
                    categories={categories}
                    onUpdate={setTasks}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <Calendar
                tasks={tasks}
                categories={categories}
                onUpdate={setTasks}
                onAdd={(t) => setTasks([...tasks, t])}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
