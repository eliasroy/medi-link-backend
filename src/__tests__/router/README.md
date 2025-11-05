# Pruebas de Router

Este directorio contiene pruebas unitarias para todos los manejadores de rutas Express.js en la aplicación.

## Cobertura de Pruebas

Las pruebas de router cubren todos los archivos de rutas con casos de prueba completos:

### authRouter (`authRouter.test.ts`)
- **POST /auth/login**: Autenticación con casos normales, límite y excepción
- **POST /auth/change-password**: Funcionalidad de cambio de contraseña

### citaRoutes (`citaRoutes.test.ts`)
- **POST /citas/save**: Creación de citas
- **GET /citas/paciente/:idPaciente**: Recuperación de citas de paciente
- **DELETE /citas/:idCita**: Eliminación de citas
- **GET /citas/medico**: Recuperación de citas de médico

### consultaRoutes (`consultaRoutes.test.ts`)
- **POST /consultas/iniciar**: Inicio de consulta
- **PUT /consultas/actualizar/:id_consulta**: Actualizaciones de consulta
- **POST /consultas/calificar**: Calificación de consulta
- **GET /consultas/cita/:idCita**: Recuperación de consulta por cita

### especialidadRoutes (`especialidad.routes.test.ts`)
- **GET /especialidades/**: Listado de especialidades

### horarioRoutes (`horarioRoutes.test.ts`)
- **POST /horarios/save**: Creación de horarios
- **GET /horarios/disponibles/semana**: Horarios disponibles semanales
- **GET /horarios/semana**: Horarios semanales para pacientes
- **GET /horarios/disponibles/rango**: Horarios por rango de fechas

### medicoRoutes (`medico.routes.test.ts`)
- **GET /medicos/medicos**: Listado de médicos

### usuarioRoutes (`usuario.routes.test.ts`)
- **POST /usuarios/paciente**: Registro de paciente
- **POST /usuarios/medico**: Registro de médico

## Estructura de Pruebas

Cada archivo de prueba sigue una estructura consistente:

1. **Configuración**: Configuración de aplicación Express, simulación de middleware, simulación de controladores
2. **Casos Normales**: Prueba operaciones exitosas con datos válidos
3. **Casos Límite**: Prueba casos extremos, límites de validación y restricciones
4. **Casos de Excepción**: Prueba manejo de errores, errores del servidor y escenarios inesperados

## Estrategia de Pruebas

- **Supertest**: Usado para pruebas de solicitud/respuesta HTTP
- **Jest Mocks**: Controladores y middleware están simulados para aislar lógica de rutas
- **Simulación de Middleware**: Middleware de autenticación y autorización están simulados
- **Escenarios de Error**: Varias condiciones de error son probadas (códigos de estado 400, 404, 500)

## Metas de Cobertura

- **Sentencias**: 100%
- **Ramas**: 100%
- **Funciones**: 100%
- **Líneas**: 100%

## Ejecutando Pruebas

```bash
# Ejecutar todas las pruebas de router
npm test -- --testPathPattern=router

# Ejecutar prueba específica de router
npm test -- authRouter.test.ts

# Ejecutar con cobertura
npm test -- --testPathPattern=router --coverage
```

## Estrategia de Simulación

Las pruebas usan simulación completa:
- **Controladores**: Todos los métodos de controlador están simulados con Jest
- **Middleware**: Middleware de autenticación y autorización están simulados
- **Base de Datos**: No hay conexiones reales a base de datos (manejadas por simulaciones de servicio/controlador)
- **Servicios Externos**: Todas las dependencias externas están simuladas

## Datos de Prueba

Las pruebas usan conjuntos de datos realistas:
- Payloads de solicitud válidos que coinciden con especificaciones de API
- Valores de casos extremos (cadenas vacías, IDs grandes, caracteres especiales)
- Datos inválidos para probar validación y manejo de errores
- Varios roles de usuario y escenarios de autorización

## Categorías de Rutas

### Rutas Públicas
- Endpoints de autenticación (login, cambio de contraseña)
- Información pública (especialidades, horarios disponibles)

### Rutas Protegidas
- Rutas de paciente (gestión de citas, calificaciones)
- Rutas de médico (gestión de consultas, creación de horarios)
- Rutas de admin (registro de usuarios)

### Niveles de Autorización
- **PACIENTE**: Operaciones específicas de paciente
- **MEDICO**: Operaciones específicas de médico
- **Público**: No requiere autenticación