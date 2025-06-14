import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import users from "models/user.js";

const router = createRouter();

router.get(getHandler);

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
