export default [
  {
    extends: ['proste/typescript', 'proste/vue', 'prettier'],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      project: './tsconfig.json',
      tsconfigRootDir: '.',
      warnOnUnsupportedTypeScriptVersion: true,
      extraFileExtensions: ['.vue'],
    },
    overrides: [],
    ignores: [
      'node_modules',
      'build',
      'public',
      '*.config.js',
      '*.d.ts',
      'dist/',
    ],
  },
];
