# Tests Unitarios - PasswordChange Controller

Este directorio contiene los tests unitarios para el controlador de cambio de contraseña (`passwordChangeController.ts`).

## Archivo de Test

- **`passwordChange.controller.test.ts`**: Tests para la función `changePasswordByEmail` del controlador de cambio de contraseña.

## Descripción General

Este archivo de test verifica el comportamiento del controlador de cambio de contraseña, específicamente la función `changePasswordByEmail`, que actúa como intermediario entre las peticiones HTTP y el servicio de cambio de contraseña. 

El controlador realiza validaciones en la capa HTTP antes de llamar al servicio:
- Validación de campos requeridos (email y newPassword)
- Validación de formato de email usando regex
- Validación de longitud mínima de contraseña (6 caracteres)

Los tests se enfocan en validar la gestión de respuestas HTTP (status codes y mensajes JSON) y las validaciones del controlador.

## Mocking

Los tests mockean las siguientes dependencias:
- **`passwordChange.service`**: Se mockea completamente para controlar las respuestas del servicio y validar que el controlador llama correctamente al servicio.

## Estructura de Tests

Los tests están organizados en tres categorías principales:

---

## 1. Casos Normales (Happy Path)

### ✅ Test: `debe responder 200 con el resultado cuando el cambio de contraseña es exitoso`

**Ubicación**: Líneas 21-45

**Descripción**: Verifica el flujo exitoso cuando se cambia la contraseña correctamente.

**Qué prueba**:
- Cuando el servicio retorna un resultado exitoso, el controlador debe responder con status 200 (por defecto)
- El controlador debe pasar correctamente los parámetros (email y newPassword) al servicio
- El controlador debe retornar el mensaje de éxito

**Expectativas**:
- `passwordChangeService.changePasswordByEmail` debe ser llamado con `email` y `newPassword` correctos
- `res.json` debe ser llamado con el resultado del servicio
- `res.status` no debe ser llamado (indicando status 200 por defecto)

**Datos de prueba**:
- Email: `'usuario@test.com'`
- Nueva contraseña: `'newPassword123'`
- Resultado esperado: Objeto con `mensaje: 'Contraseña actualizada exitosamente'`

---

### ✅ Test: `debe responder 200 cuando el cambio es exitoso para un médico`

**Ubicación**: Líneas 47-69

**Descripción**: Verifica que el controlador maneje correctamente el cambio de contraseña para médicos.

**Qué prueba**:
- Mismo flujo que el test anterior pero para email de médico
- El controlador debe funcionar igual independientemente del tipo de usuario

**Datos de prueba**:
- Email: `'medico@test.com'`
- Nueva contraseña: `'medicoPassword123'`

---

## 2. Casos Límite (Edge Cases)

### ❌ Test: `debe responder 400 cuando falta email`

**Ubicación**: Líneas 73-93

**Descripción**: Valida que el controlador rechace peticiones cuando falta el campo `email`.

**Qué prueba**:
- El controlador debe validar que `email` esté presente antes de llamar al servicio
- Debe responder con status 400 y un mensaje de error apropiado
- No debe llamar al servicio

**Expectativas**:
- `passwordChangeService.changePasswordByEmail` NO debe ser llamado
- `res.status(400)` debe ser llamado
- `res.json` debe contener el error `'Email y nueva contraseña son requeridos'`

**Datos de prueba**:
- Request body: `{ newPassword: 'password123' }` (sin email)

---

### ❌ Test: `debe responder 400 cuando falta newPassword`

**Ubicación**: Líneas 95-115

**Descripción**: Valida que el controlador rechace peticiones cuando falta el campo `newPassword`.

**Qué prueba**:
- El controlador debe validar que `newPassword` esté presente
- Debe responder con status 400 sin llamar al servicio

**Error esperado**: `'Email y nueva contraseña son requeridos'`

---

### ❌ Test: `debe responder 400 cuando email y newPassword están vacíos`

**Ubicación**: Líneas 117-137

**Descripción**: Valida que el controlador rechace peticiones cuando ambos campos están vacíos (strings vacíos).

**Qué prueba**:
- El controlador debe tratar strings vacíos como valores faltantes
- Debe responder con status 400

**Datos de prueba**:
- Email: `''`
- NewPassword: `''`

---

### ❌ Test: `debe responder 400 cuando el email tiene formato inválido (sin @)`

**Ubicación**: Líneas 139-159

**Descripción**: Valida que el controlador rechace emails sin el símbolo `@`.

**Qué prueba**:
- Validación de formato de email usando regex
- Debe responder con status 400 sin llamar al servicio

**Datos de prueba**:
- Email: `'emailinvalido'` (sin @)

**Error esperado**: `'Formato de email inválido'`

---

### ❌ Test: `debe responder 400 cuando el email tiene formato inválido (sin dominio)`

**Ubicación**: Líneas 161-181

**Descripción**: Valida que el controlador rechace emails que tienen `@` pero sin dominio después.

**Datos de prueba**:
- Email: `'usuario@'` (sin dominio)

**Error esperado**: `'Formato de email inválido'`

---

### ❌ Test: `debe responder 400 cuando el email tiene formato inválido (sin punto en dominio)`

**Ubicación**: Líneas 183-203

**Descripción**: Valida que el controlador rechace emails que tienen dominio pero sin punto (TLD).

**Datos de prueba**:
- Email: `'usuario@test'` (sin .com, .org, etc.)

**Error esperado**: `'Formato de email inválido'`

---

### ❌ Test: `debe responder 400 cuando la contraseña tiene menos de 6 caracteres`

**Ubicación**: Líneas 205-225

**Descripción**: Valida que el controlador rechace contraseñas con menos de 6 caracteres.

**Qué prueba**:
- Validación de longitud mínima de contraseña
- Debe responder con status 400 sin llamar al servicio

**Datos de prueba**:
- NewPassword: `'12345'` (solo 5 caracteres)

**Error esperado**: `'La contraseña debe tener al menos 6 caracteres'`

---

### ✅ Test: `debe responder 200 cuando la contraseña tiene exactamente 6 caracteres`

**Ubicación**: Líneas 227-251

**Descripción**: Valida que el controlador acepte contraseñas con exactamente 6 caracteres (el límite mínimo).

**Qué prueba**:
- Contraseña con exactamente 6 caracteres debe ser aceptada
- El servicio debe ser llamado normalmente

**Datos de prueba**:
- NewPassword: `'123456'` (exactamente 6 caracteres)

---

### ✅ Test: `debe aceptar email con formato válido complejo`

**Ubicación**: Líneas 253-273

**Descripción**: Valida que el controlador acepte emails con formatos complejos pero válidos (subaddressing, múltiples dominios).

**Qué prueba**:
- Email con caracteres especiales válidos debe pasar la validación
- El servicio debe ser llamado con el email completo

**Datos de prueba**:
- Email: `'usuario+test@test-domain.co.uk'` (formato complejo válido)

---

## 3. Casos de Excepción (Exception Cases)

### ⚠️ Test: `debe responder 400 cuando el usuario no existe`

**Ubicación**: Líneas 277-297

**Descripción**: Valida que el controlador maneje correctamente cuando el servicio retorna error porque el usuario no existe.

**Qué prueba**:
- El controlador debe capturar el error del servicio
- Debe responder con status 400 y propagar el mensaje de error

**Expectativas**:
- `res.status(400)` debe ser llamado
- `res.json` debe contener el mensaje de error del servicio

**Datos de prueba**:
- Email: `'noexiste@test.com'`
- Error esperado: `'Usuario no encontrado con ese email'`

---

### ⚠️ Test: `debe responder 400 ante error de conexión a base de datos`

**Ubicación**: Líneas 299-321

**Descripción**: Valida que el controlador maneje correctamente errores de conexión a la base de datos.

**Qué prueba**:
- El controlador debe capturar y manejar errores de infraestructura
- Debe responder con status 400 y propagar el mensaje de error

**Error esperado**: `'Error al actualizar contraseña: Error de conexión a la base de datos'`

---

### ⚠️ Test: `debe responder 400 ante error de bcrypt`

**Ubicación**: Líneas 323-343

**Descripción**: Valida que el controlador maneje correctamente errores de bcrypt al hashear contraseñas.

**Error esperado**: `'Error al actualizar contraseña: Error interno de bcrypt'`

---

### ⚠️ Test: `debe responder 400 ante error inesperado del servicio`

**Ubicación**: Líneas 345-365

**Descripción**: Valida que el controlador maneje correctamente cualquier error inesperado del servicio.

**Error esperado**: `'Error al actualizar contraseña: Error inesperado'`

---

### ⚠️ Test: `debe responder 400 ante timeout de base de datos`

**Ubicación**: Líneas 367-387

**Descripción**: Valida que el controlador maneje correctamente timeouts de conexión a la base de datos.

**Error esperado**: `'Error al actualizar contraseña: Timeout de conexión a la base de datos'`

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`**: Limpia todos los mocks antes de cada test para asegurar que no haya interferencia entre tests.

### Mock de Response

La función `createMockResponse()` (líneas 12-16) crea un mock de la respuesta de Express con:
- `status`: Mock que retorna el objeto de respuesta (para encadenamiento)
- `json`: Mock que retorna el objeto de respuesta (para encadenamiento)

Esto permite verificar las llamadas a estos métodos sin necesidad de una respuesta HTTP real.

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del controlador de cambio de contraseña
npm test -- passwordChange.controller.test

# Ejecutar en modo watch
npm run test:watch -- passwordChange.controller.test

# Ejecutar con cobertura
npm run test:coverage -- passwordChange.controller.test
```

## Cobertura Esperada

Los tests deberían cubrir:
- ✅ Casos exitosos (cambio de contraseña válido)
- ✅ Casos de error de validación (campos faltantes, formatos inválidos, longitud de contraseña)
- ✅ Casos de error del servicio (usuario no encontrado, errores de infraestructura)

## Notas Importantes

1. **Aislamiento**: Todos los tests están completamente aislados mediante mocks. No dependen de servicios reales ni de base de datos.

2. **Manejo de Errores**: El controlador siempre retorna status 400 para errores, sin distinción entre tipos de error. Esto es intencional según la implementación actual.

3. **Responsabilidades**: El controlador se encarga de:
   - Validar campos requeridos (email, newPassword)
   - Validar formato de email usando regex básico
   - Validar longitud mínima de contraseña (6 caracteres)
   - Extraer datos del request (`req.body`)
   - Llamar al servicio correspondiente
   - Formatear la respuesta HTTP apropiada (200 para éxito, 400 para errores)
   - No realiza lógica de negocio (eso es responsabilidad del servicio)

4. **Validaciones del Controlador**:
   - **Campos requeridos**: Verifica que `email` y `newPassword` estén presentes y no sean strings vacíos
   - **Formato de email**: Usa regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` para validación básica
   - **Longitud de contraseña**: Requiere mínimo 6 caracteres

5. **Status Codes**:
   - **200 OK**: Cambio de contraseña exitoso (por defecto, no se llama `res.status`)
   - **400 Bad Request**: Cualquier error (validación, usuario no encontrado, infraestructura)

6. **Orden de Validaciones**: El controlador valida en este orden:
   1. Campos requeridos
   2. Formato de email
   3. Longitud de contraseña
   4. Llamada al servicio

7. **Early Returns**: El controlador usa `return` temprano cuando hay errores de validación para evitar llamar al servicio innecesariamente.

