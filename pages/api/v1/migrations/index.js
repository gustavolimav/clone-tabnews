import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import handleRequest from "utils/allowedMethodHandler.js";

const allowedMethods = ["GET", "POST"];

const methodHandlers = {
  GET: (request, response) => {
    return getMigrations(response);
  },
  POST: (request, response) => {
    return postMigrations(response);
  },
};

export default async function migrations(request, response) {
  return handleRequest(request, response, allowedMethods, methodHandlers);
}

async function postMigrations(response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...{
        dbClient: dbClient,
        dryRun: true,
        dir: resolve("infra", "migrations"),
        direction: "up",
        verbose: true,
        migrationsTable: "pgmigrations",
      },
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function getMigrations(response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    return response.status(200).json(
      await migrationRunner({
        dbClient: dbClient,
        dryRun: true,
        dir: resolve("infra", "migrations"),
        direction: "up",
        verbose: true,
        migrationsTable: "pgmigrations",
      }),
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
