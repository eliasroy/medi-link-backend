# Tests Unitarios - Auth Controller

Este directorio contiene los tests unitarios para el controlador de autenticación (`authController.ts`).

## Archivo de Test

- **`auth.controller.test.ts`**: Tests para la función `login` del controlador de autenticación.

## Descripción General

Este archivo de test verifica el comportamiento del controlador de autenticación, específicamente la función `login`, que actúa como intermediario entre las peticiones HTTP y el servicio de autenticación. Los tests se enfocan en validar la gestión de respuestas HTTP (status codes y mensajes JSON) basándose en los resultados del servicio mockeado.

## Mocking

Los tests mockean las siguientes dependencias:
- **`auth.service`**: Se mockea completamente para controlar las respuestas del servicio y validar que el controlador llama correctamente al servicio.

## Estructura de Tests

Los tests están organizados en tres categorías principales:

### 1. Casos Comunes (Happy Path)

#### ✅ Test: `debe responder 200 con el resultado cuando el login es exitoso`

**Ubicación**: Líneas 22-34

**Descripción**: Verifica el flujo exitoso cuando un usuario se autentica correctamente.

**Qué prueba**:
- Cuando el servicio de autenticación retorna un resultado exitoso, el controlador debe responder con el objeto JSON completo sin llamar a `res.status()` (lo que indica un status 200 por defecto en Express).
- El controlador debe pasar correctamente los parámetros (email y password) al servicio.

**Expectativas**:
- `authService.login` debe ser llamado con `email` y `password` correctos.
- `res.json` debe ser llamado con el resultado completo del servicio.
- `res.status` no debe ser llamado (indicando status 200).

**Datos de prueba**:
- Email: `'user@test.com'`
- Password: `'secret'`
- Resultado esperado: Objeto con `mensaje`, `token`, `idUser` y `usuario`.

---

### 2. Casos Límite (Edge Cases)

#### ❌ Test: `debe responder 400 cuando falta email`

**Ubicación**: Líneas 37-48

**Descripción**: Valida que el controlador maneje correctamente cuando se intenta hacer login con un email vacío.

**Qué prueba**:
- El controlador debe capturar el error del servicio cuando el email está vacío.
- Debe responder con status 400 y un mensaje de error apropiado.

**Expectativas**:
- `authService.login` debe ser llamado incluso con email vacío.
- `res.status(400)` debe ser llamado.
- `res.json` debe contener el mensaje de error del servicio.

**Datos de prueba**:
- Email: `''` (vacío)
- Password: `'secret'`
- Error esperado: `'Usuario no encontrado'`

---

#### ❌ Test: `debe responder 400 cuando la contraseña es incorrecta`

**Ubicación**: Líneas 50-61

**Descripción**: Valida que el controlador maneje correctamente cuando la contraseña proporcionada es incorrecta.

**Qué prueba**:
- El controlador debe capturar el error cuando la contraseña está vacía o es incorrecta.
- Debe responder con status 400 y el mensaje de error correspondiente.

**Expectativas**:
- `authService.login` debe ser llamado.
- `res.status(400)` debe ser llamado.
- `res.json` debe contener el error `'Contraseña incorrecta'`.

**Datos de prueba**:
- Email: `'user@test.com'`
- Password: `''` (vacío)
- Error esperado: `'Contraseña incorrecta'`

---

#### ❌ Test: `debe responder 400 cuando el usuario no tiene perfil`

**Ubicación**: Líneas 63-73

**Descripción**: Valida que el controlador maneje correctamente cuando un usuario existe pero no tiene perfil de MÉDICO ni PACIENTE asociado.

**Qué prueba**:
- El controlador debe capturar el error del servicio cuando un usuario no tiene perfil válido.
- Debe responder con status 400 y un mensaje de error descriptivo.

**Expectativas**:
- `res.status(400)` debe ser llamado.
- `res.json` debe contener el error `'El usuario no tiene perfil de MÉDICO o PACIENTE'`.

**Datos de prueba**:
- Email: `'user@test.com'`
- Password: `'secret'`
- Error esperado: `'El usuario no tiene perfil de MÉDICO o PACIENTE'`

---

### 3. Casos de Excepción (Exception Cases)

#### ⚠️ Test: `debe responder 400 cuando falta JWT_SECRET`

**Ubicación**: Líneas 76-86

**Descripción**: Valida que el controlador maneje correctamente cuando falta la variable de entorno `JWT_SECRET`, lo cual es necesario para generar tokens JWT.

**Qué prueba**:
- El controlador debe capturar el error cuando `JWT_SECRET` no está definido en las variables de entorno.
- Debe responder con status 400 y un mensaje de error informativo.

**Expectativas**:
- `res.status(400)` debe ser llamado.
- `res.json` debe contener el error relacionado con `JWT_SECRET`.

**Datos de prueba**:
- Email: `'user@test.com'`
- Password: `'secret'`
- Error esperado: `' JWT_SECRET no está definido en .env'`

---

#### ⚠️ Test: `debe responder 400 ante error inesperado del servicio`

**Ubicación**: Líneas 88-98

**Descripción**: Valida que el controlador maneje correctamente cualquier error inesperado que pueda ocurrir en el servicio de autenticación (como errores de conexión a base de datos).

**Qué prueba**:
- El controlador debe capturar y manejar cualquier error genérico del servicio.
- Debe responder con status 400 y propagar el mensaje de error.

**Expectativas**:
- `res.status(400)` debe ser llamado.
- `res.json` debe contener el mensaje de error del servicio.

**Datos de prueba**:
- Email: `'user@test.com'`
- Password: `'secret'`
- Error esperado: `'Error de conexión a la base de datos'`

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`**: Limpia todos los mocks antes de cada test para asegurar que no haya interferencia entre tests.

### Mock de Response

La función `createMockResponse()` (líneas 9-14) crea un mock de la respuesta de Express con:
- `status`: Mock que retorna el objeto de respuesta (para encadenamiento).
- `json`: Mock que retorna el objeto de respuesta (para encadenamiento).

Esto permite verificar las llamadas a estos métodos sin necesidad de una respuesta HTTP real.

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del controlador de autenticación
npm test -- auth.controller.test

# Ejecutar en modo watch
npm run test:watch -- auth.controller.test

# Ejecutar con cobertura
npm run test:coverage -- auth.controller.test
```

## Cobertura Esperada

Los tests deberían cubrir:
- ✅ Casos exitosos (login válido)
- ✅ Casos de error de validación (email vacío, contraseña incorrecta)
- ✅ Casos de error de configuración (JWT_SECRET faltante)
- ✅ Casos de error del servicio (errores de base de datos, etc.)

## Notas Importantes

1. **Aislamiento**: Todos los tests están completamente aislados mediante mocks. No dependen de servicios reales ni de base de datos.

2. **Manejo de Errores**: El controlador siempre retorna status 400 para errores, sin distinción entre tipos de error. Esto es intencional según la implementación actual.

3. **Responsabilidades**: El controlador solo se encarga de:
   - Extraer datos del request (`req.body`)
   - Llamar al servicio correspondiente
   - Formatear la respuesta HTTP apropiada
   - No realiza validaciones de negocio (eso es responsabilidad del servicio)

