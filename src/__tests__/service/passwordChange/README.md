# Tests Unitarios - PasswordChange Service

Este directorio contiene los tests unitarios para el servicio de cambio de contraseña (`passwordChange.service.ts`).

## Archivo de Test

- **`passwordChange.service.test.ts`**: Tests completos para la función `changePasswordByEmail` del servicio de cambio de contraseña.

## Descripción General

Este archivo de test verifica el comportamiento del servicio de cambio de contraseña, específicamente la función `changePasswordByEmail`, que es responsable de:
- Buscar un usuario por email
- Hashear la nueva contraseña usando bcrypt
- Actualizar la contraseña en la base de datos
- Actualizar la fecha de actualización del usuario

Los tests cubren casos normales, casos límite y casos de excepción para asegurar robustez del servicio en el proceso de cambio de contraseñas.

## Mocking

Los tests mockean las siguientes dependencias:
- **`bcrypt`**: Para hasheo seguro de contraseñas
- **Modelos de Sequelize**: `Usuario` (findOne y método update)

Esto permite que los tests sean rápidos y no dependan de conexiones reales a base de datos.

## Estructura de Tests

Los tests están organizados en tres suites principales dentro de `describe('PasswordChange Service - Tests Completos')`:

---

## 1. Casos Normales (Happy Path)

### ✅ Test: `debería cambiar la contraseña exitosamente cuando el usuario existe`

**Ubicación**: Líneas 21-65

**Descripción**: Verifica el flujo completo de cambio de contraseña exitoso para un usuario existente.

**Qué prueba**:
- Búsqueda de usuario por email
- Hash de nueva contraseña con bcrypt
- Actualización de contraseña en la base de datos
- Actualización de fecha_actualizacion
- Retorno de mensaje de éxito

**Flujo del test**:
1. **Arrange**: Configura datos de usuario mock, email y nueva contraseña
2. **Act**: Ejecuta `changePasswordByEmail(email, newPassword)`
3. **Assert**: Verifica que:
   - Se retorna el mensaje esperado
   - Se buscó el usuario correctamente
   - Se hasheó la contraseña con salt rounds 10
   - Se actualizó el usuario con la nueva contraseña y fecha

**Datos de prueba**:
- Email: `'usuario@test.com'`
- Nueva contraseña: `'newPassword123'`
- Rol: `'PACIENTE'`

**Assertions clave**:
- `Usuario.findOne` llamado con `{ where: { email } }`
- `bcrypt.hash` llamado con `newPassword` y `10`
- `usuario.update` llamado con `password` hasheado y `fecha_actualizacion`

---

### ✅ Test: `debería cambiar la contraseña exitosamente para un médico`

**Ubicación**: Líneas 67-113

**Descripción**: Verifica que el cambio de contraseña funcione correctamente para usuarios con rol de médico.

**Qué prueba**:
- Mismo flujo que el test anterior pero verificando para médico
- El servicio debe funcionar igual independientemente del rol

**Datos de prueba**:
- Email: `'medico@test.com'`
- Nueva contraseña: `'medicoPassword123'`
- Rol: `'MEDICO'`

---

### ✅ Test: `debería actualizar la fecha_actualizacion correctamente`

**Ubicación**: Líneas 115-150

**Descripción**: Verifica que la fecha de actualización se actualice correctamente al cambiar la contraseña.

**Qué prueba**:
- La fecha_actualizacion debe ser una instancia de Date
- La nueva fecha debe ser mayor o igual a la fecha anterior

**Assertions clave**:
- `fecha_actualizacion` es instancia de `Date`
- `fecha_actualizacion.getTime()` >= `beforeUpdate.getTime()`

---

## 2. Casos Límite (Edge Cases)

### 📧 Test: `debería manejar email con formato límite (muy largo)`

**Ubicación**: Líneas 154-180

**Descripción**: Valida que el servicio maneje correctamente emails con formatos extremos, como emails muy largos.

**Qué prueba**:
- Email con más de 250 caracteres antes del dominio
- El servicio debe procesar el email sin errores

**Datos de prueba**:
- Email: `'a'.repeat(250) + '@test.com'`

---

### 🔒 Test: `debería manejar contraseña muy corta (mínimo permitido)`

**Ubicación**: Líneas 182-208

**Descripción**: Valida que el servicio procese contraseñas en el límite mínimo (6 caracteres). Nota: El controlador valida la longitud, pero el servicio debe manejarlo si se pasa.

**Qué prueba**:
- Contraseña con exactamente 6 caracteres
- El servicio debe intentar hashearla

**Datos de prueba**:
- Password: `'123456'` (6 caracteres)

---

### 🔒 Test: `debería manejar contraseña muy larga`

**Ubicación**: Líneas 210-236

**Descripción**: Valida que el servicio maneje contraseñas extremadamente largas.

**Qué prueba**:
- Contraseña con 500 caracteres
- bcrypt debe procesarla correctamente

**Datos de prueba**:
- Password: `'a'.repeat(500)`

---

### 📧 Test: `debería manejar email con caracteres especiales`

**Ubicación**: Líneas 238-264

**Descripción**: Valida que el servicio maneje correctamente emails con caracteres especiales válidos (como `+`, guiones, múltiples dominios).

**Qué prueba**:
- Email con formato complejo pero válido
- El servicio debe buscar el usuario correctamente

**Datos de prueba**:
- Email: `'usuario+test@test-domain.co.uk'` (formato complejo válido)

---

### 🔒 Test: `debería manejar contraseña con caracteres especiales`

**Ubicación**: Líneas 266-292

**Descripción**: Valida que el servicio maneje contraseñas con caracteres especiales (símbolos, mayúsculas, números).

**Qué prueba**:
- Contraseña con caracteres especiales
- bcrypt debe procesarla correctamente

**Datos de prueba**:
- Password: `'P@ssw0rd!#$%&*()'`

---

## 3. Casos de Excepción (Exception Cases)

### ❌ Test: `debería lanzar error cuando el usuario no existe`

**Ubicación**: Líneas 296-312

**Descripción**: Valida que el servicio lance un error cuando no se encuentra ningún usuario con el email proporcionado.

**Qué prueba**:
- `Usuario.findOne` retorna `null`
- El servicio debe lanzar error `'Usuario no encontrado con ese email'`
- No se deben ejecutar operaciones adicionales (bcrypt, update)

**Assertions clave**:
- `Usuario.findOne` es llamado
- `bcrypt.hash` NO es llamado
- Se lanza error `'Usuario no encontrado con ese email'`

**Datos de prueba**:
- Email: `'noexiste@test.com'`

---

### ❌ Test: `debería lanzar error cuando el email está vacío`

**Ubicación**: Líneas 314-328

**Descripción**: Valida que el servicio maneje correctamente cuando se intenta cambiar contraseña con un email vacío.

**Qué prueba**:
- Email es string vacío `''`
- `Usuario.findOne` retorna `null`
- El servicio debe lanzar error apropiado

**Assertions clave**:
- `Usuario.findOne` es llamado con `{ where: { email: '' } }`
- Se lanza error `'Usuario no encontrado con ese email'`

---

### 🔐 Test: `debería manejar error de bcrypt al hashear contraseña`

**Ubicación**: Líneas 330-354

**Descripción**: Valida que el servicio propague correctamente errores de bcrypt al hashear la contraseña.

**Qué prueba**:
- Usuario existe y se encuentra correctamente
- `bcrypt.hash` lanza un error
- El servicio debe propagar el error envuelto en el mensaje de error del servicio

**Assertions clave**:
- `Usuario.findOne` se ejecuta correctamente
- `bcrypt.hash` es llamado y lanza error
- Se propaga error `'Error al actualizar contraseña: Error interno de bcrypt'`

**Datos de prueba**:
- Error: `new Error('Error interno de bcrypt')`

---

### 🗄️ Test: `debería manejar error de base de datos al buscar usuario`

**Ubicación**: Líneas 356-375

**Descripción**: Valida que el servicio propague correctamente errores de conexión a la base de datos cuando falla la búsqueda del usuario.

**Qué prueba**:
- `Usuario.findOne` lanza un error de conexión
- El servicio debe propagar el error envuelto

**Assertions clave**:
- `Usuario.findOne` es llamado y lanza error
- `bcrypt.hash` NO es llamado
- Se propaga error `'Error al actualizar contraseña: Error de conexión a la base de datos'`

**Datos de prueba**:
- Error: `new Error('Error de conexión a la base de datos')`

---

### 🗄️ Test: `debería manejar error de base de datos al actualizar usuario`

**Ubicación**: Líneas 377-404

**Descripción**: Valida que el servicio maneje errores cuando falla la actualización del usuario en la base de datos.

**Qué prueba**:
- Usuario existe, contraseña se hashea correctamente
- `usuario.update` lanza un error
- El servicio debe propagar el error envuelto

**Assertions clave**:
- Todas las operaciones anteriores se ejecutan correctamente
- `usuario.update` es llamado y lanza error
- Se propaga error `'Error al actualizar contraseña: Error al actualizar en la base de datos'`

**Datos de prueba**:
- Error: `new Error('Error al actualizar en la base de datos')`

---

### ⏱️ Test: `debería manejar timeout de base de datos`

**Ubicación**: Líneas 406-424

**Descripción**: Valida que el servicio maneje correctamente timeouts de conexión a la base de datos.

**Qué prueba**:
- `Usuario.findOne` lanza un error de timeout
- El servicio debe propagar el error envuelto

**Assertions clave**:
- `Usuario.findOne` es llamado y lanza error de timeout
- Se propaga error `'Error al actualizar contraseña: Timeout de conexión a la base de datos'`

**Datos de prueba**:
- Error: `new Error('Timeout de conexión a la base de datos')`

---

### ⚠️ Test: `debería manejar error genérico del servicio`

**Ubicación**: Líneas 426-441

**Descripción**: Valida que el servicio maneje cualquier error genérico que pueda ocurrir.

**Qué prueba**:
- Cualquier error inesperado se propaga envuelto en el mensaje del servicio

**Error esperado**: `'Error al actualizar contraseña: Error inesperado'`

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`**: Limpia todos los mocks antes de cada test para asegurar aislamiento.

### Variables de Entorno

Los tests no requieren variables de entorno específicas, ya que todas las dependencias están mockeadas.

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del servicio de cambio de contraseña
npm test -- passwordChange.service.test

# Ejecutar en modo watch
npm run test:watch -- passwordChange.service.test

# Ejecutar con cobertura
npm run test:coverage -- passwordChange.service.test
```

## Cobertura Esperada

Los tests cubren:
- ✅ Casos exitosos (cambio de contraseña para paciente y médico)
- ✅ Casos límite (formatos extremos, valores límite)
- ✅ Casos de error de infraestructura (bcrypt, base de datos, timeouts)
- ✅ Casos de validación (usuario no encontrado)

## Notas Importantes

1. **Aislamiento Completo**: Todos los tests están completamente aislados mediante mocks. No hay dependencias de servicios externos reales.

2. **Patrón AAA**: Los tests siguen el patrón Arrange-Act-Assert (AAA) para claridad.

3. **Manejo de Errores**: El servicio envuelve todos los errores en un mensaje genérico `'Error al actualizar contraseña: ${error.message}'`. Esto permite que el controlador capture y muestre mensajes descriptivos.

4. **Actualización de Fecha**: El servicio siempre actualiza `fecha_actualizacion` junto con la contraseña para mantener el registro de cuándo se hizo el cambio.

5. **Hash de Contraseñas**: Siempre se usa `bcrypt.hash` con salt rounds de 10, que es un valor estándar seguro.

6. **Validaciones**: El servicio no realiza validaciones de formato (email, longitud de contraseña), estas se hacen en el controlador. El servicio solo se encarga de la lógica de negocio.

7. **Método Update**: El test mockea el método `update` en el objeto usuario retornado por `findOne`. Esto es necesario porque Sequelize retorna instancias de modelo con métodos de instancia.

