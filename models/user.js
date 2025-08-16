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

async function findOneByEmail(email) {
  const results = await database.query({
    text: `
        SELECT 
          *
        FROM 
          users
        WHERE 
          LOWER(email) = LOWER($1)
        LIMIT
          1
        ;`,
    values: [email],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "O email informado não foi encontrado no sistema.",
      action: "Verifique se o email está digitado corretamente.",
    });
  }

  return results.rows[0];
}

async function findOneByUsername(username) {
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
      message: "O username informado não foi encontrado no sistema.",
      action: "Verifique se o username está digitado corretamente.",
    });
  }

  return results.rows[0];
}

async function updateByUsername(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("username" in userInputValues) {
    await validateUniqueUserName(userInputValues.username);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userToBeUpdated = {
    ...currentUser,
    ...userInputValues,
  };

  const updatedUser = await runUpdateQuery(userToBeUpdated, username);

  if (updatedUser.rowCount === 0) {
    throw new NotFoundError({
      message: "O username informado não foi encontrado no sistema.",
      action: "Verifique se o username está digitado corretamente.",
    });
  }

  return updatedUser.rows[0];
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
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
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
      action: "Utilize outro username para realizar esta operação.",
      message: "O username informado já está sendo utilizado.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);

  userInputValues.password = hashedPassword;
}

async function runUpdateQuery(userWithNewValeus, username) {
  return await database.query({
    text: `
        UPDATE
          users
        SET
          username = $1,
          password = $2,
          email = $3,
          updated_at = NOW()
        WHERE
          LOWER(username) = LOWER($4)
        RETURNING
          id, username, email, created_at, updated_at
        ;`,
    values: [
      userWithNewValeus.username,
      userWithNewValeus.password,
      userWithNewValeus.email,
      username,
    ],
  });
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
  findOneByUsername,
  findOneByEmail,
  updateByUsername,
};

export default user;
