const nextJest = require("next/jest");
const dotenv = require("dotenv");

// Load .env.development to jest
dotenv.config({ path: ".env.development" });

const createJestConfig = nextJest();

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
