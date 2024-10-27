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
  describe("PUT /users", () => {
    test("Updating an existing user", async () => {
      const updatedUserData = {
        id: testUserId,
        username: "updatedUser",
        email: "updateduser@example.com",
      };

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData),
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const user = responseBody.user;

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("createdAt");
      expect(user).toHaveProperty("updatedAt");
      expect(user).toHaveProperty("id", testUserId);
      expect(user.username).toBe(updatedUserData.username);
      expect(user.email).toBe(updatedUserData.email);
    });
  });
});
