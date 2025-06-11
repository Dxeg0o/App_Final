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
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  Trash2,
  Save,
  X,
  Filter,
  ListTodo,
} from "lucide-react";

interface Props {
  tasks: Task[];
  categories: Category[];
  onUpdate: (tasks: Task[]) => void;
}

export default function TaskList({ tasks, categories, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [category, setCategory] = useState<Category | undefined>();

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

  function startEdit(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setStatus(task.status);
    setCategory(task.category);
  }

  async function saveEdit(task: Task) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status, category }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = tasks.map((t) =>
        t.id === task.id ? Task.fromObject(data) : t
      );
      onUpdate(updated);
      setEditingId(null);
    }
  }

  function getStatusIcon(status: TaskStatus) {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  }

  function getStatusBadge(status: TaskStatus) {
    const variants = {
      pending: "secondary",
      "in-progress": "default",
      completed: "default",
    } as const;

    const colors = {
      pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      "in-progress":
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      completed:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    };

    const labels = {
      pending: "Pendiente",
      "in-progress": "En progreso",
      completed: "Completada",
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {labels[status]}
      </Badge>
    );
  }

  function TaskCard({ task }: { task: Task }) {
    const isEditing = editingId === task.id;

    return (
      <Card
        className={`transition-all duration-200 hover:shadow-md ${
          task.status === "completed" ? "opacity-75" : ""
        }`}
      >
        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
              />
              <div className="flex gap-2">
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as TaskStatus)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
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
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin categoría</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => saveEdit(task)}
                  size="sm"
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">{getStatusIcon(task.status)}</div>
                <div className="flex-1 space-y-2">
                  <h3
                    className={`font-medium ${
                      task.status === "completed"
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    {task.category && (
                      <Badge variant="outline" className="text-xs">
                        {task.category.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {task.status !== "completed" && (
                  <Button
                    onClick={() => handleComplete(task)}
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => startEdit(task)}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(task.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
      <Card className="text-center py-12">
        <CardContent>
          <ListTodo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay tareas</h3>
          <p className="text-muted-foreground">
            Comienza agregando tu primera tarea
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Mis Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas ({tasks.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                En progreso ({inProgressTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
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
    </div>
  );
}
