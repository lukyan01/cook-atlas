module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/src/tests/**/*.test.js'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/server.js',
        '!src/tests/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!**/*.config.js'
    ],
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['./src/tests/setup.js'],
    verbose: true,

    // Better handling for async operations
    detectOpenHandles: true,
    // Don't force exit - properly close resources instead
    forceExit: false,

    // Set reasonable timeouts
    testTimeout: 10000,

    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
};