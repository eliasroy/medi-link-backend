# Consulta Controller Tests

## Overview

This directory contains comprehensive unit tests for the `ConsultaController` class, which handles HTTP requests and responses for medical consultation operations.

## What the Consulta Module Does

The Consulta controller provides REST API endpoints for managing medical consultations:

- **POST /consulta/iniciar**: Initiates a new consultation for a scheduled appointment
- **PUT /consulta/:id_consulta**: Updates consultation details and progress
- **POST /consulta/calificar**: Allows patients to rate completed consultations
- **GET /consulta/cita/:idCita**: Retrieves consultation details by appointment ID

### Key Features

1. **Authentication**: Uses JWT tokens to identify doctors and patients
2. **Input Validation**: Validates request parameters and body data
3. **Error Handling**: Provides consistent error responses with appropriate HTTP status codes
4. **Response Formatting**: Standardizes API responses with success/data structure

## Test Structure

### Normal Cases
- ✅ Successful consultation initiation with valid data
- ✅ Successful consultation updates with complete and partial data
- ✅ Successful consultation rating with valid scores
- ✅ Successful consultation retrieval with proper authorization

### Edge Cases
- ✅ Handling missing optional fields in request bodies
- ✅ Boundary validation for numeric inputs (IDs, ratings)
- ✅ Invalid ID formats (non-numeric strings)
- ✅ Empty or whitespace-only inputs

### Exception Cases
- ✅ Service layer errors (database failures, validation errors)
- ✅ Authentication/authorization failures
- ✅ Invalid request data formats
- ✅ Missing required parameters

## Test Coverage

The tests achieve 100% coverage for:
- **Lines**: All executable lines are tested
- **Statements**: All statements are executed
- **Branches**: All conditional branches are covered
- **Functions**: All controller methods are tested

## Running the Tests

### Prerequisites
- Node.js and npm installed
- Dependencies installed: `npm install`

### Environment Variables
Create a `.env.test` file with:
```
JWT_SECRET=test-secret-key
NODE_ENV=test
```

### Execute Tests
```bash
# Run all ConsultaController tests
npm test -- src/__tests__/controller/consulta/consulta.controller.test.ts

# Run with coverage
npm run test:coverage -- src/__tests__/controller/consulta/consulta.controller.test.ts

# Run specific test suite
npm test -- --testNamePattern="iniciarConsulta"
```

### Coverage Report
After running tests with coverage, view the report at:
- **HTML Report**: `coverage/lcov-report/index.html`
- **Console Output**: Shows coverage percentages in terminal

## Test Output Example

```
PASS src/__tests__/controller/consulta/consulta.controller.test.ts
ConsultaController - Tests Completos
  iniciarConsulta - Casos Normales
    ✅ debería iniciar consulta exitosamente (3ms)
    ✅ debería iniciar consulta con motivo vacío
  iniciarConsulta - Casos Límite
    ✅ debería manejar error de validación de cita
    ✅ debería manejar error de consulta ya iniciada
  ...

-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
consulta.controller.ts|     100 |      100 |     100 |     100 |                   |
-------------------|---------|----------|---------|---------|-------------------
```

## Dependencies Mocked

- **ConsultaService**: All business logic methods mocked
- **Express Request/Response**: HTTP objects mocked with jest
- **JWT Authentication**: User context mocked in request objects

## AAA Pattern

All tests follow the Arrange-Act-Assert pattern:

```typescript
it('should initiate consultation successfully', async () => {
  // Arrange - Setup request, response, and service mocks
  const req = { body: { id_cita: 1, motivo: 'test' }, user: { id: 1 } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  mockIniciarConsulta.mockResolvedValue(mockConsulta);

  // Act - Call the controller method
  await ConsultaController.iniciarConsulta(req, res);

  // Assert - Verify response and service calls
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
});
```

## Mock Factories

The tests use consistent mock data factories for:
- Mock Express request objects with different body/params/user combinations
- Mock Express response objects with status/json spying
- Mock service responses for success and error scenarios

This ensures test reliability and maintainability.

## Error Response Format

All error responses follow the standard format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Success Response Format

All success responses follow the standard format:
```json
{
  "success": true,
  "data": { /* consultation data */ }
}
```

## HTTP Status Codes

- **200**: Successful updates and ratings
- **201**: Successful consultation creation
- **400**: Validation errors, business logic violations
- **404**: Resource not found (handled in obtenerConsultaPorIdCita)