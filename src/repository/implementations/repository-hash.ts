import { client } from "../../database/connection";

export class RepositoryHash {
  constructor() {}

  async createHash(
    hash: string,
    available: boolean,
    limit_hash: number
  ): Promise<boolean> {
    const clients = await client.connect();
    try {
      await clients.query("BEGIN");

      // Verificar limite de hashes
      const result = await clients.query(
        "SELECT COUNT(*) >= $1 AS exceeded FROM hashes",
        [limit_hash]
      );

      if (result.rows[0].exceeded) {
        return false;
      }

      // Verificar se a hash já existe
      const checkResult = await clients.query(
        "SELECT EXISTS (SELECT 1 FROM hashes WHERE hash = $1) AS exists",
        [hash]
      );

      if (checkResult.rows[0].exists) {
        console.log("Hash já existe");
        return false;
      }

      // Inserir nova hash
      await clients.query(
        "INSERT INTO hashes (hash, available, created_at) VALUES ($1, $2, NOW())",
        [hash, available]
      );

      await clients.query("COMMIT");
      console.log("Hash inserida com sucesso");

      return true;
    } catch (err) {
      await clients.query("ROLLBACK");
      console.error("Erro durante a operação:", err);
      return false;
    } finally {
      clients.release(); // Libera a conexão para o pool
    }
  }

  async createUserUrl(
    user_id: string,
    url_original: string
  ): Promise<string | undefined> {
    const clients = await client.connect();
    try {
      await clients.query("BEGIN");

      // Executa a query
      const result = await client.query(`
        WITH selected_hash AS (
          SELECT hash
          FROM hashes
          WHERE available = TRUE
          ORDER BY created_at ASC
          LIMIT 1
          FOR UPDATE SKIP LOCKED
        )
        UPDATE hashes
        SET available = FALSE
        WHERE hash = (SELECT hash FROM selected_hash)
        RETURNING hash;
      `);

      let hash = "";

      if (result.rows.length > 0) {
        hash = result.rows[0].hash;
        await client.query(
          "INSERT INTO hashuser (hash, user_id, url_original) VALUES ($1, $2, $3)",
          [hash, user_id, url_original]
        );
      }

      await clients.query("COMMIT");

      return hash;
    } catch (err) {
      await clients.query("ROLLBACK");
      console.error("Erro ao obter hash:", err);
    } finally {
      clients.release();
    }
  }

  async seandByHash(hash: string): Promise<any> {
    const clients = await client.connect();
    try {
      const result = await clients.query(
        "SELECT hash FROM HASHUSER WHERE hash = $1;",
        [hash]
      );

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return {
          hash: row.hash,
          userId: row.user_id,
          urlOriginal: row.url_original,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }

      return null;
    } catch (err) {
      console.error("Erro ao buscar hash com detalhes:", err);
      return null;
    } finally {
      clients.release();
    }
  }
}
