# API Route Tests

This directory contains tests for the LIMS API routes.

## Test Files

- `test-assignments.test.ts` - Tests for POST /api/test-assignments endpoint

## Setup

The tests are written but require a testing framework to be installed and configured.

### Install Testing Dependencies

```bash
npm install --save-dev jest @types/jest @jest/globals ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Configure Jest

Create a `jest.config.js` file in the root of the project:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

Create a `jest.setup.js` file:

```javascript
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
```

### Add Test Script

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test test-assignments.test.ts
```

## Test Coverage

The test-assignments.test.ts file covers:

### Authentication Tests
- ✓ Returns 401 when user is not authenticated
- ✓ Proceeds when user is authenticated

### Validation Tests (Requirement 4.4)
- ✓ Returns 400 when assignments array is empty
- ✓ Returns 400 when patient has no tests assigned
- ✓ Returns 400 when patientId is not a valid UUID
- ✓ Returns 400 when test type is invalid
- ✓ Accepts valid test types: CBC, BG, VDRL

### Patient Verification Tests
- ✓ Returns 400 when patient ID does not exist
- ✓ Returns 500 when database error occurs during patient check

### Test Assignment Creation Tests (Requirements 4.6, 5.2, 5.5)
- ✓ Creates test assignment records successfully
- ✓ Creates multiple test assignments for one patient (Requirement 5.5)
- ✓ Creates assignments for multiple patients
- ✓ Includes all required fields in created assignments (Requirement 5.2)

### Error Handling Tests
- ✓ Returns 400 for duplicate test assignment (unique constraint)
- ✓ Returns 400 for foreign key constraint violation
- ✓ Returns 400 for invalid JSON
- ✓ Returns 500 for unexpected database errors

## Notes

- Tests use mocked Supabase client to avoid database dependencies
- All tests follow the AAA pattern (Arrange, Act, Assert)
- Tests are organized by functionality and requirements
- Each test is independent and can run in isolation
