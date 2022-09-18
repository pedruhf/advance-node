module.exports = {
  collectCoverage: false,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageProvider: "babel",
  moduleNameMapper: {
    "@/tests/(.+)": "<rootDir>/tests/$1",
    "@/(.+)": "<rootDir>/src/$1",
  },
  testMatch: ["**/*.spec.ts"],
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  transform: {
    "\\.ts$": "ts-jest",
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/main",
    "index.ts",
  ],
  clearMocks: true,
};
