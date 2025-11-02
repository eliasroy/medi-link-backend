# Tests Unitarios - Usuario Service

Este directorio contiene los tests unitarios para el servicio de usuario (`usuario.service.ts`).

## Archivo de Test

- **`usuario.service.test.ts`**: Tests completos para las funciones `registrarPaciente` y `registrarMedico` del servicio de usuario.

## Descripción General

Este archivo de test verifica el comportamiento del servicio de usuario, específicamente las funciones:
- **`registrarPaciente`**: Registra un nuevo usuario con perfil de paciente
- **`registrarMedico`**: Registra un nuevo usuario con perfil de médico

Los tests cubren casos normales, casos límite y casos de excepción para asegurar robustez del servicio en el proceso de registro de usuarios.

## Mocking

Los tests mockean las siguientes dependencias:
- **`bcrypt`**: Para hasheo seguro de contraseñas
- **Modelos de Sequelize**: `Usuario`, `Paciente`, `Medico`

Esto permite que los tests sean rápidos y no dependan de conexiones reales a base de datos.

## Estructura de Tests

Los tests están organizados en dos suites principales, una para cada función:

---

## 1. registrarPaciente - Casos Normales

### ✅ Test: `debería registrar un paciente exitosamente con todos los datos`

**Ubicación**: Líneas 35-90

**Descripción**: Verifica el flujo completo de registro exitoso de un paciente con todos los campos opcionales incluidos.

**Qué prueba**:
- Hash de contraseña con bcrypt
- Creación de usuario en la base de datos
- Creación de perfil de paciente asociado
- Retorno de ambos objetos (usuario y paciente)

**Flujo del test**:
1. **Arrange**: Configura datos completos de paciente, mocks de bcrypt y modelos
2. **Act**: Ejecuta `registrarPaciente(pacienteData)`
3. **Assert**: Verifica que:
   - Se retorna el objeto esperado con usuario y paciente
   - bcrypt.hash fue llamado con la contraseña y salt rounds (10)
   - Usuario.create fue llamado con todos los campos correctos
   - Paciente.create fue llamado con los datos del paciente y el id_usuario correcto

**Datos de prueba**:
- Nombre: `'Juan'`
- Email: `'juan.perez@test.com'`
- Incluye: teléfono, fecha de nacimiento, sexo, dirección

**Assertions clave**:
- `bcrypt.hash` llamado con `password` y `10`
- `Usuario.create` llamado con rol `'PACIENTE'`
- `Paciente.create` llamado con `id_usuario` del usuario creado

---

### ✅ Test: `debería registrar un paciente exitosamente solo con datos obligatorios`

**Ubicación**: Líneas 92-130

**Descripción**: Verifica que el servicio puede registrar un paciente usando solo los campos obligatorios (nombre, paterno, materno, email, password).

**Qué prueba**:
- Registro exitoso sin campos opcionales (teléfono, fecha_nacimiento, sexo, direccion)
- Los campos opcionales se pasan como `undefined` correctamente

**Flujo del test**:
1. **Arrange**: Configura solo datos obligatorios
2. **Act**: Ejecuta `registrarPaciente` con datos mínimos
3. **Assert**: Verifica que el registro es exitoso con campos opcionales como `undefined`

**Datos de prueba**:
- Solo campos obligatorios
- Campos opcionales: `undefined`

---

## 2. registrarMedico - Casos Normales

### ✅ Test: `debería registrar un médico exitosamente con todos los datos`

**Ubicación**: Líneas 134-202

**Descripción**: Verifica el flujo completo de registro exitoso de un médico con todos los campos.

**Qué prueba**:
- Hash de contraseña
- Creación de usuario con rol MEDICO
- Creación de perfil de médico con especialidad, calificación, colegiatura y años de experiencia
- Retorno de ambos objetos

**Flujo del test**:
1. **Arrange**: Configura datos completos de médico
2. **Act**: Ejecuta `registrarMedico(medicoData)`
3. **Assert**: Verifica estructura de respuesta y llamadas correctas

**Datos de prueba**:
- Nombre: `'Dr. Carlos'`
- Email: `'carlos.rodriguez@test.com'`
- ID Especialidad: `1`
- Calificación: `4.5`
- Número de colegiatura: `'12345'`
- Años de experiencia: `10`

**Assertions clave**:
- `Usuario.create` llamado con rol `'MEDICO'`
- `Medico.create` llamado con `id_especialidad`, `calificacion_promedio`, `nro_colegiatura`, `anios_experiencia`

---

### ✅ Test: `debería registrar un médico exitosamente sin años de experiencia`

**Ubicación**: Líneas 204-242

**Descripción**: Verifica que el registro de médico funciona correctamente cuando no se proporcionan años de experiencia (campo opcional).

**Qué prueba**:
- Registro exitoso sin `anios_experiencia`
- El campo se pasa como `undefined` correctamente

**Assertions clave**:
- `Medico.create` llamado con `anios_experiencia: undefined`

---

## 3. registrarPaciente - Casos Límite

### 📧 Test: `debería manejar email con formato límite (muy largo)`

**Ubicación**: Líneas 246-281

**Descripción**: Valida que el servicio maneje correctamente emails con formatos extremos, como emails muy largos.

**Qué prueba**:
- Email con más de 250 caracteres antes del dominio
- El servicio debe procesar el email sin errores

**Datos de prueba**:
- Email: `'a'.repeat(250) + '@test.com'`

---

### 🔒 Test: `debería manejar contraseña muy corta`

**Ubicación**: Líneas 283-313

**Descripción**: Valida que el servicio procese contraseñas muy cortas (aunque no sean recomendadas, el servicio debe manejarlas).

**Qué prueba**:
- Contraseña con solo 3 caracteres
- El servicio debe intentar hashearla

**Datos de prueba**:
- Password: `'123'`

---

### 🔒 Test: `debería manejar contraseña muy larga`

**Ubicación**: Líneas 315-344

**Descripción**: Valida que el servicio maneje contraseñas extremadamente largas.

**Qué prueba**:
- Contraseña con 500 caracteres
- bcrypt debe procesarla correctamente

**Datos de prueba**:
- Password: `'a'.repeat(500)`

---

### 📝 Test: `debería manejar nombres con caracteres especiales`

**Ubicación**: Líneas 346-378

**Descripción**: Valida que el servicio maneje correctamente nombres con caracteres especiales como acentos, apostrofes y guiones.

**Qué prueba**:
- Nombres con acentos (María)
- Apellidos con apostrofes (O'Brien)
- Apellidos con guiones (García-López)

**Datos de prueba**:
- Nombre: `"María José"`
- Paterno: `"O'Brien"`
- Materno: `"García-López"`

---

### ⚥ Test: `debería manejar sexo con valor X`

**Ubicación**: Líneas 380-410

**Descripción**: Valida que el servicio acepte el valor `'X'` para el campo sexo (indicador de no binario/otro).

**Qué prueba**:
- Sexo con valor `'X'`
- El valor se guarda correctamente en el perfil de paciente

**Datos de prueba**:
- Sexo: `'X'`

---

## 4. registrarMedico - Casos Límite

### 📄 Test: `debería manejar número de colegiatura muy largo`

**Ubicación**: Líneas 414-451

**Descripción**: Valida que el servicio maneje números de colegiatura con formatos largos o complejos.

**Qué prueba**:
- Número de colegiatura con 100 caracteres
- El servicio debe procesarlo sin errores

**Datos de prueba**:
- Nro. Colegiatura: `'A'.repeat(100)`

---

### ⭐ Test: `debería manejar calificación límite (0.0)`

**Ubicación**: Líneas 453-491

**Descripción**: Valida que el servicio acepte calificaciones mínimas (0.0) para médicos nuevos sin calificaciones previas.

**Qué prueba**:
- Calificación de 0.0
- Se guarda correctamente en el perfil de médico

**Datos de prueba**:
- Calificación: `0.0`

---

### ⭐ Test: `debería manejar calificación límite (5.0)`

**Ubicación**: Líneas 493-531

**Descripción**: Valida que el servicio acepte calificaciones máximas (5.0).

**Qué prueba**:
- Calificación de 5.0
- Se guarda correctamente

**Datos de prueba**:
- Calificación: `5.0`

---

### 📅 Test: `debería manejar años de experiencia como 0`

**Ubicación**: Líneas 533-571

**Descripción**: Valida que el servicio acepte 0 años de experiencia para médicos recién graduados.

**Qué prueba**:
- Años de experiencia: `0`
- Se guarda correctamente (diferente de `undefined`)

**Datos de prueba**:
- Años de experiencia: `0`

---

## 5. registrarPaciente - Casos de Excepción

### 🔐 Test: `debería manejar error de bcrypt al hashear contraseña`

**Ubicación**: Líneas 575-598

**Descripción**: Valida que el servicio propague correctamente errores de bcrypt al hashear la contraseña.

**Qué prueba**:
- `bcrypt.hash` lanza un error
- El servicio debe propagar el error sin intentar crear registros

**Assertions clave**:
- `bcrypt.hash` es llamado y lanza error
- `Usuario.create` y `Paciente.create` NO son llamados

**Error esperado**: `'Error interno de bcrypt'`

---

### 🗄️ Test: `debería manejar error de base de datos al crear usuario`

**Ubicación**: Líneas 600-623

**Descripción**: Valida que el servicio maneje errores cuando falla la creación del usuario en la base de datos.

**Qué prueba**:
- Contraseña se hashea correctamente
- `Usuario.create` lanza error de conexión
- El servicio propaga el error antes de crear paciente

**Assertions clave**:
- `bcrypt.hash` se ejecuta correctamente
- `Usuario.create` lanza error
- `Paciente.create` NO es llamado

**Error esperado**: `'Error de conexión a la base de datos'`

---

### 🗄️ Test: `debería manejar error de base de datos al crear paciente`

**Ubicación**: Líneas 625-662

**Descripción**: Valida que el servicio maneje errores cuando falla la creación del perfil de paciente.

**Qué prueba**:
- Usuario se crea correctamente
- `Paciente.create` lanza error
- El servicio propaga el error (nota: en producción, esto podría requerir rollback de transacción)

**Assertions clave**:
- Todas las operaciones anteriores se ejecutan correctamente
- `Paciente.create` lanza error

**Error esperado**: `'Error al crear registro de paciente'`

---

### 📧 Test: `debería manejar error de validación de email duplicado`

**Ubicación**: Líneas 664-686

**Descripción**: Valida que el servicio detecte y propague errores cuando se intenta registrar un email que ya existe.

**Qué prueba**:
- Contraseña se hashea
- `Usuario.create` detecta email duplicado y lanza error
- El servicio propaga el error

**Error esperado**: `'Email ya existe en la base de datos'`

---

### ⏱️ Test: `debería manejar timeout de base de datos`

**Ubicación**: Líneas 688-710

**Descripción**: Valida que el servicio maneje timeouts de conexión a la base de datos.

**Qué prueba**:
- `Usuario.create` lanza error de timeout
- El servicio propaga el error

**Error esperado**: `'Timeout de conexión a la base de datos'`

---

## 6. registrarMedico - Casos de Excepción

### 🔐 Test: `debería manejar error de bcrypt al hashear contraseña`

**Ubicación**: Líneas 714-738

**Descripción**: Similar al caso de paciente, valida manejo de errores de bcrypt para médicos.

**Error esperado**: `'Error interno de bcrypt'`

---

### 🗄️ Test: `debería manejar error de base de datos al crear usuario`

**Ubicación**: Líneas 740-763

**Descripción**: Valida manejo de errores de base de datos al crear usuario médico.

**Error esperado**: `'Error de conexión a la base de datos'`

---

### 🗄️ Test: `debería manejar error de base de datos al crear médico`

**Ubicación**: Líneas 765-799

**Descripción**: Valida manejo de errores cuando falla la creación del perfil de médico.

**Qué prueba**:
- Usuario se crea correctamente
- `Medico.create` lanza error
- El servicio propaga el error

**Error esperado**: `'Error al crear registro de médico'`

---

### 📧 Test: `debería manejar error de validación de email duplicado`

**Ubicación**: Líneas 801-823

**Descripción**: Valida detección de emails duplicados para médicos.

**Error esperado**: `'Email ya existe en la base de datos'`

---

### 🆔 Test: `debería manejar error de validación de número de colegiatura duplicado`

**Ubicación**: Líneas 825-860

**Descripción**: Valida detección de números de colegiatura duplicados (único para médicos).

**Qué prueba**:
- Usuario se crea correctamente
- `Medico.create` detecta colegiatura duplicada y lanza error
- El servicio propaga el error

**Error esperado**: `'Número de colegiatura ya existe'`

---

### ⏱️ Test: `debería manejar timeout de base de datos`

**Ubicación**: Líneas 862-884

**Descripción**: Valida manejo de timeouts para registro de médicos.

**Error esperado**: `'Timeout de conexión a la base de datos'`

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`**: Limpia todos los mocks antes de cada test para asegurar aislamiento.

### Variables de Entorno

Los tests no requieren variables de entorno específicas, ya que todas las dependencias están mockeadas.

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del servicio de usuario
npm test -- usuario.service.test

# Ejecutar en modo watch
npm run test:watch -- usuario.service.test

# Ejecutar con cobertura
npm run test:coverage -- usuario.service.test
```

## Cobertura Esperada

Los tests cubren:
- ✅ Casos exitosos (registro completo y mínimo para ambos tipos)
- ✅ Casos límite (formatos extremos, valores límite)
- ✅ Casos de error de infraestructura (bcrypt, base de datos, timeouts)
- ✅ Casos de validación (emails duplicados, colegiaturas duplicadas)

## Notas Importantes

1. **Aislamiento Completo**: Todos los tests están completamente aislados mediante mocks. No hay dependencias de servicios externos reales.

2. **Patrón AAA**: Los tests siguen el patrón Arrange-Act-Assert (AAA) para claridad.

3. **Transacciones**: En producción, estas operaciones deberían estar en transacciones para asegurar atomicidad (si falla paciente, rollback de usuario). Los tests actuales no cubren esto, pero pueden agregarse tests de integración para validarlo.

4. **Validaciones**: Los tests asumen que las validaciones de datos (email formato, campos requeridos) se hacen en capas superiores o en el modelo. El servicio solo se encarga de la lógica de negocio.

5. **Hash de Contraseñas**: Siempre se usa `bcrypt.hash` con salt rounds de 10, que es un valor estándar seguro.

