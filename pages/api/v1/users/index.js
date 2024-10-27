import handleRequest from "utils/allowedMethodHandler.js";
import UserModel from "models/userModel";
import isFeatureEnabled from "utils/featureFlagUtil";

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

export default async function users(request, response) {
  if (!isFeatureEnabled("FEATURE_FLAG_USERS")) {
    return response.status(403).json({ message: "Feature not available" });
  }

  return handleRequest(request, response, allowedMethods, methodHandlers);
}

async function getUsers(response) {
  const allUsers = await UserModel.getAll();

  response.status(200).json({ users: allUsers.map((user) => user.toJSON()) });
}

async function createUser(request, response) {
  const { username, email, passwordHash } = request.body;

  if (!username || !email || !passwordHash) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const newUser = await UserModel.create({
    username: username,
    email: email,
    passwordHash: passwordHash,
  });

  response.status(201).json({ user: newUser.toJSON() });
}

async function updateUser(request, response) {
  const { id, username, email, passwordHash } = request.body;

  if (!id && !username && !email && !passwordHash) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  const updatedUser = await UserModel.update(id, {
    username,
    email,
    passwordHash,
  });

  if (!updatedUser) {
    return response.status(404).json({ error: "User not found" });
  }

  response.status(200).json({ user: updatedUser.toJSON() });
}

async function deleteUser(request, response) {
  const { id } = request.body;

  if (!id) {
    return response.status(400).json({ error: "User ID is required" });
  }

  const deletedUser = await UserModel.delete(id);

  if (!deletedUser) {
    return response.status(404).json({ error: "User not found" });
  }

  response.status(200).json({ message: "User deleted successfully" });
}
