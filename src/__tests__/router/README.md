# Router Tests

This directory contains unit tests for all Express.js route handlers in the application.

## Test Coverage

The router tests cover all route files with comprehensive test cases:

### authRouter (`authRouter.test.ts`)
- **POST /auth/login**: Authentication with normal, limit, and exception cases
- **POST /auth/change-password**: Password change functionality

### citaRoutes (`citaRoutes.test.ts`)
- **POST /citas/save**: Appointment creation
- **GET /citas/paciente/:idPaciente**: Patient appointment retrieval
- **DELETE /citas/:idCita**: Appointment deletion
- **GET /citas/medico**: Doctor appointment retrieval

### consultaRoutes (`consultaRoutes.test.ts`)
- **POST /consultas/iniciar**: Consultation initiation
- **PUT /consultas/actualizar/:id_consulta**: Consultation updates
- **POST /consultas/calificar**: Consultation rating
- **GET /consultas/cita/:idCita**: Consultation retrieval by appointment

### especialidadRoutes (`especialidad.routes.test.ts`)
- **GET /especialidades/**: Specialty listing

### horarioRoutes (`horarioRoutes.test.ts`)
- **POST /horarios/save**: Schedule creation
- **GET /horarios/disponibles/semana**: Weekly available schedules
- **GET /horarios/semana**: Weekly schedules for patients
- **GET /horarios/disponibles/rango**: Schedules by date range

### medicoRoutes (`medico.routes.test.ts`)
- **GET /medicos/medicos**: Doctor listing

### usuarioRoutes (`usuario.routes.test.ts`)
- **POST /usuarios/paciente**: Patient registration
- **POST /usuarios/medico**: Doctor registration

## Test Structure

Each test file follows a consistent structure:

1. **Setup**: Express app configuration, middleware mocking, controller mocking
2. **Normal Cases**: Test successful operations with valid data
3. **Limit Cases**: Test edge cases, validation boundaries, and constraints
4. **Exception Cases**: Test error handling, server errors, and unexpected scenarios

## Test Strategy

- **Supertest**: Used for HTTP request/response testing
- **Jest Mocks**: Controllers and middleware are mocked to isolate route logic
- **Middleware Simulation**: Authentication and authorization middleware are mocked
- **Error Scenarios**: Various error conditions are tested (400, 404, 500 status codes)

## Coverage Goals

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Running Tests

```bash
# Run all router tests
npm test -- --testPathPattern=router

# Run specific router test
npm test -- authRouter.test.ts

# Run with coverage
npm test -- --testPathPattern=router --coverage
```

## Mock Strategy

Tests use comprehensive mocking:
- **Controllers**: All controller methods are mocked with Jest
- **Middleware**: Authentication and authorization middleware are mocked
- **Database**: No actual database connections (handled by service/controller mocks)
- **External Services**: All external dependencies are mocked

## Test Data

Tests use realistic data sets:
- Valid request payloads matching API specifications
- Edge case values (empty strings, large IDs, special characters)
- Invalid data to test validation and error handling
- Various user roles and authorization scenarios

## Route Categories

### Public Routes
- Authentication endpoints (login, password change)
- Public information (specialties, available schedules)

### Protected Routes
- Patient routes (appointment management, ratings)
- Doctor routes (consultation management, schedule creation)
- Admin routes (user registration)

### Authorization Levels
- **PACIENTE**: Patient-specific operations
- **MEDICO**: Doctor-specific operations
- **Public**: No authentication required