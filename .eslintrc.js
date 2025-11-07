module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist', 'node_modules', 'coverage', '.eslintrc.js'],
  overrides: [
    {
      files: ['*.spec.ts', '*.e2e-spec.ts', 'test/**/*.ts'],
      env: { jest: true },
      rules: {
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
};
