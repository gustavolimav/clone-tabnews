import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
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

async function getHandler(request, response) {
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
  } finally {
    await dbClient.end();
  }
}
