module.exports = {
  env: {
    es6: true,
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": "off",
  },
  ignorePatterns: ["src/Domains/*"],
  plugins: ["prettier", "jest"],
};
