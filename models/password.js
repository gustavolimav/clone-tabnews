import bcrypt from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();

  return await bcrypt.hash(pepperPassword(password), rounds);
}

async function compare(password, hash) {
  return await bcrypt.compare(pepperPassword(password), hash);
}

function pepperPassword(password) {
  const pepper = process.env.PEPPER;

  if (!pepper) {
    throw new Error("PEPPER environment variable is not set");
  }

  return password + pepper;
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

const password = {
  hash, compare
};

export default password;