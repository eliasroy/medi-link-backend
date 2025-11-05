# Utils Tests

This directory contains unit tests for utility functions used throughout the application.

## Test Coverage

The utils tests cover the following areas:

### Mapper Utils (`mapper.test.ts`)
- **Normal Cases**: Successful mapping between Usuario and UsuarioDTO
- **Limit Cases**: Edge cases with empty strings, special characters, large values
- **Exception Cases**: Null/undefined values, invalid data types, missing properties

## Test Structure

Each test file follows a consistent structure:

1. **Setup**: Mock dependencies and configure test environment
2. **Normal Cases**: Test expected behavior under normal conditions
3. **Limit Cases**: Test edge cases and boundary conditions
4. **Exception Cases**: Test error handling and unexpected scenarios

## Running Tests

```bash
# Run all utils tests
npm test -- --testPathPattern=utils

# Run specific utils test
npm test -- mapper.test.ts

# Run with coverage
npm test -- --testPathPattern=utils --coverage
```

## Coverage Goals

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Mock Strategy

Tests use Jest mocks to isolate utility function behavior:
- Model classes are mocked to avoid database dependencies
- DTO classes are mocked to focus on mapping logic
- External dependencies are mocked where necessary

## Test Data

Tests use comprehensive data sets:
- Valid input/output pairs for mapping functions
- Edge case values (empty strings, special characters, large numbers)
- Invalid data types to test error resilience
- Null/undefined values to test robustness

## Utility Functions Tested

### `usuarioToDTO`
Maps a Usuario model instance to a UsuarioDTO for API responses:
- Preserves user ID, name, email, and role
- Handles data type conversions
- Maintains data integrity
- Provides consistent output format