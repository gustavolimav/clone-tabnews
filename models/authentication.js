import user from "models/user.js";
import password from "models/password.js";
import { NotFoundError, UnathorizedError } from "infra/errors.js";

async function getAuthentication(providedEmail, providedPassword) {
  let storedUser;

  try {
    storedUser = await findUserByEmail(providedEmail);

    await validatePassword(providedPassword, storedUser.password);
  } catch (error) {
    if (error instanceof UnathorizedError) {
      throw new UnathorizedError({
        message: "Email ou senha inválidos.",
        action: "Verifique se o email e a senha estão digitados corretamente.",
      });
    }

    throw error;
  }

  return storedUser;
}

async function validatePassword(providedPassword, userPassword) {
  const isPasswordValid = await password.compare(
    providedPassword,
    userPassword,
  );

  if (!isPasswordValid) {
    throw new UnathorizedError({
      message: "Senha inválida.",
      action: "Verifique se a senha está digitada corretamente.",
    });
  }
}

async function findUserByEmail(providedEmail) {
  let storedUser;

  try {
    storedUser = await user.findOneByEmail(providedEmail);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnathorizedError({
        message: "Email inválido.",
        action: "Verifique se o email está digitado corretamente.",
      });
    }

    throw error;
  }
  return storedUser;
}

const authentication = {
  getAuthentication,
};

export default authentication;
