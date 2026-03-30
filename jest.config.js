/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  forceExit: true,
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
  moduleNameMapper: {
    '^react-native-unistyles$': '<rootDir>/__mocks__/react-native-unistyles.js',
    '^immer$': '<rootDir>/node_modules/immer/dist/cjs/index.js',
    '^react-redux$': '<rootDir>/node_modules/react-redux/dist/cjs/index.js',
    '^@reduxjs/toolkit$':
      '<rootDir>/node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^@reduxjs/toolkit/query$':
      '<rootDir>/node_modules/@reduxjs/toolkit/dist/query/cjs/index.js',
    '^@reduxjs/toolkit/query/react$':
      '<rootDir>/node_modules/@reduxjs/toolkit/dist/query/react/cjs/index.js'
  }
}

module.exports = config
