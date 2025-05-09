import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Running as anonymous user", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
        values: ["testuser", "password123", "email@gmail.com"],
      });

      await database.query({
        text: "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
        values: ["testuser2", "password123", "Email@gmail.com"],
      });

      const users = await database.query("SELECT * FROM users");

      console.log("Users before:", users.rows);

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });

      expect(response.status).toBe(201);
    });
  });
});
