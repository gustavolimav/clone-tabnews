import DatabaseModel from "models/databaseModel";
import handleRequest from "utils/allowedMethodHandler.js";

const allowedMethods = ["GET"];

const methodHandlers = {
  GET: (request, response) => {
    return getStatus(response);
  },
};

export default async function status(request, response) {
  return handleRequest(request, response, allowedMethods, methodHandlers);
}

async function getStatus(response) {
  const updatedAt = new Date().toISOString();

  const databaseModel = new DatabaseModel();
  await databaseModel.initialize();
  const databaseStatus = databaseModel.toJSON(); // Now calling toJSON properly

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: databaseStatus,
    },
  });
}
