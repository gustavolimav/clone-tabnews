import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("DELETE /status", () => {
  describe("Anonymous User", () => {
    test("Attempting to use DELETE method", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "DELETE",
      });

      expect(response.status).toBe(405);
    });
  });
});
