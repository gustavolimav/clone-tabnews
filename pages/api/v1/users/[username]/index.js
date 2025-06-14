import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import users from "models/user.js";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;

  const newUser = await users.findOneByUsername(username);

  return response.status(200).json({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    created_at: newUser.created_at,
    updated_at: newUser.updated_at,
  });
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const updatedUser = await users.updateByUsername(username, userInputValues);

  return response.status(200).json({
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    created_at: updatedUser.created_at,
    updated_at: updatedUser.updated_at,
  });
}
