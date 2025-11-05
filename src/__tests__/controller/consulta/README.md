# Pruebas Unitarias - ConsultaController

## Descripción General

Este directorio contiene pruebas unitarias completas para la clase `ConsultaController`, que maneja las solicitudes HTTP y respuestas para las operaciones de gestión de consultas médicas.

## Qué Hace el Módulo Consulta

El controlador Consulta proporciona endpoints de API REST para gestionar consultas médicas:

- **POST /consulta/iniciar**: Inicia una nueva consulta para una cita programada
- **PUT /consulta/:id_consulta**: Actualiza los detalles y progreso de la consulta
- **POST /consulta/calificar**: Permite a los pacientes calificar consultas completadas
- **GET /consulta/cita/:idCita**: Recupera los detalles de consulta por ID de cita

### Características Clave

1. **Autenticación**: Utiliza tokens JWT para identificar médicos y pacientes
2. **Validación de Entrada**: Valida parámetros de solicitud y datos del cuerpo
3. **Manejo de Errores**: Proporciona respuestas de error consistentes con códigos de estado HTTP apropiados
4. **Formato de Respuesta**: Estandariza las respuestas de API con estructura success/data

## Estructura de Pruebas

### Casos Normales
- ✅ Inicio exitoso de consulta con datos válidos
- ✅ Actualizaciones exitosas de consulta con datos completos y parciales
- ✅ Calificación exitosa de consulta con puntajes válidos
- ✅ Recuperación exitosa de consulta con autorización apropiada

### Casos Límite
- ✅ Manejo de campos opcionales faltantes en cuerpos de solicitud
- ✅ Validación de límites para entradas numéricas (IDs, calificaciones)
- ✅ Formatos de ID inválidos (cadenas no numéricas)
- ✅ Entradas vacías o solo con espacios en blanco

### Casos de Excepción
- ✅ Errores de capa de servicio (fallos de base de datos, errores de validación)
- ✅ Fallos de autenticación/autorización
- ✅ Formatos de datos de solicitud inválidos
- ✅ Parámetros requeridos faltantes

## Cobertura de Pruebas

Las pruebas logran 100% de cobertura para:
- **Líneas**: Todas las líneas ejecutables son probadas
- **Sentencias**: Todas las sentencias son ejecutadas
- **Ramas**: Todas las ramas condicionales están cubiertas
- **Funciones**: Todos los métodos del controlador son probados

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
# Ejecutar todas las pruebas de ConsultaController
npm test -- src/__tests__/controller/consulta/consulta.controller.test.ts

# Ejecutar con cobertura
npm run test:coverage -- src/__tests__/controller/consulta/consulta.controller.test.ts

# Ejecutar suite de pruebas específico
npm test -- --testNamePattern="iniciarConsulta"
```

### Reporte de Cobertura
Después de ejecutar pruebas con cobertura, ver el reporte en:
- **Reporte HTML**: `coverage/lcov-report/index.html`
- **Salida de Consola**: Muestra porcentajes de cobertura en terminal

## Ejemplo de Salida de Prueba

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

## Dependencias Simuladas

- **ConsultaService**: Todos los métodos de lógica de negocio simulados
- **Express Request/Response**: Objetos HTTP simulados con jest
- **JWT Authentication**: Contexto de usuario simulado en objetos de solicitud

## Patrón AAA

Todas las pruebas siguen el patrón Arrange-Act-Assert:

```typescript
it('should initiate consultation successfully', async () => {
  // Arrange - Configurar solicitud, respuesta y simulaciones de servicio
  const req = { body: { id_cita: 1, motivo: 'test' }, user: { id: 1 } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  mockIniciarConsulta.mockResolvedValue(mockConsulta);

  // Act - Llamar al método del controlador
  await ConsultaController.iniciarConsulta(req, res);

  // Assert - Verificar respuesta y llamadas al servicio
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
});
```

## Fábricas de Simulación

Las pruebas utilizan fábricas de datos de simulación consistentes para:
- Objetos de solicitud Express simulados con diferentes combinaciones body/params/user
- Objetos de respuesta Express simulados con espionaje status/json
- Respuestas de servicio simuladas para escenarios de éxito y error

Esto asegura confiabilidad y mantenibilidad de las pruebas.

## Formato de Respuesta de Error

Todas las respuestas de error siguen el formato estándar:
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

## Formato de Respuesta de Éxito

Todas las respuestas de éxito siguen el formato estándar:
```json
{
  "success": true,
  "data": { /* datos de consulta */ }
}
```

## Códigos de Estado HTTP

- **200**: Actualizaciones y calificaciones exitosas
- **201**: Creación exitosa de consulta
- **400**: Errores de validación, violaciones de lógica de negocio
- **404**: Recurso no encontrado (manejado en obtenerConsultaPorIdCita)