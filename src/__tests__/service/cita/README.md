# Cita Service Tests

## Overview

This directory contains comprehensive unit tests for the `CitaService` class, which handles appointment management operations in the healthcare system.

## What the Cita Module Does

The Cita module manages the appointment lifecycle within the healthcare platform:

- **Creating Appointments**: Allows patients to schedule appointments using existing time slots or creating new ones
- **Retrieving Appointments**: Provides methods to fetch appointments by patient or doctor
- **Canceling Appointments**: Enables patients to cancel their appointments and free up time slots

### Key Features

1. **Flexible Scheduling**: Patients can choose existing available time slots or request new appointment times
2. **Conflict Prevention**: Validates that no overlapping appointments exist for the same doctor
3. **State Management**: Tracks appointment states (PENDIENTE, CONFIRMADA, CANCELADA, ATENDIDA)
4. **Authorization**: Ensures patients can only manage their own appointments
5. **Resource Management**: Automatically manages schedule slot availability

## Test Structure

### Normal Cases
- ✅ Successful appointment creation using existing available schedule
- ✅ Successful appointment creation with new schedule creation
- ✅ Successful appointment retrieval for patients and doctors
- ✅ Successful appointment cancellation with schedule liberation

### Edge Cases
- ✅ Handling schedule conflicts and overlaps
- ✅ Ignoring cancelled schedules in conflict validation
- ✅ Managing appointments with different modalities (PRESENCIAL/VIRTUAL)
- ✅ Boundary validation for time slots and dates

### Exception Cases
- ✅ Database failures and transaction rollbacks
- ✅ Invalid schedule selections
- ✅ Authorization violations
- ✅ Missing related entities

## Test Coverage

The tests achieve 100% coverage for:
- **Lines**: All executable lines are tested
- **Statements**: All statements are executed
- **Branches**: All conditional branches are covered
- **Functions**: All methods are tested

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
# Run all CitaService tests
npm test -- src/__tests__/service/cita/cita.service.test.ts

# Run with coverage
npm run test:coverage -- src/__tests__/service/cita/cita.service.test.ts

# Run specific test suite
npm test -- --testNamePattern="crearCitaConHorario"
```

### Coverage Report
After running tests with coverage, view the report at:
- **HTML Report**: `coverage/lcov-report/index.html`
- **Console Output**: Shows coverage percentages in terminal

## Test Output Example

```
PASS src/__tests__/service/cita/cita.service.test.ts
CitaService - Tests Completos
  crearCitaConHorario - Casos Normales
    ✅ debería crear cita exitosamente usando horario existente disponible (5ms)
    ✅ debería crear cita exitosamente creando nuevo horario
  crearCitaConHorario - Casos Límite
    ✅ debería lanzar error cuando horario seleccionado no está disponible
    ✅ debería lanzar error cuando ya existe horario en la misma fecha y hora
    ✅ debería lanzar error cuando ya existe cita activa para el horario
    ✅ debería manejar creación de horario ignorando horarios cancelados
  ...

-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
cita.service.ts    |     100 |      100 |     100 |     100 |                   |
-------------------|---------|----------|---------|---------|-------------------
```

## Dependencies Mocked

- **Cita Model**: All CRUD operations mocked
- **Horario Model**: Schedule lookups and updates mocked
- **Medico Model**: Doctor information mocked
- **Usuario Model**: User data mocked
- **Paciente Model**: Patient data mocked
- **Consulta Model**: Consultation data mocked
- **Database Transactions**: Sequelize transaction handling mocked

## AAA Pattern

All tests follow the Arrange-Act-Assert pattern:

```typescript
it('should create appointment successfully using existing schedule', async () => {
  // Arrange - Setup mocks and test data
  const idPaciente = 1;
  const data = { idHorario: 1, idMedico: 1, titulo: 'Consulta General', ... };

  const mockHorario = { id_horario: 1, estado: 'DISPONIBLE', update: jest.fn() };
  const mockCita = { id_cita: 1, id_paciente: idPaciente, ... };

  mockHorarioFindOne.mockResolvedValue(mockHorario);
  mockCitaFindOne.mockResolvedValue(null);
  mockCitaCreate.mockResolvedValue(mockCita);

  // Act - Execute the method
  const result = await CitaService.crearCitaConHorario(idPaciente, data);

  // Assert - Verify expected behavior
  expect(result).toEqual(mockCita);
  expect(mockHorario.update).toHaveBeenCalledWith(
    { estado: 'OCUPADO', titulo: 'Consulta General' },
    { transaction: expect.any(Object) }
  );
});
```

## Mock Factories

The tests use consistent mock data factories for:
- Mock appointments with different states
- Mock schedules with various availability statuses
- Mock doctors with user information
- Mock patients with user information
- Mock transactions with commit/rollback behavior

This ensures test reliability and maintainability.