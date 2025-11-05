# Pruebas Unitarias - CitaService

## Descripción General

Este directorio contiene pruebas unitarias completas para la clase `CitaService`, que maneja las operaciones de gestión de citas en el sistema de salud.

## Qué Hace el Módulo Cita

El módulo Cita gestiona el ciclo de vida de las citas dentro de la plataforma de salud:

- **Creación de Citas**: Permite a los pacientes programar citas usando espacios de tiempo existentes o creando nuevos
- **Recuperación de Citas**: Proporciona métodos para obtener citas por paciente o médico
- **Cancelación de Citas**: Permite a los pacientes cancelar sus citas y liberar espacios de tiempo

### Características Clave

1. **Programación Flexible**: Los pacientes pueden elegir espacios de tiempo disponibles existentes o solicitar nuevas horas de cita
2. **Prevención de Conflictos**: Valida que no existan citas superpuestas para el mismo médico
3. **Gestión de Estado**: Rastrea estados de cita (PENDIENTE, CONFIRMADA, CANCELADA, ATENDIDA)
4. **Autorización**: Asegura que los pacientes solo puedan gestionar sus propias citas
5. **Gestión de Recursos**: Gestiona automáticamente la disponibilidad de espacios de horario

## Estructura de Pruebas

### Casos Normales
- ✅ Creación exitosa de cita usando horario disponible existente
- ✅ Creación exitosa de cita con creación de nuevo horario
- ✅ Recuperación exitosa de citas para pacientes y médicos
- ✅ Cancelación exitosa de cita con liberación de horario

### Casos Límite
- ✅ Manejo de conflictos de horario y superposiciones
- ✅ Ignorar horarios cancelados en validación de conflictos
- ✅ Gestión de citas con diferentes modalidades (PRESENCIAL/VIRTUAL)
- ✅ Validación de límites para espacios de tiempo y fechas

### Casos de Excepción
- ✅ Fallos de base de datos y rollbacks de transacción
- ✅ Selecciones de horario inválidas
- ✅ Violaciones de autorización
- ✅ Entidades relacionadas faltantes

## Cobertura de Pruebas

Las pruebas logran 100% de cobertura para:
- **Líneas**: Todas las líneas ejecutables son probadas
- **Sentencias**: Todas las sentencias son ejecutadas
- **Ramas**: Todas las ramas condicionales están cubiertas
- **Funciones**: Todos los métodos son probados

## Ejecutando las Pruebas

### Prerrequisitos
- Node.js y npm instalados
- Dependencias instaladas: `npm install`

### Variables de Entorno
Crear un archivo `.env.test` con:
```
JWT_SECRET=test-secret-key
NODE_ENV=test
```

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas de CitaService
npm test -- src/__tests__/service/cita/cita.service.test.ts

# Ejecutar con cobertura
npm run test:coverage -- src/__tests__/service/cita/cita.service.test.ts

# Ejecutar suite de pruebas específico
npm test -- --testNamePattern="crearCitaConHorario"
```

### Reporte de Cobertura
Después de ejecutar pruebas con cobertura, ver el reporte en:
- **Reporte HTML**: `coverage/lcov-report/index.html`
- **Salida de Consola**: Muestra porcentajes de cobertura en terminal

## Ejemplo de Salida de Prueba

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

## Dependencias Simuladas

- **Modelo Cita**: Todas las operaciones CRUD simuladas
- **Modelo Horario**: Búsquedas y actualizaciones de horario simuladas
- **Modelo Medico**: Información de médico simulada
- **Modelo Usuario**: Datos de usuario simulados
- **Modelo Paciente**: Datos de paciente simulados
- **Modelo Consulta**: Datos de consulta simulados
- **Transacciones de Base de Datos**: Manejo de transacciones Sequelize simulado

## Patrón AAA

Todas las pruebas siguen el patrón Arrange-Act-Assert:

```typescript
it('should create appointment successfully using existing schedule', async () => {
  // Arrange - Configurar simulaciones y datos de prueba
  const idPaciente = 1;
  const data = { idHorario: 1, idMedico: 1, titulo: 'Consulta General', ... };

  const mockHorario = { id_horario: 1, estado: 'DISPONIBLE', update: jest.fn() };
  const mockCita = { id_cita: 1, id_paciente: idPaciente, ... };

  mockHorarioFindOne.mockResolvedValue(mockHorario);
  mockCitaFindOne.mockResolvedValue(null);
  mockCitaCreate.mockResolvedValue(mockCita);

  // Act - Ejecutar el método
  const result = await CitaService.crearCitaConHorario(idPaciente, data);

  // Assert - Verificar comportamiento esperado
  expect(result).toEqual(mockCita);
  expect(mockHorario.update).toHaveBeenCalledWith(
    { estado: 'OCUPADO', titulo: 'Consulta General' },
    { transaction: expect.any(Object) }
  );
});
```

## Fábricas de Simulación

Las pruebas utilizan fábricas de datos de simulación consistentes para:
- Citas simuladas con diferentes estados
- Horarios simulados con varios estados de disponibilidad
- Médicos simulados con información de usuario
- Pacientes simulados con información de usuario
- Transacciones simuladas con comportamiento commit/rollback

Esto asegura confiabilidad y mantenibilidad de las pruebas.