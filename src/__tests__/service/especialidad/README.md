# Tests Unitarios - Especialidad Service

Este directorio contiene los tests unitarios para el servicio de especialidad (`especialidad.service.ts`).

## Archivo de Test

- **`especialidad.service.test.ts`**: Tests completos para el método estático `obtenerTodas` del servicio de especialidad.

## Descripción General

Este archivo de test verifica el comportamiento del servicio de especialidad, específicamente el método `obtenerTodas`, que es responsable de:
- Obtener todas las especialidades médicas desde la base de datos
- Ordenar los resultados por nombre en orden ascendente
- Manejar errores y retornar mensajes descriptivos

Los tests cubren casos normales, casos límite y casos de excepción para asegurar robustez del servicio.

## Mocking

Los tests mockean las siguientes dependencias:
- **Modelo de Sequelize**: `Especialidad` (findAll)

Esto permite que los tests sean rápidos y no dependan de conexiones reales a base de datos.

## Estructura de Tests

Los tests están organizados en tres suites principales dentro de `describe('Especialidad Service - Tests Completos')`:

---

## 1. Casos Normales (Happy Path)

### ✅ Test: `debería retornar todas las especialidades ordenadas por nombre ascendente`

**Ubicación**: Líneas 18-42

**Descripción**: Verifica el flujo exitoso cuando se obtienen todas las especialidades de la base de datos.

**Qué prueba**:
- Consulta exitosa de todas las especialidades
- Ordenamiento correcto por nombre ascendente
- Retorno de estructura de datos completa

**Flujo del test**:
1. **Arrange**: Configura mock de especialidades y modelo
2. **Act**: Ejecuta `EspecialidadService.obtenerTodas()`
3. **Assert**: Verifica que:
   - Se retorna la lista completa de especialidades
   - `Especialidad.findAll` fue llamado con orden correcto

**Datos de prueba**:
- Resultado esperado: Array con 3 especialidades (Cardiología, Dermatología, Pediatría)

**Assertions clave**:
- `Especialidad.findAll` llamado con `order: [['nombre', 'ASC']]`
- Resultado contiene todas las especialidades

---

### ✅ Test: `debería retornar lista vacía cuando no hay especialidades`

**Ubicación**: Líneas 44-61

**Descripción**: Verifica que el servicio maneje correctamente cuando no hay especialidades en la base de datos.

**Qué prueba**:
- Consulta exitosa pero sin resultados
- Retorno de array vacío

**Assertions clave**:
- Resultado es un array vacío `[]`
- `findAll` es llamado correctamente

---

### ✅ Test: `debería retornar especialidades con todas sus propiedades`

**Ubicación**: Líneas 63-86

**Descripción**: Verifica que las especialidades retornadas contengan todas las propiedades esperadas.

**Qué prueba**:
- Estructura completa de datos
- Propiedades: `id_especialidad`, `nombre`, `descripcion`, y otras opcionales

**Assertions clave**:
- Cada especialidad tiene `id_especialidad`
- Cada especialidad tiene `nombre`
- Puede tener `descripcion` y otras propiedades

---

## 2. Casos Límite (Edge Cases)

### 📊 Test: `debería manejar una sola especialidad`

**Ubicación**: Líneas 90-112

**Descripción**: Valida que el servicio funcione correctamente cuando solo hay una especialidad en la base de datos.

**Qué prueba**:
- Caso mínimo: una sola especialidad
- Ordenamiento se aplica correctamente incluso con un solo elemento

**Assertions clave**:
- Resultado tiene longitud 1
- Ordenamiento se aplica correctamente

---

### 📊 Test: `debería manejar muchas especialidades (límite superior)`

**Ubicación**: Líneas 114-136

**Descripción**: Valida que el servicio maneje correctamente grandes volúmenes de especialidades.

**Qué prueba**:
- Caso con 100 especialidades (límite superior)
- Rendimiento y manejo de grandes datasets

**Datos de prueba**:
- 100 especialidades generadas dinámicamente

**Assertions clave**:
- Resultado tiene longitud 100
- Todas las especialidades se retornan correctamente

---

### 📊 Test: `debería ordenar correctamente por nombre ascendente`

**Ubicación**: Líneas 138-160

**Descripción**: Valida que el servicio siempre ordene los resultados por nombre en orden ascendente (A-Z).

**Qué prueba**:
- Ordenamiento alfabético correcto
- Configuración de `order: [['nombre', 'ASC']]`

**Nota**: El ordenamiento real se hace en la base de datos, pero verificamos que se pase la configuración correcta.

**Assertions clave**:
- `findAll` llamado con `order: [['nombre', 'ASC']]`

---

### 📝 Test: `debería manejar nombres de especialidades con caracteres especiales`

**Ubicación**: Líneas 162-183

**Descripción**: Valida que el servicio maneje correctamente especialidades con nombres que contienen acentos y caracteres especiales.

**Qué prueba**:
- Nombres con acentos (Cardiología, Otorrinolaringología)
- Palabras muy largas
- Encoding de caracteres especiales

**Datos de prueba**:
- `'Cardiología'` (con acento)
- `'Otorrinolaringología'` (palabra muy larga con acento)

---

## 3. Casos de Excepción (Exception Cases)

### 🗄️ Test: `debería lanzar error cuando hay error de conexión a base de datos`

**Ubicación**: Líneas 187-204

**Descripción**: Valida que el servicio propague correctamente errores de conexión a la base de datos.

**Qué prueba**:
- `Especialidad.findAll` lanza error de conexión
- El servicio envuelve el error en un mensaje descriptivo

**Assertions clave**:
- Se lanza error `'Error al obtener especialidades'`
- `findAll` fue llamado antes del error

**Error esperado**: `'Error al obtener especialidades'`

---

### ⏱️ Test: `debería lanzar error cuando hay timeout de base de datos`

**Ubicación**: Líneas 206-219

**Descripción**: Valida que el servicio maneje timeouts de conexión a la base de datos.

**Error esperado**: `'Error al obtener especialidades'`

---

### ⚠️ Test: `debería lanzar error genérico cuando falla la consulta`

**Ubicación**: Líneas 221-234

**Descripción**: Valida que el servicio maneje cualquier error genérico que pueda ocurrir durante la consulta.

**Qué prueba**:
- Cualquier error se envuelve en el mensaje estándar
- No se exponen detalles internos del error

**Error esperado**: `'Error al obtener especialidades'`

---

### 🗄️ Test: `debería manejar error cuando la tabla de especialidades no existe`

**Ubicación**: Líneas 236-249

**Descripción**: Valida que el servicio maneje errores cuando la tabla o modelo no está disponible.

**Qué prueba**:
- Error de tabla no encontrada
- El servicio retorna mensaje genérico

**Error esperado**: `'Error al obtener especialidades'`

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`**: Limpia todos los mocks antes de cada test para asegurar aislamiento.

### Variables de Entorno

Los tests no requieren variables de entorno específicas, ya que todas las dependencias están mockeadas.

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del servicio de especialidad
npm test -- especialidad.service.test

# Ejecutar en modo watch
npm run test:watch -- especialidad.service.test

# Ejecutar con cobertura
npm run test:coverage -- especialidad.service.test
```

## Cobertura Esperada

Los tests cubren:
- ✅ Casos exitosos (obtener todas, lista vacía, propiedades completas)
- ✅ Casos límite (una especialidad, muchas especialidades, caracteres especiales)
- ✅ Casos de error de infraestructura (base de datos, timeouts, tabla no encontrada)

## Notas Importantes

1. **Aislamiento Completo**: Todos los tests están completamente aislados mediante mocks. No hay dependencias de servicios externos reales.

2. **Patrón AAA**: Los tests siguen el patrón Arrange-Act-Assert (AAA) para claridad.

3. **Método Estático**: El servicio usa métodos estáticos, por lo que se llama directamente como `EspecialidadService.obtenerTodas()` sin necesidad de instanciar la clase.

4. **Manejo de Errores**: El servicio siempre envuelve errores en un mensaje genérico `'Error al obtener especialidades'`, lo que evita exponer detalles internos de la base de datos.

5. **Ordenamiento**: El servicio siempre ordena por `nombre ASC`, lo que significa orden alfabético ascendente (A-Z).

6. **Default Export**: El servicio se exporta como default, por lo que se importa sin llaves: `import EspecialidadService from '...'`.

7. **Try-Catch**: El servicio usa try-catch para capturar cualquier error y lanzar un error con mensaje descriptivo.

