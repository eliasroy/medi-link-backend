# Middleware Unit Tests

This directory contains comprehensive unit tests for middleware functions in the application. Currently, it includes tests for the authentication middleware (`auth.ts`) with 100% code coverage.

## Test Structure

Each middleware test file follows a consistent structure:

### Normal Cases
- Tests successful middleware execution with valid inputs
- Verifies correct behavior when conditions are met
- Validates that `next()` is called appropriately

### Limit Cases
- Tests boundary conditions and edge cases
- Handles missing or invalid parameters
- Validates input constraints and error responses

### Exception Cases
- Tests error handling for unexpected scenarios
- Covers JWT verification failures
- Handles malformed tokens and authentication errors

## Coverage Report

All middleware files achieve 100% statement, function, and line coverage:

```
src/middlewares              |   100 |    90 |   100 |   100 |
├── auth.ts                  |   100 |    90 |   100 |   100 |
```

## Test Files

### auth.test.ts
Tests authentication middleware functions:
- `verifyToken` - JWT token verification middleware
- `authorizeRoles` - Role-based authorization middleware

#### verifyToken Tests
- **Normal Cases**: Valid token verification, different user roles
- **Limit Cases**: Missing/invalid authorization headers, malformed tokens
- **Exception Cases**: Expired tokens, invalid signatures, verification errors

#### authorizeRoles Tests
- **Normal Cases**: Single role authorization, multiple roles, different user types
- **Limit Cases**: Unauthenticated users, missing roles, invalid role formats
- **Exception Cases**: Empty role arrays, case sensitivity, role matching logic

## Test Results

- **Total Test Suites**: 1 passed
- **Total Tests**: 23 passed
- **Coverage**: 100% for middleware functions
- **Execution Time**: ~14 seconds

## Dependencies

The tests use the following key dependencies:
- `jest`: For mocking and assertions
- `jsonwebtoken`: For JWT token mocking
- `express`: For Request/Response type definitions

## Mock Strategy

Each test file mocks:
- External dependencies (jsonwebtoken)
- Request/Response objects for middleware testing
- Next function for continuation testing

This ensures tests focus on middleware logic and error handling rather than external services.

## Running Tests

To run all middleware tests:

```bash
npx jest --testPathPatterns=middlewares --coverage --coverageDirectory=test-report/middlewares-coverage
```

To run tests for a specific middleware:

```bash
npx jest src/__tests__/middlewares/auth.test.ts
```

## Key Test Scenarios

### Authentication Flow
1. **Token Verification**: Validates JWT tokens and extracts user information
2. **Role Authorization**: Ensures users have appropriate permissions
3. **Error Handling**: Proper HTTP status codes and error messages
4. **Security**: Prevents unauthorized access and handles edge cases

The middleware tests ensure robust authentication and authorization mechanisms throughout the application.