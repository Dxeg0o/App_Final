import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';

async function getCollection() {
  const client = await clientPromise;
  return client.db().collection('users');
}

export async function findUser(username: string) {
  const col = await getCollection();
  return col.findOne({ username });
}

export async function createUser(username: string, password: string) {
  const col = await getCollection();
  const hash = await bcrypt.hash(password, 10);
  await col.insertOne({ username, password: hash });
  return { username };
}

type UserDoc = {
  username: string;
  password: string;
};

export async function validateUser(username: string, password: string) {
  const user = (await findUser(username)) as UserDoc | null;
  if (!user) return false;
  const match = await bcrypt.compare(password, user.password);
  return match ? { username: user.username } : false;
}
