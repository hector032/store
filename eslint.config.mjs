import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'], // Aplica a archivos TypeScript
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'], // Archivo tsconfig
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...(tseslint.configs.recommended?.rules || {}), // Acceso seguro a las reglas recomendadas
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': 'off', // Desactivar la regla de no usar console
      eqeqeq: 'error', // Usar === en lugar de ==
    },
  },
];
