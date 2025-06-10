import { MongoClient, Db, Collection } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connect() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(process.env.DB_NAME!);
  return cachedDb;
}

// Procedural: todas son funciones sueltas
export async function getTasks() {
  const db = await connect();
  return await db.collection("tasks").find().toArray();
}

export async function getTaskById(id: string) {
  const db = await connect();
  return await db.collection("tasks").findOne({ _id: new ObjectId(id) });
}

export async function createTask(data: { title: string; categoryId: number }) {
  const db = await connect();
  const now = new Date().toISOString();
  const result = await db.collection("tasks").insertOne({
    ...data,
    status: "pending",
    startDate: now,
    endDate: null,
  });
  return result.ops[0];
}

export async function updateTask(
  id: string,
  updates: Partial<{ title: string; status: string; endDate: string }>
) {
  const db = await connect();
  await db
    .collection("tasks")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
}

export async function deleteTask(id: string) {
  const db = await connect();
  await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
}
