import database from "infra/database";

export default class DatabaseModel {
  constructor() {
    this.version = null;
    this.maxConnections = null;
    this.openedConnections = null;
  }

  toJSON() {
    return {
      version: this.version,
      max_connections: this.maxConnections,
      opened_connections: this.openedConnections,
    };
  }

  async initialize() {
    this.version = await this.getDatabaseVersion();
    this.maxConnections = await this.getDatabaseMaxConnections();
    this.openedConnections = await this.getDatabaseOpenedConnections();
  }

  async getDatabaseMaxConnections() {
    const result = await database.query("SHOW max_connections;");

    return parseInt(result.rows[0].max_connections);
  }

  async getDatabaseOpenedConnections() {
    const databaseOpenedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [process.env.POSTGRES_DB],
    });

    return databaseOpenedConnectionsResult.rows[0].count;
  }

  async getDatabaseVersion() {
    const databaseVersionResult = await database.query("SHOW server_version;");

    return databaseVersionResult.rows[0].server_version;
  }
}
