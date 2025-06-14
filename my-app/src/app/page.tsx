"use client";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Stats from "@/components/Stats";
import Calendar from "@/components/Calendar";
import { Category, Task } from "@/models/Task";
import { useEffect, useState } from "react";
import { Cpu, Activity, Wifi, CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Tech Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Tech Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Circuit Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Tech Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-1500"></div>

        {/* Data Stream Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Tech Header */}
        <header className="border-b border-cyan-500/20 bg-black/30 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-xl shadow-lg shadow-cyan-500/25">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    TaskFlow AI
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Sistema inteligente de gestión de tareas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs font-medium">ONLINE</span>
                </div>
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {tasks.filter((t) => t.status === "completed").length}{" "}
                    Procesadas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 mb-8">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white flex items-center gap-2"
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
