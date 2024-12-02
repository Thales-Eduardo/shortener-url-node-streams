import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createConnection } from "./connection";

(async () => {
  const client = await createConnection();
  const fileDatabaseDir = path.join(__dirname, "migrations");
  console.log(new Date(), "Start migrations 🔥");
  try {
    const files = await readdir(fileDatabaseDir);

    for (const file of files) {
      const content = await readFile(path.join(fileDatabaseDir, file), "utf-8");
      console.log(`Running migration: ${file}`);
      await client.query(content);
    }
    console.log(new Date(), "Completed migrations 🆗");
  } catch (error) {
    console.error("Erro ao executar migrações:", error);
  }
})();
