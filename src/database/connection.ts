import { Pool } from "pg";

export const client = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hash-pg",
  password: "docker",
  port: 5432,
});

export const createConnection = async () => {
  await client.connect();

  return client;
};
