import Task, { TaskProps } from "@/models/Task";
import { readJson, validateTaskPayload, writeJson } from "@/utils/procedural";
import type { NextApiRequest, NextApiResponse } from "next";

const FILENAME = "tasks.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Leer y mapear datos
  const raw = readJson<TaskProps[]>(FILENAME);
  let tasks = raw.map((data) => new Task(data));

  try {
    switch (req.method) {
      case "GET":
        return res.status(200).json(tasks);
      case "POST": {
        validateTaskPayload(req.body);
        const nextId = Date.now();
        const newTask = new Task({ id: nextId, ...req.body });
        tasks.push(newTask);
        writeJson(FILENAME, tasks);
        return res.status(201).json(newTask);
      }
      case "PUT": {
        validateTaskPayload(req.body);
        tasks = tasks.map((t) => {
          if (t.id === req.body.id) {
            t.update(req.body);
          }
          return t;
        });
        writeJson(FILENAME, tasks);
        return res.status(200).json({ success: true });
      }
      case "DELETE": {
        const id = Number(req.query.id);
        tasks = tasks.filter((t) => t.id !== id);
        writeJson(FILENAME, tasks);
        return res.status(200).json({ success: true });
      }
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(400).json({ error: "Error desconocido" });
  }
}
