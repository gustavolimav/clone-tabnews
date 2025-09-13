import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authentication from "models/authentication.js";
import session from "models/session.js";

const router = createRouter();

router.post(postHandler);
router.delete(deleteHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValue = request.body;

  const authenticatedUser = await authentication.getAuthentication(
    userInputValue.email,
    userInputValue.password,
  );

  const newSession = await session.create(authenticatedUser.id);
  controller.setSessionCookies(newSession, response);

  return response.status(201).json(newSession);
}

async function deleteHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const validSession = await session.findOneValidByToken(sessionToken);

  await session.expireById(validSession.id);

  controller.clearSessionCookies(sessionToken, response);

  return response.status(204).end();
}
