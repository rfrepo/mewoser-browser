const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintConfigPrettier = require('eslint-config-prettier/flat')
const reactCompiler = require('eslint-plugin-react-compiler')

module.exports = defineConfig([
  ...expoConfig,
  reactCompiler.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.expo/**'
    ]
  },
  eslintConfigPrettier,
  {
    files: ['**/*.{tsx,jsx}'],
    rules: {
      'react/jsx-newline': 'error'
    }
  }
])
