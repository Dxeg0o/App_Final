import type { NextApiRequest, NextApiResponse } from "next";
import * as db from "@/utils/db";
import { validateTaskPayload } from "@/utils/validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return res.status(200).json(await db.getTasks());
      case "POST":
        validateTaskPayload(req.body);
        return res.status(201).json(await db.createTask(req.body));
      case "PUT":
        validateTaskPayload(req.body);
        await db.updateTask(req.body.id, req.body);
        return res.status(200).end();
      case "DELETE":
        await db.deleteTask(req.query.id as string);
        return res.status(200).end();
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end();
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
