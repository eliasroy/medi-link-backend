# Tests Unitarios - Especialidad Controller

Este directorio contiene los tests unitarios para el controlador de especialidad (`especialidad.controller.ts`).

## Archivo de Test

- **`especialidad.controller.test.ts`**: Tests para el método estático `obtenerTodas` del controlador de especialidad.

## Descripción General

Este archivo de test verifica el comportamiento del controlador de especialidad, específicamente el método `obtenerTodas`, que actúa como intermediario entre las peticiones HTTP y el servicio de especialidad.

El controlador:
- Llama al servicio para obtener todas las especialidades
- Formatea la respuesta en un formato estándar con `success` y `data`
- Maneja errores retornando status 500 con formato de error consistente

Los tests se enfocan en validar la gestión de respuestas HTTP (status codes y mensajes JSON) y el formato de respuesta.

## Mocking

Los tests mockean las siguientes dependencias:
- **`especialidad.service`**: Se mockea completamente para controlar las respuestas del servicio y validar que el controlador llama correctamente al servicio.

## Estructura de Tests

Los tests están organizados en tres categorías principales:

---

## 1. Casos Normales (Happy Path)

### ✅ Test: `debe responder 200 con todas las especialidades cuando la consulta es exitosa`

**Ubicación**: Líneas 21-49

**Descripción**: Verifica el flujo exitoso cuando se obtienen todas las especialidades.

**Qué prueba**:
- Cuando el servicio retorna una lista de especialidades, el controlador debe responder con status 200 (por defecto)
- El controlador debe formatear la respuesta con `success: true` y `data`
- El controlador debe retornar todas las especialidades

**Expectativas**:
- `EspecialidadService.obtenerTodas` debe ser llamado
- `res.json` debe ser llamado con formato `{ success: true, data: especialidades }`
- `res.status` no debe ser llamado (indicando status 200 por defecto)

**Datos de prueba**:
- Resultado esperado: `{ success: true, data: [2 especialidades] }`

**Formato de respuesta**:
```json
{
  "success": true,
  "data": [
    {
      "id_especialidad": 1,
      "nombre": "Cardiología",
      "descripcion": "..."
    }
  ]
}
```

---

### ✅ Test: `debe responder 200 con lista vacía cuando no hay especialidades`

**Ubicación**: Líneas 51-72

**Descripción**: Verifica que el controlador maneje correctamente cuando el servicio retorna una lista vacía.

**Qué prueba**:
- Respuesta exitosa con array vacío
- Formato de respuesta correcto incluso sin datos

**Datos de prueba**:
- Resultado: `{ success: true, data: [] }`

---

### ✅ Test: `debe responder con formato correcto de respuesta exitosa`

**Ubicación**: Líneas 74-97

**Descripción**: Verifica que el formato de respuesta sea siempre consistente.

**Qué prueba**:
- Estructura de respuesta siempre tiene `success` y `data`
- `success` es `true` en casos exitosos
- `data` contiene el array de especialidades

**Assertions clave**:
- Formato de respuesta es correcto
- Se llama a `res.json` exactamente una vez

---

## 2. Casos Límite (Edge Cases)

### 📊 Test: `debe responder 200 cuando hay una sola especialidad`

**Ubicación**: Líneas 101-123

**Descripción**: Valida que el controlador maneje correctamente cuando solo hay una especialidad.

**Qué prueba**:
- Caso mínimo: una sola especialidad
- Formato de respuesta correcto

---

### 📊 Test: `debe responder 200 cuando hay muchas especialidades`

**Ubicación**: Líneas 125-150

**Descripción**: Valida que el controlador maneje grandes volúmenes de especialidades.

**Qué prueba**:
- 50 especialidades (límite superior)
- Todas se incluyen en la respuesta
- Formato de respuesta se mantiene

**Assertions clave**:
- `data` array tiene longitud 50
- Todas las especialidades están presentes

---

### 📝 Test: `debe manejar especialidades con caracteres especiales en nombres`

**Ubicación**: Líneas 152-177

**Descripción**: Valida que el controlador maneje correctamente nombres con acentos y caracteres especiales.

**Qué prueba**:
- Nombres con acentos deben pasarse correctamente
- Encoding de caracteres especiales debe funcionar

**Datos de prueba**:
- `'Cardiología'` (con acento)
- `'Otorrinolaringología'` (palabra larga con acento)

---

## 3. Casos de Excepción (Exception Cases)

### ⚠️ Test: `debe responder 500 ante error de conexión a base de datos`

**Ubicación**: Líneas 181-203

**Descripción**: Valida que el controlador maneje correctamente errores de conexión a la base de datos.

**Qué prueba**:
- El controlador debe capturar errores del servicio
- Debe responder con status 500 y formato de error apropiado
- Debe mantener formato consistente con `success: false` y `message`

**Expectativas**:
- `res.status(500)` debe ser llamado
- `res.json` debe contener `{ success: false, message: 'Error al obtener especialidades' }`

**Formato de error**:
```json
{
  "success": false,
  "message": "Error al obtener especialidades"
}
```

---

### ⚠️ Test: `debe responder 500 ante timeout de base de datos`

**Ubicación**: Líneas 205-227

**Descripción**: Valida que el controlador maneje correctamente timeouts de conexión.

**Error esperado**: `'Error al obtener especialidades'`

---

### ⚠️ Test: `debe responder 500 ante error inesperado del servicio`

**Ubicación**: Líneas 229-251

**Descripción**: Valida que el controlador maneje cualquier error inesperado del servicio.

**Error esperado**: `'Error al obtener especialidades'`

---

### ⚠️ Test: `debe responder 500 cuando el servicio lanza error de tabla no encontrada`

**Ubicación**: Líneas 253-275

**Descripción**: Valida que el controlador maneje errores cuando la tabla de base de datos no está disponible.

**Error esperado**: `'Error al obtener especialidades'`

---

### ✅ Test: `debe mantener formato de error consistente`

**Ubicación**: Líneas 277-299

**Descripción**: Valida que todos los errores tengan el mismo formato de respuesta.

**Qué prueba**:
- Estructura de error siempre tiene `success: false` y `message`
- Formato se mantiene consistente en todos los casos de error

**Assertions clave**:
- `success` es `false`
- `message` está presente
- No se exponen detalles técnicos del error

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`**: Limpia todos los mocks antes de cada test para asegurar que no haya interferencia entre tests.

### Mock de Request y Response

- **`createMockRequest()`**: Crea un mock de Request vacío (no se necesitan query params para este endpoint)
- **`createMockResponse()`**: Crea un mock de Response con métodos `status` y `json`

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del controlador de especialidad
npm test -- especialidad.controller.test

# Ejecutar en modo watch
npm run test:watch -- especialidad.controller.test

# Ejecutar con cobertura
npm run test:coverage -- especialidad.controller.test
```

## Cobertura Esperada

Los tests deberían cubrir:
- ✅ Casos exitosos (obtener todas, lista vacía, formato correcto)
- ✅ Casos límite (una especialidad, muchas especialidades, caracteres especiales)
- ✅ Casos de error del servicio (errores de infraestructura con formato consistente)

## Notas Importantes

1. **Aislamiento**: Todos los tests están completamente aislados mediante mocks. No dependen de servicios reales ni de base de datos.

2. **Manejo de Errores**: El controlador siempre retorna status 500 para errores, lo cual es apropiado para errores del servidor/infraestructura.

3. **Responsabilidades**: El controlador solo se encarga de:
   - Llamar al servicio correspondiente
   - Formatear la respuesta HTTP apropiada
   - No realiza lógica de negocio (eso es responsabilidad del servicio)

4. **Formato de Respuesta**: El controlador usa un formato estándar:
   - **Éxito**: `{ success: true, data: [...] }`
   - **Error**: `{ success: false, message: "..." }`

5. **Status Codes**:
   - **200 OK**: Listado exitoso (por defecto, no se llama `res.status`)
   - **500 Internal Server Error**: Cualquier error del servicio

6. **Método Estático**: El controlador usa métodos estáticos, por lo que se llama directamente como `EspecialidadController.obtenerTodas(req, res)` sin necesidad de instanciar la clase.

7. **Simplicidad del Controlador**: Este controlador es muy simple - solo llama al servicio y formatea la respuesta. No realiza validaciones adicionales, lo cual es correcto para un endpoint de consulta simple.

8. **Default Export**: El controlador se exporta como default, por lo que se importa sin llaves: `import EspecialidadController from '...'`.

9. **Consistencia de Formato**: Todos los errores retornan el mismo formato, lo que facilita el manejo en el frontend.

