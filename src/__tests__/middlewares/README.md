# Pruebas Unitarias de Middleware

Este directorio contiene pruebas unitarias completas para las funciones de middleware en la aplicación. Actualmente, incluye pruebas para el middleware de autenticación (`auth.ts`) con 100% de cobertura de código.

## Estructura de Pruebas

Cada archivo de prueba de middleware sigue una estructura consistente:

### Casos Normales
- Prueba la ejecución exitosa del middleware con entradas válidas
- Verifica el comportamiento correcto cuando se cumplen las condiciones
- Valida que `next()` se llame apropiadamente

### Casos Límite
- Prueba condiciones de límite y casos extremos
- Maneja parámetros faltantes o inválidos
- Valida restricciones de entrada y respuestas de error

### Casos de Excepción
- Prueba el manejo de errores para escenarios inesperados
- Cubre fallos de verificación JWT
- Maneja tokens malformados y errores de autenticación

## Reporte de Cobertura

Todos los archivos de middleware logran 100% de cobertura de sentencias, funciones y líneas:

```
src/middlewares              |   100 |    90 |   100 |   100 |
├── auth.ts                  |   100 |    90 |   100 |   100 |
```

## Archivos de Prueba

### auth.test.ts
Prueba las funciones de middleware de autenticación:
- `verifyToken` - Middleware de verificación de tokens JWT
- `authorizeRoles` - Middleware de autorización basada en roles

#### Pruebas de verifyToken
- **Casos Normales**: Verificación de tokens válidos, diferentes roles de usuario
- **Casos Límite**: Encabezados de autorización faltantes/inválidos, tokens malformados
- **Casos de Excepción**: Tokens expirados, firmas inválidas, errores de verificación

#### Pruebas de authorizeRoles
- **Casos Normales**: Autorización de rol único, múltiples roles, diferentes tipos de usuario
- **Casos Límite**: Usuarios no autenticados, roles faltantes, formatos de rol inválidos
- **Casos de Excepción**: Arrays de roles vacíos, sensibilidad a mayúsculas, lógica de coincidencia de roles

## Resultados de Pruebas

- **Suites de Prueba Totales**: 1 aprobada
- **Pruebas Totales**: 23 aprobadas
- **Cobertura**: 100% para funciones de middleware
- **Tiempo de Ejecución**: ~14 segundos

## Dependencias

Las pruebas utilizan las siguientes dependencias clave:
- `jest`: Para simulaciones y aserciones
- `jsonwebtoken`: Para simulación de tokens JWT
- `express`: Para definiciones de tipos Request/Response

## Estrategia de Simulación

Cada archivo de prueba simula:
- Dependencias externas (jsonwebtoken)
- Objetos Request/Response para pruebas de middleware
- Función next para pruebas de continuación

Esto asegura que las pruebas se centren en la lógica del middleware y el manejo de errores en lugar de servicios externos.

## Ejecutando Pruebas

Para ejecutar todas las pruebas de middleware:

```bash
npx jest --testPathPatterns=middlewares --coverage --coverageDirectory=test-report/middlewares-coverage
```

Para ejecutar pruebas para un middleware específico:

```bash
npx jest src/__tests__/middlewares/auth.test.ts
```

## Escenarios de Prueba Clave

### Flujo de Autenticación
1. **Verificación de Token**: Valida tokens JWT y extrae información de usuario
2. **Autorización de Rol**: Asegura que los usuarios tengan permisos apropiados
3. **Manejo de Errores**: Códigos de estado HTTP apropiados y mensajes de error
4. **Seguridad**: Previene acceso no autorizado y maneja casos extremos

Las pruebas de middleware aseguran mecanismos robustos de autenticación y autorización en toda la aplicación.