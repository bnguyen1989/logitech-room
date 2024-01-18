export default {
  displayName: '@threekit/rest-api',
  transform: {},
  testMatch: ['<rootDir>/dist/**/*.test.js'],
  setupFiles: ['dotenv/config'],
  rootDir: './',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
