import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authentication from "models/authentication.js";
import session from "models/session.js";
import * as cookie from "cookie";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValue = request.body;

  const authenticatedUser = await authentication.getAuthentication(
    userInputValue.email,
    userInputValue.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  const cookieOptions = cookie.serialize("session_id", newSession.token, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", cookieOptions);

  return response.status(201).json(newSession);
}
