import { Buffer } from "node:buffer";
import { randomBytes as uuid } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { RepositoryHash } from "../../repository/implementations/repository-hash";

const repositoryHash = new RepositoryHash();

const LIMIT_HASH = 12; //
const HASH_SIZE = 6; //limit 6^64

let count = 0;
let hash = "";

const controller = new AbortController();

function generateRandomHash(): string {
  const base64 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  const randomBytes = uuid(HASH_SIZE);
  for (let i = 0; i < HASH_SIZE; i++) {
    hash += base64.charAt(randomBytes[i] % base64.length);
  }

  return hash;
}

async function* customReadable(): AsyncGenerator<Buffer> {
  while (count < LIMIT_HASH) {
    yield Buffer.from(generateRandomHash());
    hash = "";
  }
}

async function* customTransform(stream: any): AsyncGenerator<any> {
  for await (const chunk of stream) {
    try {
      const res = await repositoryHash.createHash(
        chunk.toString(),
        true,
        LIMIT_HASH
      );

      console.log(res);
      if (!res) yield controller.abort();
      yield chunk.toString() + "\n";

      count++;
      // yield controller.abort(); //simular erro
    } catch (error) {
      console.error("[myCustomTransform] Error ao processar chunk:", error);
      continue;
    }
  }
}

async function* customWritable(stream: any): any {
  for await (const chunk of stream) {
    try {
      const hash = chunk.toString();
      console.log("[writable]", hash, count);
    } catch (error) {
      console.error("[myCustomWritable] Error ao processar chunk:", error);
      continue;
    }
  }
}

(async () => {
  try {
    await pipeline(customReadable, customTransform, customWritable, {
      signal: controller.signal,
    });
    console.log("Pipeline concluído com sucesso! 🔥🔥🔥🚒🚒.");
  } catch (error) {
    console.log("\n[Error] no processo:", error);
  }
})();
