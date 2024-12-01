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

app.listen(port, () => {
  console.log(`http://localhost:${port} 🔥🔥🚒`);
});
