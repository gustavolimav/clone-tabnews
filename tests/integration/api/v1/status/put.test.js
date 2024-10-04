import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("PUT /status", () => {
  describe("Anonymous User", () => {
    test("Attempting to use PUT method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "PUT",
      });

      expect(response.status).toBe(405);
    });
  });
});
