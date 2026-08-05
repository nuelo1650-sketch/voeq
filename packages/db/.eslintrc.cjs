module.exports = {
  extends: ['@voeq'],
  overrides: [
    {
      files: ['src/index.ts'],
      rules: {
        'no-var': 'off',
      },
    },
    {
      files: ['prisma/seed.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      },
    },
  ],
};
