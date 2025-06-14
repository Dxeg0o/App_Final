"use client";
import { useState } from "react";
import { Task, type TaskStatus, type Category } from "@/models/Task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Cambiar iconos y terminología
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  Trash2,
  Save,
  X,
  BarChart3,
  Cpu,
} from "lucide-react";

interface Props {
  tasks: Task[];
  categories: Category[];
  onUpdate: (tasks: Task[]) => void;
}

export default function TaskList({ tasks, categories, onUpdate }: Props) {
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  async function handleDelete(id: number) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      onUpdate(tasks.filter((t) => t.id !== id));
    }
  }

  async function handleComplete(task: Task) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        status: "completed",
        category: task.category,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = tasks.map((t) =>
        t.id === task.id ? Task.fromObject(data) : t
      );
      onUpdate(updated);
    }
  }

  function getStatusIcon(status: TaskStatus) {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  }

  function getStatusBadge(status: TaskStatus) {
    const styles = {
      pending: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      completed: "bg-green-500/20 text-green-300 border-green-500/30",
    };

    const labels = {
      pending: "Pendiente",
      "in-progress": "En progreso",
      completed: "Completada",
    };

    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  }

  function TaskCard({ task }: { task: Task }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [dueDate, setDueDate] = useState(
      task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
    );
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [category, setCategory] = useState<Category | undefined>(
      task.category
    );

    async function saveEdit() {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status,
          category,
          description,
          dueDate: dueDate || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = tasks.map((t) =>
          t.id === task.id ? Task.fromObject(data) : t
        );
        onUpdate(updated);
        setIsEditing(false);
      }
    }

    return (
      <Card
        className={`bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 group ${
          task.status === "completed" ? "opacity-75" : ""
        }`}
      >
        <CardContent className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                className="bg-white/5 border-white/10 text-white focus:border-purple-400"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white placeholder:text-gray-400 focus:border-purple-400 resize-none"
                rows={3}
              />
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-purple-400"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as TaskStatus)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem
                      value="pending"
                      className="text-white hover:bg-white/10"
                    >
                      Pendiente
                    </SelectItem>
                    <SelectItem
                      value="in-progress"
                      className="text-white hover:bg-white/10"
                    >
                      En progreso
                    </SelectItem>
                    <SelectItem
                      value="completed"
                      className="text-white hover:bg-white/10"
                    >
                      Completada
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={category?.id.toString() ?? "none"}
                  onValueChange={(value) => {
                    if (value === "none") {
                      setCategory(undefined);
                    } else {
                      const id = Number.parseInt(value);
                      const cat = categories.find((c) => c.id === id);
                      setCategory(cat);
                    }
                  }}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem
                      value="none"
                      className="text-white hover:bg-white/10"
                    >
                      Sin categoría
                    </SelectItem>
                    {categories.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id.toString()}
                        className="text-white hover:bg-white/10"
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={saveEdit}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-gray-300 hover:bg-white/5"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1 group-hover:scale-110 transition-transform duration-200">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1 space-y-3">
                  <h3
                    className={`font-semibold text-lg ${
                      task.status === "completed"
                        ? "line-through text-gray-400"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(task.status)}
                    {task.category && (
                      <Badge
                        variant="outline"
                        className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                      >
                        {task.category.name}
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Vence: {new Date(task.dueDate).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {task.status !== "completed" && (
                  <Button
                    onClick={() => handleComplete(task)}
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-200"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(task.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-xl">
        <CardContent className="text-center py-16">
          {/* En el estado vacío, cambiar el mensaje */}
          <Cpu className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-3 text-white">
            Sistema en espera
          </h3>
          <p className="text-gray-400 text-lg">
            Inicializa tu flujo de trabajo agregando la primera tarea
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-xl">
      <CardHeader className="pb-4">
        {/* Cambiar el título de la sección */}
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <BarChart3 className="w-5 h-5 text-teal-400" />
          Dashboard de Tareas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-600/30">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              Todas ({tasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              Pendientes ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              En progreso ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              Completadas ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4 mt-6">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
