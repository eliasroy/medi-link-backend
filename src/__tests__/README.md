# Tests Unitarios - Auth Service

Este directorio contiene los tests unitarios para el servicio de autenticación (`auth.service.ts`).

## Estructura de Tests

Los tests están organizados en tres categorías principales:

### 1. Casos Normales (`auth.service.normal.test.ts`)
- ✅ Login exitoso para médico
- ✅ Login exitoso para paciente
- Verificación de generación correcta de JWT
- Validación de mapeo de datos de usuario

### 2. Casos Límite (`auth.service.edge.test.ts`)
- ❌ Email inexistente
- ❌ Contraseña incorrecta
- ❌ Usuario sin perfil de médico o paciente
- 📧 Email con formato límite (muy largo)
- 🔒 Contraseña vacía
- 📧 Email vacío
- 📧 Caracteres especiales en email

### 3. Casos de Excepción (`auth.service.exception.test.ts`)
- ⚠️ JWT_SECRET no definido en variables de entorno
- 🗄️ Error de conexión a base de datos
- 🗄️ Error al consultar tabla médico
- 🗄️ Error al consultar tabla paciente
- 🔐 Error de bcrypt al comparar contraseñas
- 🎫 Error de JWT al generar token
- ⏱️ Timeout de conexión a base de datos

## Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar solo los tests del auth service
npm run test:auth
```

## Configuración

Los tests utilizan Jest con TypeScript y están configurados para:
- Mockear todas las dependencias externas (bcrypt, jwt, modelos de Sequelize)
- Usar variables de entorno de testing
- Generar reportes de cobertura
- Ejecutarse en modo Node.js

## Mocking

Los tests mockean las siguientes dependencias:
- `bcrypt` - Para comparación de contraseñas
- `jsonwebtoken` - Para generación de tokens JWT
- Modelos de Sequelize (`Usuario`, `Medico`, `Paciente`)
- Utilidades (`usuarioToDTO`)

Esto permite que los tests sean rápidos y no dependan de conexiones reales a base de datos.
