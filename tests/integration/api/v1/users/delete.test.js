import orchestrator from "../../../utils/orchestrator";
import database from "../../../../../infra/database.js";

let testUserId;

beforeAll(async () => {
  await orchestrator.waitForAllServices();

  const result = await database.query(
    "INSERT INTO users (username, email, password_hash, created_at, updated_at) VALUES('testuser', 'testuser@example.com', 'hashedPassword123', NOW(), NOW()) RETURNING id;",
  );

  testUserId = result.rows[0].id;
});

afterAll(async () => {
  await database.query(`DELETE FROM users WHERE id = $1;`, [testUserId]);
});

describe("Users API", () => {
  describe("DELETE /users", () => {
    test("Deleting a user", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testUserId }),
      });
      expect(response1.status).toBe(200);

      const responseBody = await response1.json();
      expect(responseBody.message).toBe("User deleted successfully");

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testUserId }),
      });

      expect(response2.status).toBe(404);
    });
  });
});
