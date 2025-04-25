import database from "infra/database.js";
import controller from "infra/controller.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseOpenedConnections = await getDatabaseOpenedConnections();
  const databaseMaxConnections = await getDatabaseMaxConnections();
  const databaseVersion = await getDatabaseVersion();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: databaseMaxConnections,
        opened_connections: databaseOpenedConnections,
      },
    },
  });
}

async function getDatabaseMaxConnections() {
  const result = await database.query("SHOW max_connections;");

  return parseInt(result.rows[0].max_connections);
}

async function getDatabaseOpenedConnections() {
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  return databaseOpenedConnectionsResult.rows[0].count;
}

async function getDatabaseVersion() {
  const databaseVersionResult = await database.query("SHOW server_version;");

  return databaseVersionResult.rows[0].server_version;
}
