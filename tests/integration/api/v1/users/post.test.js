import orchestrator from "../../../utils/orchestrator";
import database from "../../../../../infra/database.js";

let testUserId;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

afterAll(async () => {
  const deleteUserQuery = `
    DELETE FROM users WHERE id = $1;
  `;

  await database.query(deleteUserQuery, [testUserId]);
});

describe("Users API", () => {
  describe("POST /users", () => {
    test("Creating a new user", async () => {
      const newUser = {
        username: "testuser",
        email: "testuser@example.com",
        passwordHash: "hashedPassword123",
      };

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody.user).toHaveProperty("id");
      expect(responseBody.user.username).toBe(newUser.username);
      expect(responseBody.user.email).toBe(newUser.email);

      testUserId = responseBody.user.id;
    });
  });
});
