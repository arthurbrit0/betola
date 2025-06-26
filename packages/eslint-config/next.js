const { resolve } = require("path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-turbo"
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["@typescript-eslint", "import", "prettier"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  rules: {
    "prettier/prettier": "error",
    "import/no-unresolved": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
  ],
}; 