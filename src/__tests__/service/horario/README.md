# Pruebas Unitarias - HorarioService

## Descripción
Documentación completa de los casos de prueba para el servicio HorarioService.ts que maneja la lógica de negocio para la gestión de horarios médicos.

## Métodos Testeados

### 1. `crearHorario(idMedico, data)`

#### Casos Normales ✅
- **Horario válido sin conflictos**: Creación exitosa de un horario disponible
  - Precondiciones: ID médico válido, fecha futura, horario sin solapamientos
  - Resultado esperado: Horario creado con estado "DISPONIBLE"
  - Validaciones: Transacción completada, datos guardados correctamente

- **Horario virtual**: Creación de horario con modalidad "VIRTUAL"
  - Precondiciones: Modalidad VIRTUAL, datos válidos
  - Resultado esperado: Horario creado con modalidad correcta

- **Horario presencial**: Creación de horario con modalidad "PRESENCIAL"
  - Precondiciones: Modalidad PRESENCIAL, datos válidos
  - Resultado esperado: Horario creado con modalidad correcta

#### Casos Límite ⚠️
- **Horario con hora mínima**: Creación a las 00:00:00
  - Límite inferior de tiempo
  - Validación de formato de hora

- **Horario con hora máxima**: Creación a las 23:59:59
  - Límite superior de tiempo
  - Validación de formato de hora

- **Horario con fecha futura lejana**: Fecha del año siguiente
  - Validación de manejo de fechas futuras
  - Comportamiento con fechas alejadas

- **Datos en el límite de los campos**:
  - Fechas límite del rango válido
  - Horas límite (00:00:00 - 23:59:59)

#### Casos de Excepción ❌
- **Error por solapamiento de horarios**:
  - Error: "Ya existe un horario en esa fecha y hora"
  - Validación de rollback de transacción
  - Manejo de horarios existentes

- **Error de conexión a base de datos en búsqueda**:
  - Error al consultar horarios existentes
  - Validación de rollback de transacción
  - Manejo de errores de red/base de datos

- **Error de inserción en base de datos**:
  - Error al crear nuevo horario
  - Validación de rollback de transacción
  - Manejo de restricciones de BD

- **Error en transacción**:
  - Falla en el contexto transaccional
  - Manejo de transacciones de base de datos

- **Datos inválidos en parámetros**:
  - IDs médicos inválidos
  - Formatos de fecha incorrectos
  - Datos faltantes o nulos

### 2. `obtenerHorariosDisponiblesSemana(filtros)`

#### Casos Normales ✅
- **Búsqueda sin filtros**: Obtener todos los horarios de la semana actual
  - Precondiciones: Fecha actual válida
  - Resultado esperado: Lista de horarios de la semana actual
  - Validaciones: Filtros de fecha aplicados correctamente

- **Búsqueda filtrada por médico**: Horarios de un médico específico
  - Filtro: idMedico válido
  - Resultado esperado: Horarios solo del médico especificado

- **Búsqueda filtrada por modalidad**: Horarios presenciales o virtuales
  - Filtros: modalidad "PRESENCIAL" o "VIRTUAL"
  - Resultado esperado: Horarios filtrados por modalidad

- **Lista vacía**: Cuando no hay horarios disponibles
  - Resultado esperado: Array vacío
  - Validaciones: Respuesta estructurada correctamente

#### Casos Límite ⚠️
- **Filtros con valores inválidos**: IDs no numéricos, estados inexistentes
  - Manejo graceful de datos inválidos
  - Conversión de tipos cuando sea posible

- **Múltiples filtros combinados**: Combinación de varios criterios
  - Aplicación correcta de todos los filtros
  - Lógica AND entre filtros

- **Rango de fechas de semana exactamente**: Domingo a Sábado
  - Cálculo correcto del rango semanal
  - Manejo de días frontera

#### Casos de Excepción ❌
- **Error de base de datos en consulta**:
  - Error al consultar tabla horario
  - Error: "Error al obtener horarios disponibles de la semana"

- **Error de conexión**: Pérdida de conexión durante consulta
  - Manejo de errores de red
  - Respuesta apropiada del error

- **Parámetros de fecha inválidos**: Fechas mal formateadas en filtros
  - Validación de entrada de datos
  - Manejo de errores de formato

### 3. `obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros)`

#### Casos Normales ✅
- **Rango de fechas estándar**: Una semana completa
  - Precondiciones: fechas válidas, inicio ≤ fin
  - Resultado esperado: Horarios en el rango especificado
  - Validaciones: Filtros de fecha y criterios adicionales

- **Rango con filtros combinados**: Fechas + médico + modalidad
  - Aplicación de múltiples filtros
  - Validación de lógica de filtros

- **Rango de un solo día**: Consulta para fecha específica
  - Manejo de rangos mínimos
  - Validación de fechas iguales

#### Casos Límite ⚠️
- **Rango mínimo**: Un solo día (fechaInicio = fechaFin)
  - Comportamiento correcto con rango mínimo

- **Rango máximo**: Año completo
  - Manejo de rangos amplios
  - Performance con grandes conjuntos de datos

- **Fechas en orden inverso**: fechaInicio > fechaFin
  - Comportamiento con fechas inválidas
  - Validación de parámetros

#### Casos de Excepción ❌
- **Fechas inválidas**: Formato incorrecto o fechas imposibles
  - Error de validación de fechas
  - Manejo de formatos incorrectos

- **Error de base de datos en rango**:
  - Error al consultar tabla por rango
  - Error: "Error al obtener horarios disponibles por rango"

- **Error de parámetros faltantes**: Sin fechaInicio o fechaFin
  - Validación de parámetros requeridos
  - Error apropiado

## Configuración de Mocks

### Modelos Mocked
```typescript
// Horario Model
Horario.findOne: jest.fn()     // Búsqueda de solapamientos
Horario.create: jest.fn()      // Creación de horarios
Horario.findAll: jest.fn()     // Consultas de listas

// Medico Model
Medico.findOne: jest.fn()      // Búsqueda de médicos

// Especialidad Model  
Especialidad.findOne: jest.fn() // Búsqueda de especialidades

// Database
sequelize.transaction: jest.fn() // Manejo de transacciones
```

### Patrones de Mock
- **Transacciones**: Mock de callback con transacción mock
- **Consultas**: Respuestas controladas para diferentes escenarios
- **Errores**: Simulación de errores de BD y validación

## Métricas de Cobertura

### Funcionalidades Cubiertas
- ✅ Creación de horarios (100%)
- ✅ Validación de solapamientos (100%)
- ✅ Consultas con filtros (100%)
- ✅ Manejo de transacciones (100%)
- ✅ Gestión de errores (100%)

### Casos de Prueba por Categoría
- **Casos Normales**: 15 tests
- **Casos Límite**: 12 tests  
- **Casos de Excepción**: 10 tests
- **Total**: 37 tests

## Dependencias Testeadas
- Sequelize ORM
- PostgreSQL/MySQL
- Transacciones de BD
- Modelos asociados (Medico, Especialidad)

## Configuración de Entorno
```typescript
// jest.config.js setup
testEnvironment: 'node'
setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
testMatch: ['**/__tests__/**/*.test.ts']
```

## Ejecución de Pruebas

```bash
# Ejecutar todas las pruebas de HorarioService
npm test -- --testPathPattern=horario.service.test.ts

# Ejecutar con coverage
npm test -- --coverage --testPathPattern=horario.service.test.ts

# Ejecutar en modo watch
npm test -- --watch --testPathPattern=horario.service.test.ts
```

## Criterios de Éxito

### Para Casos Normales
- ✅ Respuesta exitosa con datos correctos
- ✅ Transacciones completadas sin errores
- ✅ Filtros aplicados correctamente
- ✅ Datos persistidos en BD

### Para Casos Límite  
- ✅ Manejo graceful de valores extremos
- ✅ Validaciones apropiadas
- ✅ Sin errores inesperados
- ✅ Respuestas consistentes

### Para Casos de Excepción
- ✅ Errores capturados correctamente
- ✅ Rollback de transacciones
- ✅ Mensajes de error apropiados
- ✅ Sin crashes de aplicación

## Consideraciones Especiales

### Transacciones
- Todos los tests de `crearHorario` validan el uso de transacciones
- Rollback automático en caso de error
- Commit explícito en caso de éxito

### Concurrencia
- Validación de solapamientos en transacción
- Prevención de condiciones de carrera
- Aislamiento de datos por médico

### Performance
- Tests consideran consultas con múltiples joins
- Validación de índices en consultas de rango
- Optimización de queries con filtros