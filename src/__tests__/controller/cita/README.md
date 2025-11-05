# Cita Controller Tests

## Overview

This directory contains comprehensive unit tests for the `CitaController` class, which handles HTTP requests and responses for appointment management operations.

## What the Cita Module Does

The Cita controller provides REST API endpoints for managing medical appointments:

- **POST /cita**: Creates new appointments using existing schedules or creating new time slots
- **GET /cita/paciente/:idPaciente**: Retrieves all appointments for a specific patient
- **GET /cita/medico**: Retrieves all appointments for the authenticated doctor
- **DELETE /cita/:idCita**: Cancels an appointment and frees up the time slot

### Key Features

1. **Authentication**: Uses JWT tokens to identify patients and doctors
2. **Input Validation**: Validates request parameters and body data
3. **Error Handling**: Provides consistent error responses with appropriate HTTP status codes
4. **Response Formatting**: Standardizes API responses with success/data structure

## Test Structure

### Normal Cases
- ✅ Successful appointment creation with existing schedule
- ✅ Successful appointment creation with new schedule
- ✅ Successful appointment retrieval for patients and doctors
- ✅ Successful appointment cancellation

### Edge Cases
- ✅ Handling invalid ID formats (non-numeric strings)
- ✅ Managing empty result sets
- ✅ Boundary validation for numeric inputs

### Exception Cases
- ✅ Service layer errors (database failures, validation errors)
- ✅ Authorization/authorization failures
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
# Run all CitaController tests
npm test -- src/__tests__/controller/cita/cita.controller.test.ts

# Run with coverage
npm run test:coverage -- src/__tests__/controller/cita/cita.controller.test.ts

# Run specific test suite
npm test -- --testNamePattern="crearCita"
```

### Coverage Report
After running tests with coverage, view the report at:
- **HTML Report**: `coverage/lcov-report/index.html`
- **Console Output**: Shows coverage percentages in terminal

## Test Output Example

```
PASS src/__tests__/controller/cita/cita.controller.test.ts
CitaController - Tests Completos
  crearCita - Casos Normales
    ✅ debería crear cita exitosamente usando horario existente (3ms)
    ✅ debería crear cita exitosamente creando nuevo horario
  crearCita - Casos Límite
    ✅ debería manejar error cuando horario no está disponible
    ✅ debería manejar error de conflicto de horario
    ✅ debería manejar error cuando ya existe cita activa
  ...

-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
cita.controller.ts |     100 |      100 |     100 |     100 |                   |
-------------------|---------|----------|---------|---------|-------------------
```

## Dependencies Mocked

- **CitaService**: All business logic methods mocked
- **Express Request/Response**: HTTP objects mocked with jest
- **JWT Authentication**: User context mocked in request objects

## AAA Pattern

All tests follow the Arrange-Act-Assert pattern:

```typescript
it('should create appointment successfully using existing schedule', async () => {
  // Arrange - Setup request, response, and service mocks
  const req = {
    body: { idHorario: 1, idMedico: 1, titulo: 'Consulta General', ... },
    user: { id: 1 }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  mockCrearCitaConHorario.mockResolvedValue(mockCita);

  // Act - Call the controller method
  await CitaController.crearCita(req, res);

  // Assert - Verify response and service calls
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCita });
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
  "data": { /* appointment data */ },
  "count": 5 /* for list endpoints */
}
```

## HTTP Status Codes

- **200**: Successful operations (retrieval, deletion)
- **201**: Successful appointment creation
- **400**: Validation errors, business logic violations
- **404**: Resource not found (in deletion)
- **500**: Internal server errors (database issues)

## Response Structure

### Single Resource Response
```json
{
  "success": true,
  "data": {
    "id_cita": 1,
    "estado": "PENDIENTE",
    "modalidad": "PRESENCIAL",
    ...
  }
}
```

### List Resource Response
```json
{
  "success": true,
  "data": [
    {
      "id_cita": 1,
      "estado": "PENDIENTE",
      "horario": { ... },
      "consulta": { ... }
    }
  ],
  "count": 1
}