import database from "infra/database.js";
import handleRequest from "utils/allowedMethodHandler.js";

const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

const methodHandlers = {
  GET: async (request, response) => {
    return getUsers(response);
  },
  POST: async (request, response) => {
    return createUser(request, response);
  },
  PUT: async (request, response) => {
    return updateUser(request, response);
  },
  DELETE: async (request, response) => {
    return deleteUser(request, response);
  },
};

export default async function handler(request, response) {
  return handleRequest(request, response, allowedMethods, methodHandlers);
}

async function getUsers(response) {
  const result = await database.query(
    "SELECT id, username, email, created_at, updated_at, last_login FROM users ORDER BY created_at DESC;",
  );

  const users = result.rows;

  response.status(200).json({ users });
}

async function createUser(request, response) {
  const { username, email, passwordHash } = request.body;

  if (!username || !email || !passwordHash) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const result = await database.query(
    `INSERT INTO users (username, email, password_hash) 
   VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at, last_login;`,
    [username, email, passwordHash],
  );

  const newUser = result.rows[0];

  response.status(201).json({ user: newUser });
}

async function updateUser(request, response) {
  const { id, username, email } = request.body;

  if (!id || (!username && !email)) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const fieldsToUpdate = [];
  const values = [id];

  if (username) {
    fieldsToUpdate.push("username = $2");
    values.push(username);
  }
  if (email) {
    fieldsToUpdate.push("email = $3");
    values.push(email);
  }

  const result = await database.query(
    `UPDATE users SET ${fieldsToUpdate.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, email, created_at, updated_at, last_login;`,
    values,
  );

  const updatedUser = result.rows[0];
  if (!updatedUser) {
    return response.status(404).json({ error: "User not found" });
  }

  response.status(200).json({ user: updatedUser });
}

async function deleteUser(request, response) {
  const { id } = request.body;

  if (!id) {
    return response.status(400).json({ error: "User ID is required" });
  }

  const result = await database.query(
    `DELETE FROM users WHERE id = $1 RETURNING id;`,
    [id],
  );

  const deletedUser = result.rows[0];

  if (!deletedUser) {
    return response.status(404).json({ error: "User not found" });
  }

  response.status(200).json({ message: "User deleted successfully" });
}
