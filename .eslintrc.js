module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'build',
    'dist',
    'coverage',
    '**/*.scss.d.ts',
    '**/*.html',
    '**/*.md',
    '**/*.txt',
    '**/*.xml',
    '**/*.graphql',
    '**/*.yaml',
    '**/*.yml',
    '**/*.json',
  ],
  rules: {
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error'],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'warn',
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'prefer-const': 'off',
  },
};
