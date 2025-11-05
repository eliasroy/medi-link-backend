# Model Tests

This directory contains unit tests for the Sequelize models used in the application.

## Test Coverage

The model tests cover the following areas:

### Consulta Model (`Consulta.test.ts`)
- **Normal Cases**: Model initialization, property validation, data integrity
- **Limit Cases**: Large text fields, maximum values, edge cases
- **Exception Cases**: Invalid data types, missing required fields, database errors

### Associations (`associations.test.ts`)
- **Normal Cases**: Relationship setup between models (belongsTo, hasMany, hasOne)
- **Limit Cases**: Multiple associations on same model, bidirectional relationships
- **Exception Cases**: Missing model references, circular dependencies

### Cita Model (`cita.model.test.ts`)
- **Normal Cases**: Model properties, default values, state transitions
- **Limit Cases**: Large ID values, enum validation, date handling
- **Exception Cases**: Invalid enum values, type mismatches, constraint violations

## Test Structure

Each test file follows a consistent structure:

1. **Setup**: Mock dependencies and configure test environment
2. **Normal Cases**: Test expected behavior under normal conditions
3. **Limit Cases**: Test edge cases and boundary conditions
4. **Exception Cases**: Test error handling and unexpected scenarios

## Running Tests

```bash
# Run all model tests
npm test -- --testPathPattern=model

# Run specific model test
npm test -- Consulta.test.ts

# Run with coverage
npm test -- --testPathPattern=model --coverage
```

## Coverage Goals

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Mock Strategy

Tests use Jest mocks to isolate model behavior:
- Sequelize DataTypes are mocked
- Database connections are mocked
- Related models are mocked to avoid circular dependencies
- Model methods are mocked where necessary

## Test Data

Tests use realistic but minimal data sets:
- Valid model instances with all required fields
- Edge case values (min/max IDs, long strings)
- Invalid data to test error handling
- Empty/null values where appropriate