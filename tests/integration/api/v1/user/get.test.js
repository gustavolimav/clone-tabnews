import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import session from "models/session.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const username = "UserWithValidSession";

      const createdUser = await orchestrator.createUser({
        username: username,
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: username,
        email: createdUser.email,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With invalid session", async () => {
      const nonExistentSessionToken = "nonexistentsessiontoken";

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${nonExistentSessionToken}`,
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

      const response = await fetch("http://localhost:3000/api/v1/user", {
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

      jest.useRealTimers();
    });
  });
});
