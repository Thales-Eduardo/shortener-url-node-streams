import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import "express-async-errors";
import { router } from "./routes";

import "./database/run-migrations";
const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
app.use(router);

const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  if (err instanceof Error) {
    return res.json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`http://localhost:${port} 🔥🔥🚒`);
});

// ---- Graceful Shutdown
function gracefulShutdown(event: any) {
  const data = new Date().toLocaleString();
  return (code: any) => {
    console.log(`${event} - server ending ${code}`, data);
    server.close(async () => {
      process.exit(0);
    });
  };
}

//disparado no ctrl+c => multiplataforma
process.on("SIGINT", gracefulShutdown("SIGINT"));
//Para aguardar as conexões serem encerradas para só então encerrar a aplicação.
process.on("SIGTERM", gracefulShutdown("SIGTERM"));

// captura erros não tratados
process.on("uncaughtException", (error, origin) => {
  console.log(`${origin} uncaughtException -  signal received ${error}`);
});
process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection - signal received ${error}`);
});

process.on("exit", (code) => {
  console.log(`exit signal received ${code}`);
});

// // simular um erro
// setTimeout(() => {
//   process.exit(1);
// }, Math.random() * 1e4); // 10.000
