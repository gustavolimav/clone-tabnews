import database from "infra/database.js"
import orchestrator from "../orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await database.query("drop schema public cascade; create schema public;")
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST'
  });

  expect(response1.status).toBe(201);

  const responseBody1 = await response1.json();

  expect(Array.isArray(responseBody1)).toBe(true);
  expect(responseBody1.length).toBeGreaterThan(0);

  for (let i = 0; i < responseBody1.length; i++) {
    expect(Object.keys(responseBody1[i])).toStrictEqual(
      ["path", "name", "timestamp"]
    );
  }

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST'
  });

  expect(response2.status).toBe(200);

  const responseBody2 = await response2.json();

  expect(responseBody2.length).toBe(0);
});