const {createTestDb, dropTestDb} = require('../utils/test-db');
const {closePool} = require('../config/db.config');

// Suppress console output during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

if (process.env.NODE_ENV === 'test' && !process.env.DEBUG) {
    // Override console methods to suppress output for expected errors
    console.error = (...args) => {
        // Check if this is an expected error from tests - only show if DEBUG=true
        const isExpectedError = args[0] && (
            args[0].includes('Registration error:') ||
            args[0].includes('Login error:') ||
            args[0].includes('Error adding bookmark:')
        );

        if (!isExpectedError) {
            originalConsoleError(...args);
        }
    };

    console.warn = (...args) => {
        // Only show warnings in debug mode
        if (process.env.DEBUG) {
            originalConsoleWarn(...args);
        }
    };

    console.log = (...args) => {
        // Only show certain logs during tests
        const isImportantLog = args[0] && (
            args[0].includes('Test database created and configured successfully') ||
            args[0].includes('Test database dropped successfully')
        );

        if (isImportantLog || process.env.DEBUG) {
            originalConsoleLog(...args);
        }
    };
}

// Create and configure test database before all tests
beforeAll(async () => {
    try {
        await createTestDb();
        console.log('Test database created and configured successfully');
    } catch (error) {
        console.error('Test database setup failed:', error);
        process.exit(1);
    }
}, 15000); // Increased timeout for database setup

// Drop test database after all tests
afterAll(async () => {
    try {
        await dropTestDb();
        console.log('Test database dropped successfully');

        // Wait a short time to allow all async operations to complete
        await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
        console.error('Test database cleanup failed:', error);
    }
}, 15000); // Increased timeout for database cleanup

// Restore console functions when tests are done
afterAll(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
});

// Handle process termination signals to clean up the database
process.on('SIGINT', async () => {
    console.log('Received SIGINT - cleaning up test database before exit');
    try {
        await dropTestDb();
        await closePool();
        process.exit(0);
    } catch (error) {
        console.error('Cleanup on SIGINT failed:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM - cleaning up test database before exit');
    try {
        await dropTestDb();
        await closePool();
        process.exit(0);
    } catch (error) {
        console.error('Cleanup on SIGTERM failed:', error);
        process.exit(1);
    }
});