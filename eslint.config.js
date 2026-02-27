import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react'; // <-- Faltava esse cara aqui
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build']),
  {
    // Corrigido para pegar todos os arquivos em qualquer subpasta (**/)
    files: ['**/*.{js,jsx}'], 
    plugins: {
      'react': react, // Adicionado plugin react
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }, // Essencial para o < JSX
      },
    },
    settings: {
      react: { version: 'detect' }, // Necessário para o plugin-react saber qual versão você usa
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules, // Regras base do React
      ...react.configs['jsx-runtime'].rules, // Regras que permitem não importar o React
      ...reactHooks.configs.recommended.rules,

      // --- SUAS REGRAS OTIMIZADAS ---
      
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],

      'react-hooks/exhaustive-deps': 'warn',

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'react/prop-types': 'off', 
      'react/react-in-jsx-scope': 'off',
      "react/no-unescaped-entities": "off"
    },
  },
  eslintConfigPrettier, // Sempre por último
]);