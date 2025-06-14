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
    <Card className="bg-gradient-to-br from-indigo-900/40 via-black/30 to-teal-900/40 backdrop-blur-xl border-indigo-500/30 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 ring-1 ring-indigo-500/10">
      <CardHeader className="pb-4 border-b border-indigo-500/20">
        <CardTitle className="flex items-center gap-2 text-white text-lg font-semibold">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
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

          <div className="grid grid-cols-1 gap-4">
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
                <SelectTrigger className="bg-white/5 border-slate-600/50 text-white focus:border-indigo-400 focus:ring-indigo-400/20">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600/50">
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
                className="bg-white/5 border-slate-600/50 text-white focus:border-indigo-400 focus:ring-indigo-400/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:via-purple-700 hover:to-teal-700 text-white font-semibold shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 ring-2 ring-indigo-500/20 hover:ring-indigo-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
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
