import { Client } from "pg";

async function query(queryText, values) {
  let client;

  try {
    client = await getNewClient();

    let result;

    if (values === undefined) {
      result = await client.query(queryText);
    } else {
      result = await client.query(queryText, values);
    }

    return result;
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();

  return client;
}

function getSSLValues() {
  return process.env.NODE_ENV === "production" ? true : false;
}

const database = {
  query,
  getNewClient,
};

export default database;
