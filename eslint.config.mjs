import js from '@eslint/js';
import ts from 'typescript-eslint';
import style from '@stylistic/eslint-plugin';

export default ts.config(
  {
    files: [
      'eslint.config.mjs',
      'next-env.d.ts',
      '**/*.ts',
      '**/*.tsx',
      '.next/types/**/*.ts',
    ],
  },
  {
    ignores: [
      'node_modules',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  style.configs.customize({
    semi: true,
    arrowParens: true,
    flat: true,
  }),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
