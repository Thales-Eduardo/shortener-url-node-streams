import request from "supertest";
import { v4 as uuid } from "uuid";

import { client } from "../database/connection";
import { app, server } from "../index";

describe("E2E", () => {
  afterAll(() => {
    server.close();
  });

  it("encurtar a url", async () => {
    const tempClient = await client.connect();
    try {
      const response = await request(app).post("/shorten_url").send({
        user_id: uuid(),
        original_url: "google.com",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("url");
    } finally {
      tempClient.release();
    }
  });

  // it("", async () => {}
});
