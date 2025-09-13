import {
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "infra/errors.js";
import * as cookie from "cookie";
import session from "models/session.js";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();

  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  console.log("Error encountered:", error);
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookies(response);
    console.log("Session cleared due to unauthorized error.");
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  return response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function setSessionCookies(sessionToken, response) {
  const cookieOptions = cookie.serialize("session_id", sessionToken.token, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", cookieOptions);
}

async function clearSessionCookies(response) {
  const cookieOptions = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", cookieOptions);
}

async function setCacheControlNoStore(response) {
  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
  setSessionCookies: setSessionCookies,
  clearSessionCookies: clearSessionCookies,
  setCacheControlNoStore: setCacheControlNoStore,
};

export default controller;
