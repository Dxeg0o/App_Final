"use client";
import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface Props {
  categories: Category[];
  onAdd: (task: Task) => void;
  onCancel?: () => void;
}

export default function TaskForm({ categories, onAdd, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim() === "") return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: "pending", category }),
      });
      if (res.ok) {
        const data = await res.json();
        onAdd(Task.fromObject(data));
        setTitle("");
        setCategory(undefined);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la tarea</Label>
            <Input
              id="title"
              placeholder="Escribe el título de tu tarea..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
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

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="flex-1 gap-2"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? "Agregando..." : "Agregar Tarea"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
