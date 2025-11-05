# Pruebas Unitarias - CitaController

## Descripción General

Este directorio contiene pruebas unitarias completas para la clase `CitaController`, que maneja las solicitudes HTTP y respuestas para las operaciones de gestión de citas médicas.

## Qué Hace el Módulo Cita

El controlador Cita proporciona endpoints de API REST para gestionar citas médicas:

- **POST /cita**: Crea nuevas citas usando horarios existentes o creando nuevos espacios de tiempo
- **GET /cita/paciente/:idPaciente**: Recupera todas las citas para un paciente específico
- **GET /cita/medico**: Recupera todas las citas para el médico autenticado
- **DELETE /cita/:idCita**: Cancela una cita y libera el espacio de tiempo

### Características Clave

1. **Autenticación**: Utiliza tokens JWT para identificar pacientes y médicos
2. **Validación de Entrada**: Valida parámetros de solicitud y datos del cuerpo
3. **Manejo de Errores**: Proporciona respuestas de error consistentes con códigos de estado HTTP apropiados
4. **Formato de Respuesta**: Estandariza las respuestas de API con estructura success/data

## Estructura de Pruebas

### Casos Normales
- ✅ Creación exitosa de cita con horario existente
- ✅ Creación exitosa de cita con nuevo horario
- ✅ Recuperación exitosa de citas para pacientes y médicos
- ✅ Cancelación exitosa de cita

### Casos Límite
- ✅ Manejo de formatos de ID inválidos (cadenas no numéricas)
- ✅ Gestión de conjuntos de resultados vacíos
- ✅ Validación de límites para entradas numéricas

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
# Ejecutar todas las pruebas de CitaController
npm test -- src/__tests__/controller/cita/cita.controller.test.ts

# Ejecutar con cobertura
npm run test:coverage -- src/__tests__/controller/cita/cita.controller.test.ts

# Ejecutar suite de pruebas específico
npm test -- --testNamePattern="crearCita"
```

### Reporte de Cobertura
Después de ejecutar pruebas con cobertura, ver el reporte en:
- **Reporte HTML**: `coverage/lcov-report/index.html`
- **Salida de Consola**: Muestra porcentajes de cobertura en terminal

## Ejemplo de Salida de Prueba

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

## Dependencias Simuladas

- **CitaService**: Todos los métodos de lógica de negocio simulados
- **Express Request/Response**: Objetos HTTP simulados con jest
- **JWT Authentication**: Contexto de usuario simulado en objetos de solicitud

## Patrón AAA

Todas las pruebas siguen el patrón Arrange-Act-Assert:

```typescript
it('should create appointment successfully using existing schedule', async () => {
  // Arrange - Configurar solicitud, respuesta y simulaciones de servicio
  const req = {
    body: { idHorario: 1, idMedico: 1, titulo: 'Consulta General', ... },
    user: { id: 1 }
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  mockCrearCitaConHorario.mockResolvedValue(mockCita);

  // Act - Llamar al método del controlador
  await CitaController.crearCita(req, res);

  // Assert - Verificar respuesta y llamadas al servicio
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCita });
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
  "data": { /* datos de cita */ },
  "count": 5 /* para endpoints de lista */
}
```

## Códigos de Estado HTTP

- **200**: Operaciones exitosas (recuperación, eliminación)
- **201**: Creación exitosa de cita
- **400**: Errores de validación, violaciones de lógica de negocio
- **404**: Recurso no encontrado (en eliminación)
- **500**: Errores internos del servidor (problemas de base de datos)

## Estructura de Respuesta

### Respuesta de Recurso Único
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

### Respuesta de Lista de Recursos
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