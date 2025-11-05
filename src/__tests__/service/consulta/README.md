# Consulta Module Tests - Complete Documentation

## Overview

This directory contains comprehensive unit tests for the Consulta module, including both service and controller layers. The tests ensure complete coverage of the medical consultation functionality in the healthcare platform.

## What the Consulta Module Does

The Consulta module manages the complete lifecycle of medical consultations:

### Core Functionality

1. **Consultation Initiation** (`iniciarConsulta`)
   - Starts a new consultation for a scheduled appointment
   - Validates that the appointment exists and belongs to the requesting doctor
   - Ensures no duplicate consultations for the same appointment
   - Updates appointment status to CONFIRMADA

2. **Consultation Updates** (`actualizarConsulta`)
   - Allows doctors to update consultation progress and details
   - Supports different workflows for PRESENCIAL vs VIRTUAL consultations
   - Manages state transitions (INICIADO → EN_REVISION → DIAGNOSTICADA → FINALIZADA)
   - Updates related appointment and schedule statuses when consultation is finalized

3. **Consultation Rating** (`calificarConsulta`)
   - Enables patients to rate completed consultations (1-10 scale)
   - Validates that only patients can rate their own consultations
   - Prevents duplicate ratings
   - Only allows rating of FINALIZADA consultations

4. **Consultation Retrieval** (`obtenerConsultaPorIdCita`)
   - Fetches consultation details by appointment ID
   - Includes related appointment information
   - Used for displaying consultation history and details

### Business Rules

- **Authorization**: Doctors can only modify consultations for their own schedules
- **State Management**: Strict state transition rules based on consultation modality
- **Data Integrity**: All operations use database transactions
- **Validation**: Comprehensive input validation and business rule enforcement

## Test Structure

### Normal Cases
- ✅ Successful operations with valid inputs and expected data flow
- ✅ All CRUD operations working correctly
- ✅ Proper authorization and state transitions

### Edge Cases
- ✅ Boundary values (rating limits: 1-10)
- ✅ Missing optional fields handled gracefully
- ✅ Empty results and rare valid scenarios
- ✅ State transition edge cases

### Exception Cases
- ✅ Database failures and transaction rollbacks
- ✅ Validation errors for invalid inputs
- ✅ Authorization violations
- ✅ Unexpected states and error conditions

## Test Coverage Goals

The test suite achieves **100% coverage** for:
- **Lines**: Every executable line tested
- **Statements**: All statements executed
- **Branches**: All conditional branches covered
- **Functions**: All methods thoroughly tested

## Running the Tests

### Prerequisites
- Node.js and npm installed
- All dependencies installed: `npm install`

### Required Environment Variables
Create a `.env.test` file in the project root:
```
JWT_SECRET=test-secret-key
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
```

### Execution Commands

```bash
# Run all Consulta tests (service + controller)
npm test -- src/__tests__/service/consulta/ src/__tests__/controller/consulta/

# Run with coverage report
npm run test:coverage -- src/__tests__/service/consulta/ src/__tests__/controller/consulta/

# Run specific test file
npm test -- src/__tests__/service/consulta/consulta.service.test.ts

# Run specific test suite
npm test -- --testNamePattern="iniciarConsulta.*Normal"

# Run tests in watch mode
npm run test:watch -- src/__tests__/service/consulta/
```

### Coverage Report
After running tests with coverage, access reports at:
- **HTML Report**: `coverage/lcov-report/index.html`
- **Text Report**: `coverage/coverage.txt`
- **JSON Report**: `coverage/coverage-final.json`

## Test Output Example

```
PASS src/__tests__/service/consulta/consulta.service.test.ts
PASS src/__tests__/controller/consulta/consulta.controller.test.ts

ConsultaService - Tests Completos
  iniciarConsulta - Casos Normales .................................. 2/2
  iniciarConsulta - Casos Límite .................................... 5/5
  iniciarConsulta - Casos de Excepción .............................. 2/2
  actualizarConsulta - Casos Normales .............................. 3/3
  actualizarConsulta - Casos Límite ................................ 9/9
  actualizarConsulta - Casos de Excepción .......................... 2/2
  calificarConsulta - Casos Normales ............................... 3/3
  calificarConsulta - Casos Límite ................................. 6/6
  calificarConsulta - Casos de Excepción ........................... 1/1
  obtenerConsultaPorIdCita - Casos Normales ........................ 1/1
  obtenerConsultaPorIdCita - Casos Límite .......................... 1/1
  obtenerConsultaPorIdCita - Casos de Excepción .................... 1/1

ConsultaController - Tests Completos
  iniciarConsulta - Casos Normales ................................. 2/2
  iniciarConsulta - Casos Límite ................................... 2/2
  iniciarConsulta - Casos de Excepción ............................. 1/1
  actualizarConsulta - Casos Normales .............................. 3/3
  actualizarConsulta - Casos Límite ................................ 3/3
  actualizarConsulta - Casos de Excepción .......................... 1/1
  calificarConsulta - Casos Normales ............................... 3/3
  calificarConsulta - Casos Límite ................................. 5/5
  calificarConsulta - Casos de Excepción ........................... 1/1
  obtenerConsultaPorIdCita - Casos Normales ........................ 1/1
  obtenerConsultaPorIdCita - Casos Límite .......................... 3/3
  obtenerConsultaPorIdCita - Casos de Excepción .................... 1/1

-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
consulta.service.ts|     100 |      100 |     100 |     100 |                   |
consulta.controller.ts|     100 |      100 |     100 |     100 |                   |
-------------------|---------|----------|---------|---------|-------------------
Test Suites: 2 passed, 2 total
Tests: 58 passed, 58 total
```

## Dependencies & Mocking Strategy

### External Dependencies Mocked
- **Database Models**: Consulta, Cita, Horario models fully mocked
- **Sequelize Transactions**: Transaction lifecycle mocked
- **Express Objects**: Request/Response objects mocked for controller tests
- **JWT Authentication**: User context mocked in requests

### Mock Implementation
```typescript
// Service layer mocks all database operations
jest.mock('../../../model/Consulta', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

// Controller layer mocks service dependencies
jest.mock('../../../service/ConsultaService', () => ({
  iniciarConsulta: jest.fn(),
  actualizarConsulta: jest.fn(),
  calificarConsulta: jest.fn(),
  obtenerConsultaPorIdCita: jest.fn(),
}));
```

## AAA Testing Pattern

All tests follow the Arrange-Act-Assert pattern:

```typescript
describe('iniciarConsulta - Casos Normales', () => {
  it('should initiate consultation successfully', async () => {
    // Arrange - Setup mocks and input data
    const idCita = 1;
    const motivo = 'Consulta de rutina';
    const idMedico = 1;

    const mockCita = { id_cita: idCita, id_horario: 1, estado: 'PENDIENTE' };
    const mockHorario = { id_horario: 1, id_medico: idMedico, modalidad: 'PRESENCIAL' };
    const mockConsulta = { id_consulta: 1, id_cita: idCita, estado: 'INICIADO' };

    mockCitaFindOne.mockResolvedValue(mockCita);
    mockHorarioFindOne.mockResolvedValue(mockHorario);
    mockConsultaFindOne.mockResolvedValue(null);
    mockConsultaCreate.mockResolvedValue(mockConsulta);

    // Act - Execute the function under test
    const result = await ConsultaService.iniciarConsulta(idCita, motivo, idMedico);

    // Assert - Verify expected outcomes
    expect(result).toEqual(mockConsulta);
    expect(mockCitaFindOne).toHaveBeenCalledWith({
      where: { id_cita: idCita },
      transaction: expect.any(Object)
    });
  });
});
```

## Mock Data Factories

Consistent mock data factories ensure test reliability:

```typescript
// Mock consultation factory
const createMockConsulta = (overrides = {}) => ({
  id_consulta: 1,
  id_cita: 1,
  motivo: 'Consulta de rutina',
  estado: 'INICIADO',
  fecha_registro: new Date(),
  fecha_actualizacion: new Date(),
  ...overrides
});

// Mock appointment factory
const createMockCita = (overrides = {}) => ({
  id_cita: 1,
  id_paciente: 1,
  id_horario: 1,
  estado: 'PENDIENTE',
  modalidad: 'PRESENCIAL',
  ...overrides
});
```

## Error Scenarios Covered

### Service Layer Errors
- Database connection failures
- Transaction deadlocks
- Foreign key constraint violations
- Unique constraint violations

### Controller Layer Errors
- Invalid request parameters
- Missing authentication
- Malformed JSON payloads
- Invalid ID formats

### Business Logic Errors
- Authorization failures
- State transition violations
- Validation rule breaches
- Data consistency issues

## Performance Considerations

- Tests use mocked dependencies to avoid database calls
- Parallel test execution enabled
- Minimal test data to reduce memory usage
- Fast mock setup and teardown

## Maintenance Guidelines

- Keep mock data factories updated with model changes
- Add new test cases for new business rules
- Maintain AAA pattern consistency
- Update coverage requirements as code evolves
- Document complex test scenarios

## Integration with CI/CD

These tests are designed to run in automated pipelines:

```yaml
# Example GitHub Actions step
- name: Run Consulta Tests
  run: npm test -- src/__tests__/service/consulta/ src/__tests__/controller/consulta/
  env:
    JWT_SECRET: test-secret-key
    NODE_ENV: test
```

## Troubleshooting

### Common Issues
- **Mock not reset**: Ensure `jest.clearAllMocks()` in `afterEach`
- **Environment variables**: Check `.env.test` file exists
- **Dependencies**: Run `npm install` after pulling changes
- **Coverage**: Use `npm run test:coverage` for detailed reports

### Debug Mode
```bash
# Run with verbose output
npm test -- --verbose src/__tests__/service/consulta/

# Run single failing test
npm test -- --testNamePattern="exact test name"
```

This comprehensive test suite ensures the Consulta module is thoroughly tested, maintainable, and ready for production deployment.