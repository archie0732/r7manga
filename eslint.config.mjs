import js from '@eslint/js';
import ts from 'typescript-eslint';
import style from '@stylistic/eslint-plugin';
import tailwind from 'eslint-plugin-readable-tailwind';

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
  ...ts.configs.stylisticTypeChecked,
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
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'readable-tailwind': tailwind,
    },
    rules: {
      ...tailwind.configs.warning.rules,
      'readable-tailwind/multiline': ['warn', { group: 'newLine' }],
    },
  },
);
