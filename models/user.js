import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors.js";
import password from "models/password";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUserName(userInputValues.username);

  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);

  return newUser;
}

async function findOneByUsername(username) {
  if (!username || typeof username !== "string" || username.trim() === "") {
    throw new ValidationError({
      message: "Invalid username",
      action: "Provide a valid username",
    });
  }

  const results = await database.query({
    text: `
        SELECT 
          id, username, email, created_at, updated_at, password
        FROM 
          users
        WHERE 
          LOWER(username) = LOWER($1)
        LIMIT
          1
        ;`,
    values: [username],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "O username não foi encontrado",
      action: "Verifique se o username está correto",
    });
  }

  return results.rows[0];
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
        SELECT 
          email
        FROM 
          users
        WHERE 
          LOWER(email) = LOWER($1)
        ;`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Email already in use",
      action: "Use another email address",
    });
  }
}

async function validateUniqueUserName(userName) {
  const results = await database.query({
    text: `
        SELECT 
          username
        FROM 
          users
        WHERE 
          LOWER(username) = LOWER($1)
        ;`,
    values: [userName],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Username already in use",
      action: "Use another username",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);

  userInputValues.password = hashedPassword;
}

async function runInsertQuery(userInputValues) {
  const results = await database.query({
    text: `
        INSERT INTO 
          users (username, password, email) 
        VALUES 
          ($1, $2, $3)
        RETURNING
          id, username, email, created_at, updated_at
        ;`,
    values: [
      userInputValues.username,
      userInputValues.password,
      userInputValues.email,
    ],
  });

  return results.rows[0];
}

const user = {
  create,
  findOneByUsername: findOneByUsername,
};

export default user;
