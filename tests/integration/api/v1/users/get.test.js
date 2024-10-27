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
  const deleteUserQuery = `
    DELETE FROM users WHERE id = $1;
  `;

  await database.query(deleteUserQuery, [testUserId]);
});

describe("Users API", () => {
  describe("GET /users", () => {
    test("Retrieving all users", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users");

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody.users)).toBe(true);

      const user = responseBody.users[0];

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("createdAt");
      expect(user).toHaveProperty("updatedAt");
    });
  });
});
