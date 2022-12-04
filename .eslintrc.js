module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        usePrettierrc: true,
      },
    ],
    'use-isnan': ['error', { enforceForSwitchCase: true }],
    'arrow-body-style': ['warn', 'as-needed'],
    'dot-notation': 'warn',
    'jsx-quotes': ['warn', 'prefer-single'],
    'valid-typeof': 'warn',

    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-empty-function': [
      'error',
      { allow: ['arrowFunctions'] },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': 'warn',
    "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    "no-duplicate-imports": "off",
    "@typescript-eslint/no-duplicate-imports": ["error"],
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: [
          'private-static-field',
          'protected-static-field',
          'public-static-field',
          'private-static-method',
          'protected-static-method',
          'public-static-method',
          'private-constructor',
          'protected-constructor',
          'public-constructor',
          'private-instance-field',
          'protected-instance-field',
          'public-instance-field',
          'private-instance-method',
          'protected-instance-method',
          'public-instance-method',
        ],
      },
    ],
  },
};
