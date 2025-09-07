import database from "infra/database.js";
import crypto from "crypto";
import { UnauthorizedError } from "infra/errors.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 days

async function findOneValidByToken(token) {
  const results = await database.query({
    text: `
        SELECT
         *
        FROM
          sessions
        WHERE
          token = $1
          AND expires_at > NOW()
        LIMIT
        1
        ;`,
    values: [token],
  });

  console.log(results.rows);

  if (results.rowCount === 0) {
    throw new UnauthorizedError({
      message: "A sessão informada é inválida.",
      action: "Faça login novamente.",
    });
  }

  return results.rows[0];
}

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);

  return newSession;
}

async function runInsertQuery(token, userId, expiresAt) {
  const results = await database.query({
    text: `
        INSERT INTO 
          sessions (token, user_id, expires_at)
        VALUES 
          ($1, $2, $3)
        RETURNING
          id, token, user_id, expires_at, created_at, updated_at
        ;`,
    values: [token, userId, expiresAt],
  });

  return results.rows[0];
}

const session = {
  create,
  EXPIRATION_IN_MILLISECONDS,
  findOneValidByToken,
};

export default session;
