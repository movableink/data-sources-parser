module.exports = {
  root: true,
  extends: ['esnext', 'airbnb', 'prettier'],
  plugins: ['babel', 'prettier'],
  env: {
    browser: true
  },
  globals: {
    MI: true,
    QUnit: true,
    sinon: true
  },
  rules: {
    'prettier/prettier': 'error',
    'func-names': 'off',
    'no-debugger': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-use-before-define': 'off'
  }
};
