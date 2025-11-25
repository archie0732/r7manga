import { defineConfig, globalIgnores } from 'eslint/config';

import drizzle from 'eslint-plugin-drizzle';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettyImport from '@kamiya4047/eslint-plugin-pretty-import';
import stylistic from '@stylistic/eslint-plugin';
import tailwindcss from 'eslint-plugin-better-tailwindcss';
import typescript from 'typescript-eslint';

export default defineConfig(
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      drizzle,
      'better-tailwindcss': tailwindcss,
    },
    extends: [
      ...typescript.configs.recommendedTypeChecked,
      ...typescript.configs.stylisticTypeChecked,
      stylistic.configs.customize({
        arrowParens: true,
        semi: true,
        severity: 'warn',
      }),
      prettyImport.configs.warn,
    ],
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-base-to-string': 'error',
      'drizzle/enforce-delete-with-where': [
        'error',
        { drizzleObjectName: ['db', 'ctx.db'] },
      ],
      'drizzle/enforce-update-with-where': [
        'error',
        { drizzleObjectName: ['db', 'ctx.db'] },
      ],
      ...tailwindcss.configs.recommended.rules,
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/globals.css',
      },
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
);
