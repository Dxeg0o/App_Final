"use client";
import { useState } from "react";
import type { Task, Category } from "@/models/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Clock,
  Plus,
} from "lucide-react";
import TaskForm from "./TaskForm";

interface Props {
  tasks: Task[];
  categories: Category[];
  onUpdate: (tasks: Task[]) => void;
  onAdd: (task: Task) => void;
}

export default function Calendar({ tasks, categories, onAdd }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Filtrar tareas que tienen fecha límite
  const tasksWithDueDate = tasks.filter((task) => task.dueDate);

  // Obtener tareas para una fecha específica
  const getTasksForDate = (date: Date) => {
    return tasksWithDueDate.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Generar días del mes
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj));
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowTaskForm(true);
  };

  const handleAddTask = (task: Task) => {
    onAdd(task);
    setShowTaskForm(false);
    setSelectedDate(null);
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-400" />
              Calendario de Tareas
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-gray-400 border-b border-white/10"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border border-slate-700/30 cursor-pointer transition-all duration-200
                    ${
                      isCurrentMonthDay
                        ? "bg-white/5 hover:bg-white/10"
                        : "bg-white/2 opacity-50"
                    }
                    ${isTodayDate ? "bg-teal-500/20 border-teal-500/40" : ""}
                    hover:border-indigo-500/30
                  `}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex flex-col h-full">
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isTodayDate
                          ? "text-cyan-300"
                          : isCurrentMonthDay
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    {/* Tasks for this date */}
                    <div className="flex-1 space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded truncate ${
                            task.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : task.status === "in-progress"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-400 text-center">
                          +{dayTasks.length - 3} más
                        </div>
                      )}
                    </div>

                    {/* Add task button for empty days */}
                    {dayTasks.length === 0 && isCurrentMonthDay && (
                      <div className="flex justify-center mt-2">
                        <Plus className="w-4 h-4 text-gray-500 hover:text-purple-400 transition-colors" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Task Details for Selected Date */}
      {selectedDate && !showTaskForm && (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Tareas para{" "}
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Tarea
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const dayTasks = getTasksForDate(selectedDate);
              if (dayTasks.length === 0) {
                return (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      No hay tareas programadas para este día
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            task.status === "completed"
                              ? "line-through text-gray-400"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={
                              task.status === "completed"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : task.status === "in-progress"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                            }
                          >
                            {task.status === "completed"
                              ? "Completada"
                              : task.status === "in-progress"
                              ? "En progreso"
                              : "Pendiente"}
                          </Badge>
                          {task.category && (
                            <Badge
                              variant="outline"
                              className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                            >
                              {task.category.name}
                            </Badge>
                          )}
                          {task.dueDate && (
                            <span className="text-xs text-gray-400">
                              {new Date(task.dueDate).toLocaleTimeString(
                                "es-ES",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Task Form Modal */}
      {showTaskForm && selectedDate && (
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>
                Nueva Tarea para {selectedDate.toLocaleDateString("es-ES")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTaskForm(false);
                  setSelectedDate(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              categories={categories}
              onAdd={handleAddTask}
              onCancel={() => {
                setShowTaskForm(false);
                setSelectedDate(null);
              }}
              defaultDate={selectedDate}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
