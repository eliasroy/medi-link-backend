# Router Unit Tests

This directory contains comprehensive unit tests for all router modules in the application. Each router test file covers normal cases, limit cases, and exception cases to ensure 100% code coverage and robust error handling.

## Test Structure

Each router test file follows a consistent structure:

### Normal Cases
- Tests successful operations with valid inputs
- Verifies correct HTTP status codes (200, 201)
- Validates response data structure

### Limit Cases
- Tests boundary conditions and edge cases
- Handles missing or invalid parameters
- Validates input constraints (empty strings, invalid formats, etc.)

### Exception Cases
- Tests error handling for server errors
- Covers database connection failures
- Handles timeout scenarios

## Coverage Report

All router files achieve 100% statement, branch, function, and line coverage:

```
src/router                   |   100 |    100 |   100 |   100 |
├── authRouter.ts            |   100 |    100 |   100 |   100 |
├── citaRoutes.ts            |   100 |    100 |   100 |   100 |
├── consultaRoutes.ts        |   100 |    100 |   100 |   100 |
├── especialidad.routes.ts   |   100 |    100 |   100 |   100 |
├── horarioRoutes.ts         |   100 |    100 |   100 |   100 |
├── medico.routes.ts         |   100 |    100 |   100 |   100 |
└── usuario.routes.ts        |   100 |    100 |   100 |   100 |
```

## Test Files

### authRouter.test.ts
Tests authentication routes:
- POST /auth/login
- POST /auth/change-password

### citaRoutes.test.ts
Tests appointment routes:
- POST /citas/save
- GET /citas/paciente/:idPaciente
- DELETE /citas/:idCita
- GET /citas/medico

### consultaRoutes.test.ts
Tests consultation routes:
- POST /consultas/iniciar
- PUT /consultas/actualizar/:id_consulta
- POST /consultas/calificar
- GET /consultas/cita/:idCita

### especialidad.routes.test.ts
Tests specialty routes:
- GET /especialidades/

### horarioRoutes.test.ts
Tests schedule routes:
- POST /horarios/save
- GET /horarios/disponibles/semana
- GET /horarios/semana
- GET /horarios/disponibles/rango

### medico.routes.test.ts
Tests doctor routes:
- GET /medicos/medicos

### usuario.routes.test.ts
Tests user registration routes:
- POST /usuarios/paciente
- POST /usuarios/medico

## Running Tests

To run all router tests:

```bash
npx jest --testPathPatterns=router --coverage --coverageDirectory=test-report/router-coverage
```

To run tests for a specific router:

```bash
npx jest src/__tests__/router/authRouter.test.ts
```

## Test Results

- **Total Test Suites**: 7 passed
- **Total Tests**: 92 passed
- **Coverage**: 100% for all router files
- **Execution Time**: ~16 seconds

## Dependencies

The tests use the following key dependencies:
- `supertest`: For HTTP endpoint testing
- `express`: For creating test app instances
- `jest`: For mocking and assertions

## Mock Strategy

Each test file mocks:
- Controller functions to isolate router logic
- Middleware functions (auth, validation)
- External dependencies

This ensures tests focus on routing logic and middleware integration rather than business logic or external services.