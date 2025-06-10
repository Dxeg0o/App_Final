export function validateTaskPayload(
  body: any
): asserts body is { title: string; categoryId?: number } {
  if (typeof body.title !== "string" || !body.title.trim()) {
    throw new Error("El título es obligatorio");
  }
  if (body.categoryId !== undefined && typeof body.categoryId !== "number") {
    throw new Error("categoryId debe ser número");
  }
}
