import orchestrator from "tests/orchestrator.js";
import session from "models/session.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/sessions", () => {
  describe("Default user", () => {
    test("With nonexistent sessions", async () => {
      const nonExistentToken = "random";

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${nonExistentToken}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "A sessão informada é inválida.",
        action: "Faça login novamente.",
        status: 401,
      });
    });

    test("With expired session", async () => {
      jest.useFakeTimers();

      jest.setSystemTime(
        new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
      );

      const createdUser = await orchestrator.createUser({
        username: "UserWithExpiredSession",
      });

      const expiredSessionObject = await orchestrator.createSession(
        createdUser.id,
      );

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${expiredSessionObject.token}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "A sessão informada é inválida.",
        action: "Faça login novamente.",
        status: 401,
      });
    });

    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "DELETE",
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(204);
      expect(response.body).toBeNull();
    });
  });
});
