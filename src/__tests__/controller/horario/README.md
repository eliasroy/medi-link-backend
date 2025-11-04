# Pruebas Unitarias - HorarioController

## Descripción
Documentación completa de los casos de prueba para el controlador HorarioController.ts que maneja las rutas HTTP y validación de requests para la gestión de horarios médicos.

## Métodos Testeados

### 1. `crearHorario(req, res)`

#### Casos Normales ✅
- **Creación exitosa de horario presencial**: HTTP 201
  - Precondiciones: Request válido con datos completos, usuario autenticado
  - Request body: fecha, hora_inicio, hora_fin, modalidad válidos
  - Resultado esperado: HTTP 201, JSON con success:true y datos del horario
  - Validaciones: Llamada correcta al service, extracción de userId del token

- **Creación exitosa de horario virtual**: HTTP 201
  - Modalidad: "VIRTUAL"
  - Validación de manejo correcto de modalidades diferentes

- **Creación con todos los campos**: Incluyendo título
  - Validación de campos opcionales
  - Manejo completo del request body

#### Casos Límite ⚠️
- **Horario con hora mínima**: 00:00:00
  - Límite inferior de tiempo
  - Validación de formato de hora

- **Horario con hora máxima**: 23:59:59
  - Límite superior de tiempo
  - Validación de formato extremo

- **Fecha futura lejana**: Año siguiente
  - Manejo de fechas distantes
  - Validación de formato de fecha

- **Usuario con ID límite**: ID muy alto
  - Validación con valores extremos de ID

#### Casos de Excepción ❌
- **Error de validación de horario existente**: HTTP 400
  - Error del service: "Ya existe un horario en esa fecha y hora"
  - Resultado esperado: HTTP 400, success:false

- **Error de validación de datos**: HTTP 400
  - Formatos inválidos de fecha/hora
  - Datos faltantes o incorrectos

- **Error de base de datos**: HTTP 400
  - Errores de inserción en BD
  - Manejo de errores transaccionales

- **Error del service**: HTTP 400
  - Cualquier error thrown por el service
  - Propagación correcta de errores

### 2. `obtenerHorariosDisponiblesSemana(req, res)`

#### Casos Normales ✅
- **Consulta sin filtros**: HTTP 200
  - Query params: vacíos
  - Resultado esperado: HTTP 200, todos los horarios de la semana
  - Validaciones: Llamada al service con filtros vacíos

- **Consulta filtrada por médico**: HTTP 200
  - Query: idMedico="1"
  - Resultado esperado: Horarios solo del médico especificado
  - Conversión correcta de string a number

- **Consulta filtrada por modalidad**: HTTP 200
  - Query: modalidad="VIRTUAL"
  - Resultado esperado: Horarios filtrados por modalidad

- **Consulta con múltiples filtros**: HTTP 200
  - Query: idMedico, estado, modalidad
  - Resultado esperado: Horarios que cumplan todos los criterios

- **Lista vacía**: HTTP 200
  - Sin horarios disponibles
  - Resultado esperado: data:[], total:0

#### Casos Límite ⚠️
- **Filtros con valores inválidos**: NaN para IDs
  - Query: idMedico="invalid"
  - Comportamiento: Conversión a NaN, manejo graceful

- **Filtros con estados inexistentes**: HTTP 200
  - Query: estado="INEXISTENTE"
  - Resultado esperado: Lista vacía (comportamiento del service)

- **Múltiples filtros contradictorios**: HTTP 200
  - Combinaciones que no devuelvan resultados
  - Validación de lógica de filtros

#### Casos de Excepción ❌
- **Error de base de datos**: HTTP 500
  - Error del service en consulta
  - Resultado esperado: HTTP 500, success:false

- **Error de conexión**: HTTP 500
  - Pérdida de conexión durante consulta
  - Propagación correcta del error

### 3. `obtenerHorariosDisponiblesPorRango(req, res)`

#### Casos Normales ✅
- **Rango de fechas válido**: HTTP 200
  - Query: fechaInicio, fechaFin válidos
  - Resultado esperado: HTTP 200, horarios en el rango

- **Rango con filtros adicionales**: HTTP 200
  - Query: fechas + idMedico + modalidad
  - Aplicación correcta de todos los filtros

- **Rango de un día**: HTTP 200
  - Query: fechaInicio = fechaFin
  - Resultado esperado: Horarios de esa fecha específica

- **Rango amplio**: HTTP 200
  - Query: fechas con diferencia de meses/años
  - Validación de manejo de rangos grandes

#### Casos Límite ⚠️
- **Rango con fechas inversas**: HTTP 200
  - Query: fechaInicio > fechaFin
  - Comportamiento del service (posible error o resultado vacío)

- **Rango con un día de diferencia**: HTTP 200
  - Validación de rangos mínimos

- **Filtros en valores límite**: IDs muy altos, modalidades exactas

#### Casos de Excepción ❌
- **Fechas faltantes**: HTTP 400
  - Sin fechaInicio: "fechaInicio y fechaFin son requeridos"
  - Sin fechaFin: mismo mensaje de error
  - Sin ambas fechas: mismo mensaje

- **Una fecha faltante**: HTTP 400
  - Solo fechaInicio: error
  - Solo fechaFin: error

- **Error de base de datos**: HTTP 500
  - Error del service en consulta por rango
  - Propagación del error interno

- **Error de conexión**: HTTP 500
  - Manejo de errores de red en consultas

## Configuración de Mocks

### Services Mocked
```typescript
// HorarioService
crearHorario: jest.fn()                    // Creación de horarios
obtenerHorariosDisponiblesSemana: jest.fn() // Consulta semanal
obtenerHorariosDisponiblesPorRango: jest.fn() // Consulta por rango
```

### Patrones de Mock
- **Requests**: Mocks de Express Request con diferentes configuraciones
- **Responses**: Mocks de Express Response para validar status y JSON
- **User Context**: Mock de usuario autenticado (req.user.id)
- **Query Parameters**: Simulación de diferentes query strings

### Helper Functions
```typescript
createMockRequest(body, query, user)  // Crea request mockeado
createMockResponse()                   // Crea response mockeado
```

## Métricas de Cobertura

### Endpoints Cubiertos
- ✅ POST /horarios (crearHorario) - 100%
- ✅ GET /horarios/semana (obtenerHorariosDisponiblesSemana) - 100%
- ✅ GET /horarios/rango (obtenerHorariosDisponiblesPorRango) - 100%

### Validaciones Cubiertas
- ✅ Extracción de userId del token
- ✅ Validación de query parameters
- ✅ Validación de request body
- ✅ Validación de parámetros requeridos
- ✅ Manejo de errores del service
- ✅ Formatos de respuesta HTTP

### Casos de Prueba por Categoría
- **Casos Normales**: 14 tests
- **Casos Límite**: 10 tests
- **Casos de Excepción**: 12 tests
- **Total**: 36 tests

## Patrones de Request/Response

### Request Structure
```typescript
// Crear Horario
{
  body: {
    titulo?: string,
    fecha: string,        // 'YYYY-MM-DD'
    hora_inicio: string,  // 'HH:mm:ss'
    hora_fin: string,     // 'HH:mm:ss'
    modalidad: "PRESENCIAL" | "VIRTUAL"
  },
  user: { id: number }    // Del token de autenticación
}

// Obtener Horarios
{
  query: {
    idMedico?: string,
    estado?: string,
    modalidad?: "PRESENCIAL" | "VIRTUAL"
  }
}

// Obtener por Rango
{
  query: {
    fechaInicio: string,  // 'YYYY-MM-DD' - REQUERIDO
    fechaFin: string,     // 'YYYY-MM-DD' - REQUERIDO
    idMedico?: string,
    estado?: string,
    modalidad?: "PRESENCIAL" | "VIRTUAL"
  }
}
```

### Response Structure
```typescript
// Success Response
{
  success: true,
  data: Horario[],
  total: number
}

// Error Response
{
  success: false,
  message: string
}
```

## HTTP Status Codes

### Success Codes
- **201 Created**: Horario creado exitosamente
- **200 OK**: Consultas exitosas

### Client Error Codes
- **400 Bad Request**: 
  - Parámetros faltantes (fechas en rango)
  - Errores de validación del service
  - Datos inválidos en request

### Server Error Codes
- **500 Internal Server Error**:
  - Errores de base de datos
  - Errores de conexión
  - Errores inesperados del service

## Ejecución de Pruebas

```bash
# Ejecutar todas las pruebas de HorarioController
npm test -- --testPathPattern=horario.controller.test.ts

# Ejecutar con coverage
npm test -- --coverage --testPathPattern=horario.controller.test.ts

# Ejecutar métodos específicos
npm test -- --testNamePattern="crearHorario"

# Ejecutar por categoría
npm test -- --testNamePattern="Casos Normales"
```

## Criterios de Éxito

### Para Casos Normales
- ✅ HTTP status codes correctos
- ✅ JSON response estructura correcta
- ✅ Servicios llamados con parámetros correctos
- ✅ Datos de usuario extraídos correctamente
- ✅ Filtros convertidos correctamente (string → number)

### Para Casos Límite
- ✅ Manejo graceful de valores extremos
- ✅ Validaciones apropiadas sin crashes
- ✅ Comportamiento consistente con datos límite
- ✅ Conversiones de tipo apropiadas

### Para Casos de Excepción
- ✅ HTTP status codes apropiados (400, 500)
- ✅ Mensajes de error claros y específicos
- ✅ Estructura de error consistente
- ✅ Errores del service propagados correctamente

## Integración con Service Layer

### Contrato Service-Controller
```typescript
// El controller debe:
1. Extraer userId del token JWT
2. Validar parámetros requeridos
3. Convertir tipos apropiadamente
4. Llamar al service con datos limpios
5. Manejar errores del service
6. Formatear respuestas HTTP apropiadas

// El service debe:
1. Implementar lógica de negocio
2. Manejar transacciones de BD
3. Lanzar errores específicos
4. Retornar datos estructurados
```

## Consideraciones de Seguridad

### Autenticación
- Validación de userId desde token JWT
- Aislamiento de datos por médico
- No permitir creación de horarios para otros médicos

### Validación de Entrada
- Sanitización de parámetros de query
- Validación de formatos de fecha/hora
- Prevención de inyección SQL (vía ORM)

### Manejo de Errores
- No exponer detalles internos de BD
- Mensajes de error genéricos para el cliente
- Logs detallados para debugging

## Dependencias Testeadas
- Express.js Router
- JWT Authentication middleware
- HorarioService
- Sequelize Models
- HTTP Response formatting

## Configuración de Test Environment
```typescript
// Test setup requirements
- Mock de Express Request/Response
- Mock de HorarioService
- Validación de funciones async
- Limpieza de mocks entre tests