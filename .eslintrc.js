module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-underscore-dangle': 'off',
  },
  ignorePatterns: ['src/Domains/*'],
  env: {
    'jest/globals': true,
  },
};
