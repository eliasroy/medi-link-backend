# Tests Unitarios - Medico Controller

Este directorio contiene los tests unitarios para el controlador de médico (`medico.controller.ts`).

## Archivo de Test

- **`medico.controller.test.ts`**: Tests para la función `getMedicos` del controlador de médico.

## Descripción General

Este archivo de test verifica el comportamiento del controlador de médico, específicamente la función `getMedicos`, que actúa como intermediario entre las peticiones HTTP y el servicio de médico.

El controlador:
- Extrae parámetros de filtrado desde `req.query`
- Llama al servicio para obtener médicos filtrados
- Retorna los resultados en formato JSON
- Maneja errores retornando status 500

Los tests se enfocan en validar la gestión de respuestas HTTP (status codes y mensajes JSON) y la extracción correcta de parámetros de query.

## Mocking

Los tests mockean las siguientes dependencias:
- **`medico.service`**: Se mockea completamente para controlar las respuestas del servicio y validar que el controlador llama correctamente al servicio.

## Estructura de Tests

Los tests están organizados en tres categorías principales:

---

## 1. Casos Normales (Happy Path)

### ✅ Test: `debe responder 200 con la lista de médicos cuando no hay filtros`

**Ubicación**: Líneas 21-54

**Descripción**: Verifica el flujo exitoso cuando se solicitan médicos sin filtros.

**Qué prueba**:
- Cuando el servicio retorna una lista de médicos, el controlador debe responder con status 200 (por defecto)
- El controlador debe pasar correctamente los parámetros (objeto vacío) al servicio
- El controlador debe retornar la lista completa de médicos

**Expectativas**:
- `medicoService.listarMedicosFiltrados` debe ser llamado con `{}`
- `res.json` debe ser llamado con la lista de médicos
- `res.status` no debe ser llamado (indicando status 200 por defecto)

**Datos de prueba**:
- Query params: `{}`
- Resultado esperado: Array con 2 médicos

---

### ✅ Test: `debe responder 200 con médicos filtrados por nombre`

**Ubicación**: Líneas 56-80

**Descripción**: Verifica que el controlador pase correctamente los filtros del query string al servicio.

**Qué prueba**:
- Extracción de query params desde `req.query`
- Pasar los filtros correctamente al servicio
- Retornar los resultados filtrados

**Datos de prueba**:
- Query: `{ nombre: 'Juan' }`

---

### ✅ Test: `debe responder 200 con médicos filtrados por múltiples parámetros`

**Ubicación**: Líneas 82-115

**Descripción**: Verifica que el controlador maneje múltiples parámetros de filtrado simultáneamente.

**Qué prueba**:
- Extracción de múltiples query params
- Pasar todos los filtros al servicio
- Retornar resultados filtrados

**Datos de prueba**:
- Query: `{ nombre: 'María', id_especialidad: '2', calificacion_promedio: '4.0', anios_experiencia: '5' }`

**Nota**: Los valores numéricos vienen como strings desde query params HTTP.

---

### ✅ Test: `debe responder 200 con lista vacía cuando no hay médicos`

**Ubicación**: Líneas 117-137

**Descripción**: Verifica que el controlador maneje correctamente cuando el servicio retorna una lista vacía.

**Qué prueba**:
- Respuesta exitosa con array vacío
- Status 200 (éxito, simplemente no hay resultados)

**Datos de prueba**:
- Resultado del servicio: `[]`

---

## 2. Casos Límite (Edge Cases)

### 📝 Test: `debe manejar query params con valores vacíos`

**Ubicación**: Líneas 141-162

**Descripción**: Valida que el controlador maneje correctamente query params con strings vacíos.

**Qué prueba**:
- Query params con strings vacíos (`''`)
- El controlador debe pasar los valores tal cual al servicio (sin validar)

**Datos de prueba**:
- Query: `{ nombre: '', especialidad: '' }`

---

### 📝 Test: `debe manejar query params con valores numéricos como strings`

**Ubicación**: Líneas 164-188

**Descripción**: Valida que el controlador maneje valores numéricos que vienen como strings desde query params HTTP.

**Qué prueba**:
- Query params numéricos siempre vienen como strings en HTTP
- El controlador los pasa al servicio sin conversión (el servicio maneja la conversión si es necesario)

**Datos de prueba**:
- Query: `{ id_especialidad: '1', calificacion_promedio: '4.5', anios_experiencia: '10' }`

---

### 📝 Test: `debe manejar nombres con caracteres especiales en query params`

**Ubicación**: Líneas 190-212

**Descripción**: Valida que el controlador maneje correctamente caracteres especiales en query params (como acentos).

**Qué prueba**:
- Query params con caracteres especiales deben pasarse correctamente
- No debe haber problemas con encoding de caracteres

**Datos de prueba**:
- Query: `{ nombre: 'María José' }`

---

### 📝 Test: `debe manejar filtro por especialidad como texto`

**Ubicación**: Líneas 214-236

**Descripción**: Valida que el controlador maneje el filtro de especialidad cuando viene como texto.

**Datos de prueba**:
- Query: `{ especialidad: 'Cardiología' }`

---

### 📝 Test: `debe manejar filtro por número de colegiatura`

**Ubicación**: Líneas 238-260

**Descripción**: Valida que el controlador maneje el filtro por número de colegiatura.

**Datos de prueba**:
- Query: `{ nro_colegiatura: '12345' }`

---

## 3. Casos de Excepción (Exception Cases)

### ⚠️ Test: `debe responder 500 ante error de conexión a base de datos`

**Ubicación**: Líneas 264-284

**Descripción**: Valida que el controlador maneje correctamente errores de conexión a la base de datos.

**Qué prueba**:
- El controlador debe capturar errores del servicio
- Debe responder con status 500 y un mensaje de error apropiado
- Debe incluir el error original en la respuesta

**Expectativas**:
- `res.status(500)` debe ser llamado
- `res.json` debe contener `{ message: 'Error al obtener médicos', error: dbError }`

**Datos de prueba**:
- Error: `new Error('Error de conexión a la base de datos')`

---

### ⚠️ Test: `debe responder 500 ante timeout de base de datos`

**Ubicación**: Líneas 286-307

**Descripción**: Valida que el controlador maneje correctamente timeouts de conexión.

**Error esperado**: `'Timeout de conexión a la base de datos'`

---

### ⚠️ Test: `debe responder 500 ante error inesperado del servicio`

**Ubicación**: Líneas 309-330

**Descripción**: Valida que el controlador maneje cualquier error inesperado del servicio.

**Error esperado**: `'Error inesperado'`

---

### ⚠️ Test: `debe responder 500 cuando el servicio lanza error de vista no encontrada`

**Ubicación**: Líneas 332-352

**Descripción**: Valida que el controlador maneje errores cuando la vista de base de datos no está disponible.

**Error esperado**: `'VistaMedicos no encontrada'`

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
# Ejecutar solo los tests del controlador de médico
npm test -- medico.controller.test

# Ejecutar en modo watch
npm run test:watch -- medico.controller.test

# Ejecutar con cobertura
npm run test:coverage -- medico.controller.test
```

## Cobertura Esperada

Los tests deberían cubrir:
- ✅ Casos exitosos (listado sin filtros, con filtros simples y múltiples)
- ✅ Casos límite (valores vacíos, tipos de datos, caracteres especiales)
- ✅ Casos de error del servicio (errores de infraestructura)

## Notas Importantes

1. **Aislamiento**: Todos los tests están completamente aislados mediante mocks. No dependen de servicios reales ni de base de datos.

2. **Manejo de Errores**: El controlador siempre retorna status 500 para errores, lo cual es apropiado para errores del servidor/infraestructura. A diferencia de otros controladores que usan 400, este usa 500 porque los errores son generalmente de infraestructura (base de datos).

3. **Responsabilidades**: El controlador solo se encarga de:
   - Extraer parámetros de query (`req.query`)
   - Llamar al servicio correspondiente
   - Formatear la respuesta HTTP apropiada (200 para éxito, 500 para errores)
   - No realiza validaciones de negocio (eso es responsabilidad del servicio)

4. **Query Parameters**: Los query params en Express siempre vienen como strings. El controlador los pasa directamente al servicio, que se encarga de la conversión de tipos si es necesario.

5. **Status Codes**:
   - **200 OK**: Listado exitoso (por defecto, no se llama `res.status`)
   - **500 Internal Server Error**: Cualquier error (infraestructura, base de datos, etc.)

6. **Simplicidad del Controlador**: Este controlador es muy simple - solo extrae query params y llama al servicio. No hace validaciones adicionales, lo cual es correcto para un endpoint de consulta.

7. **Mensajes de Error**: El controlador retorna un objeto con `message` y `error`, incluyendo el error original completo. Esto puede ser útil para debugging pero en producción podría ser mejor no exponer detalles internos.

