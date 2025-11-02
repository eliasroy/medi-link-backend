# Tests Unitarios - Auth Service

Este directorio contiene los tests unitarios para el servicio de autenticación (`auth.service.ts`).

## Archivo de Test

- **`auth.test.ts`**: Tests completos para la función `login` del servicio de autenticación.

## Descripción General

Este archivo de test verifica el comportamiento del servicio de autenticación, específicamente la función `login`, que es responsable de:
- Buscar usuarios en la base de datos
- Validar credenciales (email y contraseña)
- Verificar que el usuario tenga un perfil válido (MÉDICO o PACIENTE)
- Generar tokens JWT
- Mapear datos de usuario a DTOs

Los tests cubren casos normales, casos límite y casos de excepción para asegurar robustez del servicio.

## Mocking

Los tests mockean las siguientes dependencias:
- **`bcrypt`**: Para comparación segura de contraseñas
- **`jsonwebtoken`**: Para generación de tokens JWT
- **Modelos de Sequelize**: `Usuario`, `Medico`, `Paciente`
- **Utilidades**: `usuarioToDTO` para mapeo de datos

## Estructura de Tests

Los tests están organizados en tres suites principales dentro de `describe('Auth Service - Tests Completos')`:

---

## 1. Casos Normales (Happy Path)

### ✅ Test: `debería realizar login exitoso para un médico`

**Ubicación**: Líneas 47-124

**Descripción**: Verifica el flujo completo de autenticación exitosa para un usuario con perfil de médico.

**Qué prueba**:
- Búsqueda de usuario por email
- Comparación de contraseña con bcrypt
- Búsqueda del perfil de médico asociado
- Generación de token JWT con los datos correctos
- Mapeo de datos de usuario a DTO
- Retorno de respuesta con estructura esperada

**Flujo del test**:
1. **Arrange**: Configura datos mock de usuario médico, perfil médico, token y DTO
2. **Act**: Ejecuta `login(email, password)`
3. **Assert**: Verifica que:
   - Se retorna el objeto esperado con `mensaje`, `token`, `idUser` y `usuario`
   - Se llamaron todas las funciones necesarias con los parámetros correctos
   - El token JWT se generó con `id` del médico y rol `'MEDICO'`
   - El mapper fue llamado con los datos correctos

**Datos de prueba**:
- Email: `'medico@test.com'`
- Password: `'password123'`
- Rol: `'MEDICO'`
- ID Médico: `100`

**Assertions clave**:
- `Usuario.findOne` llamado con `{ where: { email } }`
- `bcrypt.compare` llamado con password y hash
- `Medico.findOne` llamado con `{ where: { id_usuario: userId } }`
- `JWT.sign` llamado con `{ id: medicoId, rol: 'MEDICO' }`, secret y `{ expiresIn: '11h' }`
- `usuarioToDTO` llamado con datos del usuario y `medicoId`

---

### ✅ Test: `debería realizar login exitoso para un paciente`

**Ubicación**: Líneas 126-202

**Descripción**: Verifica el flujo completo de autenticación exitosa para un usuario con perfil de paciente.

**Qué prueba**:
- Mismo flujo que el test de médico, pero verificando el perfil de paciente
- El token JWT debe contener el ID del paciente y rol `'PACIENTE'`
- La búsqueda de médico debe retornar `null` y la de paciente debe encontrar el perfil

**Flujo del test**:
1. **Arrange**: Configura datos mock de usuario paciente, perfil paciente, token y DTO
2. **Act**: Ejecuta `login(email, password)`
3. **Assert**: Verifica estructura de respuesta y llamadas correctas

**Datos de prueba**:
- Email: `'paciente@test.com'`
- Password: `'password123'`
- Rol: `'PACIENTE'`
- ID Paciente: `200`

**Assertions clave**:
- `Paciente.findOne` llamado y retorna datos válidos
- `Medico.findOne` retorna `null`
- `JWT.sign` llamado con `{ id: pacienteId, rol: 'PACIENTE' }`
- `usuarioToDTO` llamado con `pacienteId`

---

## 2. Casos Límite (Edge Cases)

### ❌ Test: `debería lanzar error cuando el email no existe`

**Ubicación**: Líneas 206-224

**Descripción**: Valida que el servicio lance un error cuando no se encuentra ningún usuario con el email proporcionado.

**Qué prueba**:
- `Usuario.findOne` retorna `null`
- El servicio debe lanzar error `'Usuario no encontrado'`
- No se deben ejecutar operaciones adicionales (bcrypt, búsqueda de perfiles)

**Assertions clave**:
- `Usuario.findOne` es llamado
- `bcrypt.compare` NO es llamado
- `Medico.findOne` y `Paciente.findOne` NO son llamados
- Se lanza error `'Usuario no encontrado'`

**Datos de prueba**:
- Email: `'noexiste@test.com'`
- Password: `'password123'`

---

### ❌ Test: `debería lanzar error cuando la contraseña es incorrecta`

**Ubicación**: Líneas 226-261

**Descripción**: Valida que el servicio detecte cuando la contraseña proporcionada no coincide con la almacenada en la base de datos.

**Qué prueba**:
- Usuario existe y se encuentra correctamente
- `bcrypt.compare` retorna `false`
- El servicio debe lanzar error antes de buscar perfiles

**Assertions clave**:
- `Usuario.findOne` es llamado y retorna datos
- `bcrypt.compare` es llamado y retorna `false`
- `Medico.findOne` y `Paciente.findOne` NO son llamados
- Se lanza error `'Contraseña incorrecta'`

**Datos de prueba**:
- Email: `'usuario@test.com'`
- Password: `'passwordIncorrecta'` (no coincide con el hash almacenado)

---

### ❌ Test: `debería lanzar error cuando el usuario no tiene perfil de médico ni paciente`

**Ubicación**: Líneas 263-301

**Descripción**: Valida que el servicio rechace usuarios que existen pero no tienen un perfil válido (ni médico ni paciente) asociado.

**Qué prueba**:
- Usuario existe y contraseña es correcta
- Tanto `Medico.findOne` como `Paciente.findOne` retornan `null`
- El servicio debe lanzar error antes de generar token

**Assertions clave**:
- Todas las búsquedas se ejecutan correctamente
- Ambas búsquedas de perfil retornan `null`
- `JWT.sign` NO es llamado
- Se lanza error `'El usuario no tiene perfil de MÉDICO o PACIENTE'`

**Datos de prueba**:
- Email: `'usuario@test.com'`
- Password: `'password123'`
- Estado: Usuario existe pero sin perfil asociado

---

### 📧 Test: `debería manejar email con formato límite (muy largo)`

**Ubicación**: Líneas 303-316

**Descripción**: Valida que el servicio maneje correctamente emails con formatos extremos, como emails muy largos.

**Qué prueba**:
- Email con 300 caracteres antes del dominio
- El servicio debe manejar el email sin errores y lanzar `'Usuario no encontrado'` apropiadamente

**Assertions clave**:
- `Usuario.findOne` es llamado con el email largo
- Se lanza error `'Usuario no encontrado'` (comportamiento esperado)

**Datos de prueba**:
- Email: `'a'.repeat(300) + '@test.com'` (más de 300 caracteres)
- Password: `'password123'`

---

### 🔒 Test: `debería manejar contraseña vacía`

**Ubicación**: Líneas 318-348

**Descripción**: Valida que el servicio maneje correctamente cuando se intenta autenticar con una contraseña vacía.

**Qué prueba**:
- Usuario existe
- Contraseña es string vacío `''`
- `bcrypt.compare` debe ser llamado con la contraseña vacía y retornar `false`

**Assertions clave**:
- `bcrypt.compare` es llamado con `''` y el hash
- Se lanza error `'Contraseña incorrecta'`

**Datos de prueba**:
- Email: `'usuario@test.com'`
- Password: `''` (vacío)

---

### 📧 Test: `debería manejar email vacío`

**Ubicación**: Líneas 350-363

**Descripción**: Valida que el servicio maneje correctamente cuando se intenta autenticar con un email vacío.

**Qué prueba**:
- Email es string vacío `''`
- `Usuario.findOne` es llamado con email vacío
- No se encuentra usuario y se lanza error apropiado

**Assertions clave**:
- `Usuario.findOne` es llamado con `{ where: { email: '' } }`
- Se lanza error `'Usuario no encontrado'`

**Datos de prueba**:
- Email: `''` (vacío)
- Password: `'password123'`

---

### 📧 Test: `debería manejar caracteres especiales en email`

**Ubicación**: Líneas 365-378

**Descripción**: Valida que el servicio maneje correctamente emails con caracteres especiales válidos (como `+`, guiones, múltiples dominios).

**Qué prueba**:
- Email con formato complejo pero válido: `usuario+test@test-domain.co.uk`
- El servicio debe buscar el usuario correctamente

**Assertions clave**:
- `Usuario.findOne` es llamado con el email completo (incluyendo caracteres especiales)
- Si no existe, se lanza `'Usuario no encontrado'` correctamente

**Datos de prueba**:
- Email: `'usuario+test@test-domain.co.uk'` (formato complejo válido)
- Password: `'password123'`

---

## 3. Casos de Excepción (Exception Cases)

### ⚠️ Test: `debería lanzar error cuando JWT_SECRET no está definido`

**Ubicación**: Líneas 382-439

**Descripción**: Valida que el servicio detecte cuando falta la variable de entorno `JWT_SECRET`, necesaria para generar tokens.

**Qué prueba**:
- Usuario existe, contraseña correcta, perfil existe
- `process.env.JWT_SECRET` no está definido
- El servicio debe lanzar error antes de intentar generar el token

**Flujo del test**:
1. Elimina `JWT_SECRET` del entorno
2. Configura todos los mocks para un flujo exitoso hasta la generación del token
3. Verifica que se lanza el error apropiado

**Assertions clave**:
- Todas las búsquedas se ejecutan correctamente
- `bcrypt.compare` retorna `true`
- Se encuentran el usuario y el perfil
- `JWT.sign` NO es llamado (el error ocurre antes)
- Se lanza error `' JWT_SECRET no está definido en .env'`

**Datos de prueba**:
- Email: `'usuario@test.com'`
- Password: `'password123'`
- Estado: `process.env.JWT_SECRET` es `undefined`

---

### 🗄️ Test: `debería manejar error de base de datos al buscar usuario`

**Ubicación**: Líneas 441-460

**Descripción**: Valida que el servicio propague correctamente errores de conexión a la base de datos cuando falla la búsqueda del usuario.

**Qué prueba**:
- `Usuario.findOne` lanza un error de conexión
- El servicio debe propagar el error sin intentar otras operaciones

**Assertions clave**:
- `Usuario.findOne` es llamado y lanza error
- `bcrypt.compare` NO es llamado
- `Medico.findOne` y `Paciente.findOne` NO son llamados
- Se propaga el error `'Error de conexión a la base de datos'`

**Datos de prueba**:
- Error: `new Error('Error de conexión a la base de datos')`

---

### 🗄️ Test: `debería manejar error de base de datos al buscar médico`

**Ubicación**: Líneas 462-503

**Descripción**: Valida que el servicio maneje errores cuando falla la búsqueda del perfil de médico en la base de datos.

**Qué prueba**:
- Usuario existe, contraseña correcta
- `Medico.findOne` lanza un error
- El servicio debe propagar el error antes de buscar paciente o generar token

**Assertions clave**:
- `Usuario.findOne` y `bcrypt.compare` se ejecutan correctamente
- `Medico.findOne` es llamado y lanza error
- `Paciente.findOne` NO es llamado
- `JWT.sign` NO es llamado
- Se propaga el error `'Error al consultar tabla médico'`

**Datos de prueba**:
- Error: `new Error('Error al consultar tabla médico')`

---

### 🗄️ Test: `debería manejar error de base de datos al buscar paciente`

**Ubicación**: Líneas 505-547

**Descripción**: Valida que el servicio maneje errores cuando falla la búsqueda del perfil de paciente en la base de datos.

**Qué prueba**:
- Usuario paciente existe, contraseña correcta, médico no existe
- `Paciente.findOne` lanza un error
- El servicio debe propagar el error antes de generar token

**Assertions clave**:
- Todas las búsquedas anteriores se ejecutan correctamente
- `Paciente.findOne` es llamado y lanza error
- `JWT.sign` NO es llamado
- Se propaga el error `'Error al consultar tabla paciente'`

**Datos de prueba**:
- Error: `new Error('Error al consultar tabla paciente')`
- Rol: `'PACIENTE'`

---

### 🔐 Test: `debería manejar error de bcrypt al comparar contraseñas`

**Ubicación**: Líneas 549-586

**Descripción**: Valida que el servicio maneje errores internos de la librería bcrypt al comparar contraseñas.

**Qué prueba**:
- Usuario existe
- `bcrypt.compare` lanza un error interno
- El servicio debe propagar el error sin continuar el flujo

**Assertions clave**:
- `Usuario.findOne` se ejecuta correctamente
- `bcrypt.compare` es llamado y lanza error
- `Medico.findOne`, `Paciente.findOne` y `JWT.sign` NO son llamados
- Se propaga el error de bcrypt

**Datos de prueba**:
- Error: `new Error('Error interno de bcrypt')`

---

### 🎫 Test: `debería manejar error de JWT al generar token`

**Ubicación**: Líneas 588-646

**Descripción**: Valida que el servicio maneje errores cuando falla la generación del token JWT (por ejemplo, si el secret es inválido o hay un error en la librería).

**Qué prueba**:
- Todo el flujo es exitoso hasta la generación del token
- `JWT.sign` lanza un error
- El servicio debe propagar el error apropiadamente

**Assertions clave**:
- Todas las búsquedas se ejecutan correctamente
- `JWT.sign` es llamado y lanza error
- Se propaga el error `'Error al generar JWT'`

**Datos de prueba**:
- Error: `new Error('Error al generar JWT')`
- Estado: `JWT.sign` implementado para lanzar error cuando se llama

---

### ⏱️ Test: `debería manejar timeout de base de datos`

**Ubicación**: Líneas 648-662

**Descripción**: Valida que el servicio maneje correctamente timeouts de conexión a la base de datos, que son errores comunes en producción.

**Qué prueba**:
- `Usuario.findOne` lanza un error de timeout
- El servicio debe propagar el error sin intentar otras operaciones

**Assertions clave**:
- `Usuario.findOne` es llamado y lanza error de timeout
- No se ejecutan otras operaciones
- Se propaga el error `'Timeout de conexión a la base de datos'`

**Datos de prueba**:
- Error: `new Error('Timeout de conexión a la base de datos')`

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`** (líneas 41-44):
  - Limpia todos los mocks antes de cada test
  - Configura `process.env.JWT_SECRET = 'test-secret-key'` para la mayoría de los tests

### Variables de Entorno

Los tests configuran `JWT_SECRET` en el `beforeEach`, pero algunos tests específicos lo eliminan o modifican para probar esos escenarios.

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del servicio de autenticación
npm test -- auth.test

# Ejecutar en modo watch
npm run test:watch -- auth.test

# Ejecutar con cobertura
npm run test:coverage -- auth.test
```

## Cobertura Esperada

Los tests cubren:
- ✅ Casos exitosos (login para médico y paciente)
- ✅ Casos de error de validación (email/contraseña incorrectos, sin perfil)
- ✅ Casos límite (emails/contraseñas vacías, formatos especiales)
- ✅ Casos de error de configuración (JWT_SECRET faltante)
- ✅ Casos de error de infraestructura (base de datos, bcrypt, JWT)

## Notas Importantes

1. **Aislamiento Completo**: Todos los tests están completamente aislados mediante mocks. No hay dependencias de servicios externos reales.

2. **Patrón AAA**: Los tests siguen el patrón Arrange-Act-Assert (AAA) para claridad:
   - **Arrange**: Configura datos y mocks
   - **Act**: Ejecuta la función bajo prueba
   - **Assert**: Verifica resultados y llamadas

3. **Verificación de Llamadas**: Los tests no solo verifican resultados, sino también que las funciones se llamaron con los parámetros correctos y en el orden esperado.

4. **Manejo de Errores**: Todos los errores se propagan como excepciones, que deben ser capturadas por el controlador.

