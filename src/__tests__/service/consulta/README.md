# Pruebas del Módulo Consulta - Documentación Completa

## Descripción General

Este directorio contiene pruebas unitarias completas para el módulo Consulta, incluyendo tanto las capas de servicio como de controlador. Las pruebas aseguran cobertura completa de la funcionalidad de consultas médicas en la plataforma de salud.

## Qué Hace el Módulo Consulta

El módulo Consulta gestiona el ciclo de vida completo de las consultas médicas:

### Funcionalidad Principal

1. **Inicio de Consulta** (`iniciarConsulta`)
   - Inicia una nueva consulta para una cita programada
   - Valida que la cita existe y pertenece al médico solicitante
   - Asegura que no hay consultas duplicadas para la misma cita
   - Actualiza el estado de la cita a CONFIRMADA

2. **Actualizaciones de Consulta** (`actualizarConsulta`)
   - Permite a los médicos actualizar el progreso y detalles de la consulta
   - Soporta diferentes flujos de trabajo para consultas PRESENCIAL vs VIRTUAL
   - Gestiona transiciones de estado (INICIADO → EN_REVISION → DIAGNOSTICADA → FINALIZADA)
   - Actualiza estados relacionados de cita y horario cuando la consulta se finaliza

3. **Calificación de Consulta** (`calificarConsulta`)
   - Permite a los pacientes calificar consultas completadas (escala 1-10)
   - Valida que solo los pacientes pueden calificar sus propias consultas
   - Previene calificaciones duplicadas
   - Solo permite calificar consultas FINALIZADA

4. **Recuperación de Consulta** (`obtenerConsultaPorIdCita`)
   - Obtiene detalles de consulta por ID de cita
   - Incluye información relacionada de la cita
   - Usado para mostrar historial y detalles de consulta

### Reglas de Negocio

- **Autorización**: Los médicos solo pueden modificar consultas de sus propios horarios
- **Gestión de Estado**: Reglas estrictas de transición de estado basadas en modalidad de consulta
- **Integridad de Datos**: Todas las operaciones usan transacciones de base de datos
- **Validación**: Validación completa de entrada y aplicación de reglas de negocio

## Estructura de Pruebas

### Casos Normales
- ✅ Operaciones exitosas con entradas válidas y flujo de datos esperado
- ✅ Todas las operaciones CRUD funcionando correctamente
- ✅ Autorización apropiada y transiciones de estado

### Casos Límite
- ✅ Valores límite (límites de calificación: 1-10)
- ✅ Campos opcionales faltantes manejados con elegancia
- ✅ Resultados vacíos y escenarios válidos raros
- ✅ Casos límite de transición de estado

### Casos de Excepción
- ✅ Fallos de base de datos y rollbacks de transacción
- ✅ Errores de validación para entradas inválidas
- ✅ Violaciones de autorización
- ✅ Estados inesperados y condiciones de error

## Metas de Cobertura de Pruebas

El conjunto de pruebas logra **100% de cobertura** para:
- **Líneas**: Cada línea ejecutable probada
- **Sentencias**: Todas las sentencias ejecutadas
- **Ramas**: Todas las ramas condicionales cubiertas
- **Funciones**: Todos los métodos probados exhaustivamente

## Ejecutando las Pruebas

### Prerrequisitos
- Node.js y npm instalados
- Todas las dependencias instaladas: `npm install`

### Variables de Entorno Requeridas
Crear un archivo `.env.test` en la raíz del proyecto:
```
JWT_SECRET=test-secret-key
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
```

### Comandos de Ejecución

```bash
# Ejecutar todas las pruebas de Consulta (servicio + controlador)
npm test -- src/__tests__/service/consulta/ src/__tests__/controller/consulta/

# Ejecutar con reporte de cobertura
npm run test:coverage -- src/__tests__/service/consulta/ src/__tests__/controller/consulta/

# Ejecutar archivo de prueba específico
npm test -- src/__tests__/service/consulta/consulta.service.test.ts

# Ejecutar suite de pruebas específico
npm test -- --testNamePattern="iniciarConsulta.*Normal"

# Ejecutar pruebas en modo watch
npm run test:watch -- src/__tests__/service/consulta/
```

### Reporte de Cobertura
Después de ejecutar pruebas con cobertura, acceder a reportes en:
- **Reporte HTML**: `coverage/lcov-report/index.html`
- **Reporte de Texto**: `coverage/coverage.txt`
- **Reporte JSON**: `coverage/coverage-final.json`

## Ejemplo de Salida de Prueba

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

## Dependencias y Estrategia de Simulación

### Dependencias Externas Simuladas
- **Modelos de Base de Datos**: Modelos Consulta, Cita, Horario completamente simulados
- **Transacciones Sequelize**: Ciclo de vida de transacción simulado
- **Objetos Express**: Objetos Request/Response simulados para pruebas de controlador
- **Autenticación JWT**: Contexto de usuario simulado en solicitudes

### Implementación de Simulación
```typescript
// Capa de servicio simula todas las operaciones de BD
jest.mock('../../../model/Consulta', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

// Capa de controlador simula dependencias de servicio
jest.mock('../../../service/ConsultaService', () => ({
  iniciarConsulta: jest.fn(),
  actualizarConsulta: jest.fn(),
  calificarConsulta: jest.fn(),
  obtenerConsultaPorIdCita: jest.fn(),
}));
```

## Patrón de Pruebas AAA

Todas las pruebas siguen el patrón Arrange-Act-Assert:

```typescript
describe('iniciarConsulta - Casos Normales', () => {
  it('should initiate consultation successfully', async () => {
    // Arrange - Configurar simulaciones y datos de entrada
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

    // Act - Ejecutar la función bajo prueba
    const result = await ConsultaService.iniciarConsulta(idCita, motivo, idMedico);

    // Assert - Verificar resultados esperados
    expect(result).toEqual(mockConsulta);
    expect(mockCitaFindOne).toHaveBeenCalledWith({
      where: { id_cita: idCita },
      transaction: expect.any(Object)
    });
  });
});
```

## Fábricas de Datos de Simulación

Fábricas de datos de simulación consistentes aseguran confiabilidad de pruebas:

```typescript
// Fábrica de consulta simulada
const createMockConsulta = (overrides = {}) => ({
  id_consulta: 1,
  id_cita: 1,
  motivo: 'Consulta de rutina',
  estado: 'INICIADO',
  fecha_registro: new Date(),
  fecha_actualizacion: new Date(),
  ...overrides
});

// Fábrica de cita simulada
const createMockCita = (overrides = {}) => ({
  id_cita: 1,
  id_paciente: 1,
  id_horario: 1,
  estado: 'PENDIENTE',
  modalidad: 'PRESENCIAL',
  ...overrides
});
```

## Escenarios de Error Cubiertos

### Errores de Capa de Servicio
- Fallos de conexión a base de datos
- Deadlocks de transacción
- Violaciones de restricciones de clave foránea
- Violaciones de restricciones únicas

### Errores de Capa de Controlador
- Parámetros de solicitud inválidos
- Autenticación faltante
- Payloads JSON malformados
- Formatos de ID inválidos

### Errores de Lógica de Negocio
- Fallos de autorización
- Violaciones de transición de estado
- Incumplimientos de reglas de validación
- Problemas de consistencia de datos

## Consideraciones de Performance

- Las pruebas usan dependencias simuladas para evitar llamadas a BD
- Ejecución paralela de pruebas habilitada
- Datos de prueba mínimos para reducir uso de memoria
- Configuración y limpieza de simulaciones rápidas

## Guías de Mantenimiento

- Mantener fábricas de datos de simulación actualizadas con cambios de modelo
- Agregar nuevos casos de prueba para nuevas reglas de negocio
- Mantener consistencia del patrón AAA
- Actualizar requisitos de cobertura conforme evoluciona el código
- Documentar escenarios de prueba complejos

## Integración con CI/CD

Estas pruebas están diseñadas para ejecutarse en pipelines automatizados:

```yaml
# Ejemplo de paso de GitHub Actions
- name: Run Consulta Tests
  run: npm test -- src/__tests__/service/consulta/ src/__tests__/controller/consulta/
  env:
    JWT_SECRET: test-secret-key
    NODE_ENV: test
```

## Solución de Problemas

### Problemas Comunes
- **Simulación no reseteada**: Asegurar `jest.clearAllMocks()` en `afterEach`
- **Variables de entorno**: Verificar que existe archivo `.env.test`
- **Dependencias**: Ejecutar `npm install` después de hacer pull de cambios
- **Cobertura**: Usar `npm run test:coverage` para reportes detallados

### Modo Debug
```bash
# Ejecutar con salida verbose
npm test -- --verbose src/__tests__/service/consulta/

# Ejecutar prueba fallida individual
npm test -- --testNamePattern="exact test name"
```

Este conjunto de pruebas completo asegura que el módulo Consulta esté completamente probado, mantenible y listo para despliegue en producción.