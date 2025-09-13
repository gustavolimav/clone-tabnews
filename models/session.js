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
          AND expires_at > timezone('utc', now())
        LIMIT
        1
        ;`,
    values: [token],
  });

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

async function expireById(sessionId) {
  const results = await database.query({
    text: `
        UPDATE 
          sessions
        SET
          updated_at = timezone('utc', now()),
          expires_at = timezone('utc', now()) - interval '1 year'
        WHERE
          id = $1
        ;`,
    values: [sessionId],
  });

  if (results.rowCount === 0) {
    throw new UnauthorizedError({
      message: "A sessão informada é inválida.",
      action: "Faça login novamente.",
    });
  }
}

async function renew(sessionId) {
  const newExpiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const results = await database.query({
    text: `
        UPDATE 
          sessions
        SET
          expires_at = $1,
          updated_at = timezone('utc', now())
        WHERE
          id = $2
        RETURNING
          id, token, user_id, expires_at, created_at, updated_at
        ;`,
    values: [newExpiresAt, sessionId],
  });

  if (results.rowCount === 0) {
    throw new UnauthorizedError({
      message: "A sessão informada é inválida.",
      action: "Faça login novamente.",
    });
  }

  return results.rows[0];
}

const session = {
  create,
  EXPIRATION_IN_MILLISECONDS,
  findOneValidByToken,
  renew,
  expireById,
};

export default session;
