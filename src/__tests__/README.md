# Tests Unitarios - Documentación Completa

Este directorio contiene todos los tests unitarios del proyecto backend. Los tests están organizados por capas de la arquitectura (controllers, services) para facilitar el mantenimiento y la comprensión.

## 📁 Estructura del Directorio

```
__tests__/
├── README.md                          # Este archivo - Documentación general
├── setup.ts                           # Configuración global de tests
├── controller/                        # Tests de controladores
│   ├── auth/
│   │   ├── auth.controller.test.ts   # Tests del controlador de autenticación
│   │   └── README.md                 # Documentación detallada de tests del controlador
│   └── usuario/
│       ├── usuario.controller.test.ts # Tests del controlador de usuario
│       └── README.md                 # Documentación detallada de tests del controlador
└── service/                           # Tests de servicios
    ├── auth/
    │   ├── auth.test.ts              # Tests del servicio de autenticación
    │   └── README.md                 # Documentación detallada de tests del servicio
    └── usuario/
        ├── usuario.service.test.ts    # Tests del servicio de usuario
        └── README.md                 # Documentación detallada de tests del servicio
```

## 📚 Documentación Detallada por Archivo de Test

Cada archivo de test tiene su propio README con explicaciones detalladas de cada test unitario:

### Controladores

- **[`controller/auth/README.md`](./controller/auth/README.md)**
  - Documentación completa de `auth.controller.test.ts`
  - Explicación de cada test del controlador de autenticación
  - Casos comunes, límite y excepciones
  - Ejemplos de uso y configuración

- **[`controller/usuario/README.md`](./controller/usuario/README.md)**
  - Documentación completa de `usuario.controller.test.ts`
  - Explicación de cada test del controlador de usuario
  - Tests para registro de pacientes y médicos
  - Casos comunes, límite y excepciones

### Servicios

- **[`service/auth/README.md`](./service/auth/README.md)**
  - Documentación completa de `auth.test.ts`
  - Explicación detallada de cada test del servicio de autenticación
  - Análisis de casos normales, límite y excepciones
  - Descripción del flujo completo de autenticación

- **[`service/usuario/README.md`](./service/usuario/README.md)**
  - Documentación completa de `usuario.service.test.ts`
  - Explicación detallada de cada test del servicio de usuario
  - Tests para funciones `registrarPaciente` y `registrarMedico`
  - Análisis completo de casos normales, límite y excepciones

## 🎯 Resumen de Cobertura de Tests

### Tests del Servicio de Autenticación (`auth.test.ts`)

#### ✅ Casos Normales (Happy Path)
- Login exitoso para médico
- Login exitoso para paciente
- Verificación de generación correcta de JWT
- Validación de mapeo de datos de usuario

#### ❌ Casos Límite (Edge Cases)
- Email inexistente
- Contraseña incorrecta
- Usuario sin perfil de médico o paciente
- Email con formato límite (muy largo)
- Contraseña vacía
- Email vacío
- Caracteres especiales en email

#### ⚠️ Casos de Excepción (Exception Cases)
- JWT_SECRET no definido en variables de entorno
- Error de conexión a base de datos
- Error al consultar tabla médico
- Error al consultar tabla paciente
- Error de bcrypt al comparar contraseñas
- Error de JWT al generar token
- Timeout de conexión a base de datos

### Tests del Controlador de Autenticación (`auth.controller.test.ts`)

#### ✅ Casos Comunes
- Respuesta 200 cuando el login es exitoso
- Validación de llamada correcta al servicio

#### ❌ Casos Límite
- Respuesta 400 cuando falta email
- Respuesta 400 cuando la contraseña es incorrecta
- Respuesta 400 cuando el usuario no tiene perfil

#### ⚠️ Casos de Excepción
- Respuesta 400 cuando falta JWT_SECRET
- Respuesta 400 ante error inesperado del servicio

### Tests del Servicio de Usuario (`usuario.service.test.ts`)

#### ✅ Casos Normales (Happy Path)
- Registro exitoso de paciente con todos los datos
- Registro exitoso de paciente solo con datos obligatorios
- Registro exitoso de médico con todos los datos
- Registro exitoso de médico sin años de experiencia

#### ❌ Casos Límite (Edge Cases)
- Email con formato límite (muy largo)
- Contraseñas muy cortas y muy largas
- Nombres con caracteres especiales
- Sexo con valor X para pacientes
- Número de colegiatura muy largo
- Calificaciones límite (0.0 y 5.0)
- Años de experiencia como 0

#### ⚠️ Casos de Excepción (Exception Cases)
- Error de bcrypt al hashear contraseñas
- Error de base de datos al crear usuario
- Error de base de datos al crear perfil (paciente/médico)
- Error de validación de email duplicado
- Error de validación de colegiatura duplicada (médicos)
- Timeout de conexión a base de datos

### Tests del Controlador de Usuario (`usuario.controller.test.ts`)

#### ✅ Casos Comunes
- Respuesta 201 cuando el registro de paciente es exitoso
- Respuesta 201 cuando el registro de médico es exitoso
- Validación de llamada correcta al servicio

#### ❌ Casos Límite
- Respuesta 400 cuando faltan campos obligatorios (nombre, email, password)
- Respuesta 400 cuando falta id_especialidad (médico)
- Respuesta 400 cuando falta nro_colegiatura (médico)
- Respuesta 400 cuando el email tiene formato inválido
- Respuesta 400 cuando el email ya existe
- Respuesta 400 cuando el número de colegiatura ya existe

#### ⚠️ Casos de Excepción
- Respuesta 400 ante error de conexión a base de datos
- Respuesta 400 ante error inesperado del servicio
- Respuesta 400 ante error de bcrypt
- Respuesta 400 ante timeout de base de datos

## 🚀 Comandos de Testing

### Comandos Generales

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar solo los tests de autenticación
npm run test:auth

# Ejecutar solo los tests de usuario
npm test -- usuario
```

### Comandos Específicos por Archivo

```bash
# Ejecutar solo los tests del controlador de autenticación
npm test -- auth.controller.test

# Ejecutar solo los tests del servicio de autenticación
npm test -- auth.test

# Ejecutar solo los tests del controlador de usuario
npm test -- usuario.controller.test

# Ejecutar solo los tests del servicio de usuario
npm test -- usuario.service.test

# Ejecutar tests en modo watch para un archivo específico
npm run test:watch -- auth.controller.test
npm run test:watch -- usuario.controller.test
```

## ⚙️ Configuración

### Framework y Herramientas

Los tests utilizan:
- **Jest**: Framework de testing para JavaScript/TypeScript
- **TypeScript**: Lenguaje de programación con tipos
- **Supertest** (si aplica): Para tests de integración HTTP

### Configuración de Jest

Los tests están configurados para:
- ✅ Mockear todas las dependencias externas (bcrypt, jwt, modelos de Sequelize)
- ✅ Usar variables de entorno de testing
- ✅ Generar reportes de cobertura HTML y LCOV
- ✅ Ejecutarse en modo Node.js (no browser)
- ✅ Limpiar mocks automáticamente entre tests

### Variables de Entorno para Tests

Los tests configuran automáticamente:
- `JWT_SECRET`: Clave secreta para generación de tokens JWT en tests

## 🎭 Estrategia de Mocking

Los tests utilizan mocks para aislar completamente las unidades bajo prueba:

### Dependencias Mockeadas

- **`bcrypt`**: Para comparación segura de contraseñas
- **`jsonwebtoken`**: Para generación de tokens JWT
- **Modelos de Sequelize**: `Usuario`, `Medico`, `Paciente`
- **Utilidades**: `usuarioToDTO` para mapeo de datos
- **Servicios**: Los controladores mockean los servicios

### Beneficios del Mocking

1. **Velocidad**: Los tests se ejecutan muy rápido al no depender de servicios externos
2. **Aislamiento**: Cada test es independiente y no afecta a otros
3. **Confiabilidad**: No hay dependencias de estado externo (base de datos, APIs, etc.)
4. **Control**: Se pueden simular escenarios específicos fácilmente

## 📊 Cobertura de Código

Para ver el reporte de cobertura después de ejecutar los tests:

```bash
npm run test:coverage
```

El reporte se generará en:
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`

### Metas de Cobertura

- ✅ Funciones: >80%
- ✅ Líneas: >80%
- ✅ Ramas: >75%
- ✅ Statements: >80%

## 🧪 Patrón de Testing (AAA)

Todos los tests siguen el patrón **Arrange-Act-Assert** (AAA):

```typescript
it('debería realizar login exitoso', async () => {
  // Arrange - Configurar datos y mocks
  const email = 'user@test.com';
  const password = 'password123';
  mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);

  // Act - Ejecutar la función bajo prueba
  const result = await login(email, password);

  // Assert - Verificar resultados
  expect(result).toEqual(expectedResult);
  expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
});
```

## 📝 Convenciones de Naming

### Nombres de Tests

Los nombres de tests son descriptivos y siguen el patrón:
- `debería [acción esperada] cuando [condición]`
- `debe [acción] cuando [condición]`

Ejemplos:
- `debe responder 200 con el resultado cuando el login es exitoso`
- `debería lanzar error cuando el email no existe`

### Organización con `describe`

Los tests están organizados usando `describe` blocks:
```typescript
describe('Auth Service - Tests Completos', () => {
  describe('Casos Normales', () => {
    // Tests de casos exitosos
  });
  
  describe('Casos Límite', () => {
    // Tests de casos límite
  });
  
  describe('Casos de Excepción', () => {
    // Tests de manejo de errores
  });
});
```

## 🔍 Verificación de Llamadas

Los tests no solo verifican resultados, sino también:
- ✅ Que las funciones se llamaron
- ✅ Que se llamaron con los parámetros correctos
- ✅ Que se llamaron en el orden esperado
- ✅ Que NO se llamaron funciones que no deberían ejecutarse

Ejemplo:
```typescript
expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
expect(mockJwt.sign).not.toHaveBeenCalled(); // No debería llamarse en este caso
```

## 📖 Lectura Recomendada

Para entender completamente los tests:

1. **Empieza aquí**: Lee este README para obtener una visión general
2. **Profundiza**: Lee los READMEs individuales de cada archivo de test
3. **Revisa el código**: Examina los archivos `.test.ts` para ver la implementación
4. **Ejecuta los tests**: Corre `npm test` para ver los tests en acción

## 🔗 Enlaces Relacionados

- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Guía de Testing en Node.js](https://nodejs.org/en/docs/guides/testing/)

## 📌 Notas Importantes

1. **Aislamiento Completo**: Todos los tests están completamente aislados mediante mocks
2. **Sin Dependencias Externas**: No hay conexiones reales a base de datos o servicios externos
3. **Setup Automático**: Los mocks se limpian automáticamente entre tests
4. **Documentación Detallada**: Cada test tiene su explicación en los READMEs correspondientes

## 🤝 Contribución

Al agregar nuevos tests:

1. Sigue el patrón AAA (Arrange-Act-Assert)
2. Usa nombres descriptivos para los tests
3. Agrupa tests relacionados con `describe`
4. Mockea todas las dependencias externas
5. Documenta casos complejos o importantes
6. Actualiza este README si agregas nuevas categorías de tests

---

**Última actualización**: Los READMEs individuales contienen la información más detallada y actualizada sobre cada archivo de test.
