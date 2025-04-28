# CookAtlas Backend API

This is the backend API for the CookAtlas application, a platform for discovering and sharing recipes.

## Project Structure

The project follows a modular architecture to improve maintainability and separation of concerns:

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models and database logic
│   ├── routes/         # API routes definitions
│   ├── tests/          # Test files
│   ├── utils/          # Utility functions
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env                # Environment variables (not committed)
├── .env.example        # Example environment variables
└── package.json        # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and update the variables:
   ```
   cp .env.example .env
   ```

### Running the Application

- Development mode:
  ```
  npm run dev
  ```
- Production mode:
  ```
  npm start
  ```

## Testing

Tests are run with Jest and use an automatically created and destroyed test database.

- Run tests:
  ```
  npm test:verbose/watch/coverage/debug
  ```

## API Endpoints

### Recipes

- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get a specific recipe
- `POST /recipes` - Create a new recipe
- `PUT /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe
- `GET /search` - Search recipes with filters

### Users

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `GET /users/:userId/bookmarks` - Get user bookmarks

### Bookmarks

- `POST /bookmarks` - Add a bookmark
- `GET /bookmarks/check` - Check if a recipe is bookmarked
- `DELETE /bookmarks` - Remove a bookmark

## Development Guidelines
### Writing Tests

Tests are automatically configured to use Jest and a dedicated test database that's created and destroyed for each test run.

Example of creating a test:

```javascript
// Example test for the recipe API
const request = require('supertest');
const app = require('../app');

describe('My Feature Test', () => {
  // Test cases
  it('should do something specific', async () => {
    const response = await request(app).get('/some-endpoint');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('expectedProperty');
  });
});
```