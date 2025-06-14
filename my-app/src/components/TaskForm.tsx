"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { type Category, Task } from "@/models/Task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Zap } from "lucide-react";

interface Props {
  categories: Category[];
  onAdd: (task: Task) => void;
  onCancel?: () => void;
  defaultDate?: Date;
}

export default function TaskForm({
  categories,
  onAdd,
  onCancel,
  defaultDate,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Set default date if provided
  useEffect(() => {
    if (defaultDate) {
      const date = new Date(defaultDate);
      date.setHours(12, 0, 0, 0); // Set to noon by default
      setDueDate(date.toISOString().slice(0, 16));
    }
  }, [defaultDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim() === "") return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status: "pending",
          category,
          description,
          dueDate: dueDate || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onAdd(Task.fromObject(data));
        setTitle("");
        setDescription("");
        setDueDate("");
        setCategory(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-black/30 backdrop-blur-xl border-slate-700/30 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <Zap className="w-4 h-4 text-teal-400" />
          {defaultDate
            ? `Nueva Tarea - ${defaultDate.toLocaleDateString("es-ES")}`
            : "Nueva Tarea"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300 font-medium">
              Título de la tarea
            </Label>
            <Input
              id="title"
              placeholder="Define tu próxima tarea..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-slate-600/50 text-white placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300 font-medium">
              Descripción
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-slate-600/50 rounded-md p-3 text-white placeholder:text-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all duration-200 resize-none"
              rows={3}
              placeholder="Especifica los detalles técnicos..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300 font-medium">
                Categoría
              </Label>
              <Select
                value={category?.id.toString() ?? ""}
                onValueChange={(value) => {
                  if (value === "") {
                    setCategory(undefined);
                  } else {
                    const id = Number.parseInt(value);
                    const cat = categories.find((c) => c.id === id);
                    setCategory(cat);
                  }
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-400">
                  <SelectValue placeholder="Selecciona una categoría" />
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

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-gray-300 font-medium">
                Fecha límite
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isLoading ? "Procesando..." : "Crear Tarea"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-white/20 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
