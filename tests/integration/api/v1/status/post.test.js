import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /status", () => {
  describe("Anonymous User", () => {
    test("Attempting to use POST method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });

      expect(response.status).toBe(405);
    });
  });
});
