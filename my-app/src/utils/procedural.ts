import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function readJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeJson<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function validateTaskPayload(
  payload: unknown
): asserts payload is { title: string; categoryId: number } {
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof (payload as { title?: unknown }).title !== "string" ||
    typeof (payload as { categoryId?: unknown }).categoryId !== "number"
  ) {
    throw new Error(
      "Payload inválido: se requiere un título (string) y categoryId (number)"
    );
  }
}
