# Tests Unitarios - Usuario Controller

Este directorio contiene los tests unitarios para el controlador de usuario (`usuario.controller.ts`).

## Archivo de Test

- **`usuario.controller.test.ts`**: Tests para las funciones `registrarPaciente` y `registrarMedico` del controlador de usuario.

## Descripción General

Este archivo de test verifica el comportamiento del controlador de usuario, específicamente las funciones:
- **`registrarPaciente`**: Endpoint para registro de nuevos pacientes
- **`registrarMedico`**: Endpoint para registro de nuevos médicos

Los tests se enfocan en validar la gestión de respuestas HTTP (status codes y mensajes JSON) basándose en los resultados del servicio mockeado.

## Mocking

Los tests mockean las siguientes dependencias:
- **`usuario.service`**: Se mockea completamente para controlar las respuestas del servicio y validar que el controlador llama correctamente al servicio.

## Estructura de Tests

Los tests están organizados en dos suites principales, una para cada función, con tres categorías cada una:

---

## 1. registrarPaciente - Casos Normales (Happy Path)

### ✅ Test: `debe responder 201 con el resultado cuando el registro es exitoso`

**Ubicación**: Líneas 21-57

**Descripción**: Verifica el flujo exitoso cuando se registra un paciente correctamente con todos los datos.

**Qué prueba**:
- Cuando el servicio retorna un resultado exitoso, el controlador debe responder con status 201
- El controlador debe pasar correctamente los datos del request body al servicio
- El controlador debe retornar el objeto completo (usuario y paciente)

**Expectativas**:
- `usuarioService.registrarPaciente` debe ser llamado con `req.body`
- `res.status(201)` debe ser llamado
- `res.json` debe ser llamado con el resultado completo del servicio

**Datos de prueba**:
- Nombre: `'Juan'`
- Email: `'juan.perez@test.com'`
- Incluye todos los campos: teléfono, fecha_nacimiento, sexo, dirección

---

### ✅ Test: `debe responder 201 cuando el registro es exitoso solo con datos obligatorios`

**Ubicación**: Líneas 59-91

**Descripción**: Verifica que el controlador maneje correctamente el registro exitoso con solo campos obligatorios.

**Qué prueba**:
- Registro exitoso con datos mínimos
- Status 201 y respuesta correcta

**Expectativas**:
- Status 201
- Resultado con usuario y paciente

**Datos de prueba**:
- Solo campos obligatorios (sin opcionales)

---

## 2. registrarMedico - Casos Normales (Happy Path)

### ✅ Test: `debe responder 201 con el resultado cuando el registro es exitoso`

**Ubicación**: Líneas 95-131

**Descripción**: Verifica el flujo exitoso cuando se registra un médico correctamente con todos los datos.

**Qué prueba**:
- Status 201 cuando el registro es exitoso
- Pasar todos los datos del request al servicio
- Retornar usuario y médico en la respuesta

**Expectativas**:
- `usuarioService.registrarMedico` debe ser llamado con `req.body`
- `res.status(201)` debe ser llamado
- `res.json` debe contener usuario y médico

**Datos de prueba**:
- Nombre: `'Dr. Carlos'`
- Email: `'carlos.rodriguez@test.com'`
- ID Especialidad: `1`
- Número de colegiatura: `'12345'`
- Incluye todos los campos

---

### ✅ Test: `debe responder 201 cuando el registro es exitoso sin años de experiencia`

**Ubicación**: Líneas 133-165

**Descripción**: Verifica que el controlador maneje correctamente el registro de médico sin campo opcional (años de experiencia).

**Qué prueba**:
- Registro exitoso sin campo opcional
- Status 201 y respuesta correcta

---

## 3. registrarPaciente - Casos Límite (Edge Cases)

### ❌ Test: `debe responder 400 cuando falta nombre`

**Ubicación**: Líneas 169-191

**Descripción**: Valida que el controlador maneje correctamente cuando falta el campo obligatorio `nombre`.

**Qué prueba**:
- El controlador debe capturar el error del servicio cuando falta nombre
- Debe responder con status 400 y un mensaje de error apropiado

**Expectativas**:
- `res.status(400)` debe ser llamado
- `res.json` debe contener el mensaje de error del servicio

**Datos de prueba**:
- Request sin campo `nombre`
- Error esperado: `'El nombre es requerido'`

---

### ❌ Test: `debe responder 400 cuando falta email`

**Ubicación**: Líneas 193-215

**Descripción**: Valida que el controlador maneje correctamente cuando falta el campo obligatorio `email`.

**Qué prueba**:
- Error cuando falta email
- Status 400 con mensaje apropiado

**Error esperado**: `'El email es requerido'`

---

### ❌ Test: `debe responder 400 cuando falta password`

**Ubicación**: Líneas 217-239

**Descripción**: Valida que el controlador maneje correctamente cuando falta el campo obligatorio `password`.

**Qué prueba**:
- Error cuando falta contraseña
- Status 400 con mensaje apropiado

**Error esperado**: `'La contraseña es requerida'`

---

### ❌ Test: `debe responder 400 cuando el email tiene formato inválido`

**Ubicación**: Líneas 241-263

**Descripción**: Valida que el controlador maneje correctamente cuando el email tiene formato inválido.

**Qué prueba**:
- Error de validación de formato de email
- Status 400 con mensaje descriptivo

**Datos de prueba**:
- Email: `'email-invalido'` (sin @ ni dominio)

**Error esperado**: `'Formato de email inválido'`

---

### ❌ Test: `debe responder 400 cuando el email ya existe`

**Ubicación**: Líneas 265-287

**Descripción**: Valida que el controlador maneje correctamente cuando se intenta registrar un email que ya existe en la base de datos.

**Qué prueba**:
- Error de email duplicado
- Status 400 con mensaje apropiado

**Error esperado**: `'Email ya existe en la base de datos'`

---

## 4. registrarMedico - Casos Límite (Edge Cases)

### ❌ Test: `debe responder 400 cuando falta nombre`

**Ubicación**: Líneas 291-313

**Descripción**: Valida manejo de error cuando falta el campo obligatorio `nombre` en registro de médico.

**Error esperado**: `'El nombre es requerido'`

---

### ❌ Test: `debe responder 400 cuando falta id_especialidad`

**Ubicación**: Líneas 315-337

**Descripción**: Valida manejo de error cuando falta la especialidad (campo específico de médico).

**Qué prueba**:
- Error cuando falta especialidad
- Status 400 con mensaje apropiado

**Error esperado**: `'La especialidad es requerida'`

---

### ❌ Test: `debe responder 400 cuando falta nro_colegiatura`

**Ubicación**: Líneas 339-361

**Descripción**: Valida manejo de error cuando falta el número de colegiatura (campo único y obligatorio para médicos).

**Qué prueba**:
- Error cuando falta colegiatura
- Status 400

**Error esperado**: `'El número de colegiatura es requerido'`

---

### ❌ Test: `debe responder 400 cuando el email ya existe`

**Ubicación**: Líneas 363-385

**Descripción**: Valida manejo de error cuando se intenta registrar un médico con email duplicado.

**Error esperado**: `'Email ya existe en la base de datos'`

---

### ❌ Test: `debe responder 400 cuando el número de colegiatura ya existe`

**Ubicación**: Líneas 387-409

**Descripción**: Valida manejo de error cuando se intenta registrar un médico con número de colegiatura duplicado (único para médicos).

**Qué prueba**:
- Error específico de colegiatura duplicada
- Status 400

**Error esperado**: `'Número de colegiatura ya existe'`

---

## 5. registrarPaciente - Casos de Excepción (Exception Cases)

### ⚠️ Test: `debe responder 400 ante error de conexión a base de datos`

**Ubicación**: Líneas 413-437

**Descripción**: Valida que el controlador maneje correctamente errores de conexión a la base de datos.

**Qué prueba**:
- El controlador debe capturar y manejar errores de infraestructura
- Debe responder con status 400 y propagar el mensaje de error

**Expectativas**:
- `res.status(400)` debe ser llamado
- `res.json` debe contener el mensaje de error del servicio

**Error esperado**: `'Error de conexión a la base de datos'`

---

### ⚠️ Test: `debe responder 400 ante error inesperado del servicio`

**Ubicación**: Líneas 439-461

**Descripción**: Valida que el controlador maneje correctamente cualquier error inesperado que pueda ocurrir en el servicio.

**Qué prueba**:
- Manejo de errores genéricos del servicio
- Status 400 con propagación del mensaje

**Error esperado**: `'Error inesperado en el servicio'`

---

### ⚠️ Test: `debe responder 400 ante error de bcrypt`

**Ubicación**: Líneas 463-485

**Descripción**: Valida que el controlador maneje correctamente errores de bcrypt al hashear contraseñas.

**Qué prueba**:
- Error de infraestructura en hasheo de contraseña
- Status 400

**Error esperado**: `'Error interno de bcrypt'`

---

### ⚠️ Test: `debe responder 400 ante timeout de base de datos`

**Ubicación**: Líneas 487-509

**Descripción**: Valida que el controlador maneje correctamente timeouts de conexión a la base de datos.

**Qué prueba**:
- Manejo de timeouts
- Status 400

**Error esperado**: `'Timeout de conexión a la base de datos'`

---

## 6. registrarMedico - Casos de Excepción (Exception Cases)

### ⚠️ Test: `debe responder 400 ante error de conexión a base de datos`

**Ubicación**: Líneas 513-539

**Descripción**: Similar al caso de paciente, valida manejo de errores de conexión para médicos.

**Error esperado**: `'Error de conexión a la base de datos'`

---

### ⚠️ Test: `debe responder 400 ante error inesperado del servicio`

**Ubicación**: Líneas 541-563

**Descripción**: Valida manejo de errores inesperados para registro de médicos.

**Error esperado**: `'Error inesperado en el servicio'`

---

### ⚠️ Test: `debe responder 400 ante error de bcrypt`

**Ubicación**: Líneas 565-587

**Descripción**: Valida manejo de errores de bcrypt para médicos.

**Error esperado**: `'Error interno de bcrypt'`

---

### ⚠️ Test: `debe responder 400 ante timeout de base de datos`

**Ubicación**: Líneas 589-611

**Descripción**: Valida manejo de timeouts para registro de médicos.

**Error esperado**: `'Timeout de conexión a la base de datos'`

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
# Ejecutar solo los tests del controlador de usuario
npm test -- usuario.controller.test

# Ejecutar en modo watch
npm run test:watch -- usuario.controller.test

# Ejecutar con cobertura
npm run test:coverage -- usuario.controller.test
```

## Cobertura Esperada

Los tests deberían cubrir:
- ✅ Casos exitosos (registro válido de paciente y médico)
- ✅ Casos de error de validación (campos faltantes, formatos inválidos)
- ✅ Casos de error de duplicados (email, colegiatura)
- ✅ Casos de error de infraestructura (base de datos, bcrypt, timeouts)

## Notas Importantes

1. **Aislamiento**: Todos los tests están completamente aislados mediante mocks. No dependen de servicios reales ni de base de datos.

2. **Manejo de Errores**: El controlador siempre retorna status 400 para errores, sin distinción entre tipos de error. Esto es intencional según la implementación actual.

3. **Responsabilidades**: El controlador solo se encarga de:
   - Extraer datos del request (`req.body`)
   - Llamar al servicio correspondiente
   - Formatear la respuesta HTTP apropiada (201 para éxito, 400 para errores)
   - No realiza validaciones de negocio (eso es responsabilidad del servicio o de middlewares)

4. **Validaciones**: Los tests asumen que las validaciones (campos requeridos, formatos) se realizan en el servicio. Si el servicio lanza un error, el controlador lo captura y retorna status 400.

5. **Status Codes**:
   - **201 Created**: Registro exitoso
   - **400 Bad Request**: Cualquier error (validación, infraestructura, etc.)

6. **Diferencias entre Paciente y Médico**:
   - Paciente: No tiene validaciones únicas específicas más allá de email
   - Médico: Tiene validaciones adicionales (especialidad requerida, colegiatura única)

