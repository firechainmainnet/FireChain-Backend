// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  verbose: true,
  testTimeout: 10000,
  setupFiles: ['<rootDir>/tests/setup/testEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/testTeardown.js'] // ✅ novo
};
