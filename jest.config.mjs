import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  clearMocks: true,
  testPathIgnorePatterns: [
    "/node_modules/",
    "/notion-webhook-worker/",
  ],
};

export default createJestConfig(config);
