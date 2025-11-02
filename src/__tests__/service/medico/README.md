# Tests Unitarios - Medico Service

Este directorio contiene los tests unitarios para el servicio de médico (`medico.service.ts`).

## Archivo de Test

- **`medico.service.test.ts`**: Tests completos para la función `listarMedicosFiltrados` del servicio de médico.

## Descripción General

Este archivo de test verifica el comportamiento del servicio de médico, específicamente la función `listarMedicosFiltrados`, que es responsable de:
- Listar médicos desde una vista de base de datos
- Aplicar filtros opcionales (nombre, apellidos, especialidad, calificación, etc.)
- Ordenar resultados por calificación promedio descendente

Los tests cubren casos normales, casos límite y casos de excepción para asegurar robustez del servicio en el proceso de búsqueda y filtrado de médicos.

## Mocking

Los tests mockean las siguientes dependencias:
- **Vista de Sequelize**: `VistaMedicos` (findAll)

Esto permite que los tests sean rápidos y no dependan de conexiones reales a base de datos.

## Estructura de Tests

Los tests están organizados en tres suites principales dentro de `describe('Medico Service - Tests Completos')`:

---

## 1. Casos Normales (Happy Path)

### ✅ Test: `debería listar todos los médicos cuando no hay filtros`

**Ubicación**: Líneas 21-54

**Descripción**: Verifica que el servicio retorne todos los médicos cuando no se proporcionan filtros.

**Qué prueba**:
- Consulta sin filtros retorna todos los médicos
- Los resultados se ordenan por calificación promedio descendente
- Estructura de respuesta correcta

**Flujo del test**:
1. **Arrange**: Configura filtros vacíos y mocks de médicos
2. **Act**: Ejecuta `listarMedicosFiltrados({})`
3. **Assert**: Verifica que:
   - Se retorna la lista completa de médicos
   - `VistaMedicos.findAll` fue llamado con `where: {}` y orden correcto

**Datos de prueba**:
- Filtros: `{}`
- Resultado esperado: Array con 2 médicos

**Assertions clave**:
- `VistaMedicos.findAll` llamado con `where: {}`
- `order: [['calificacion_promedio', 'DESC']]`

---

### ✅ Test: `debería filtrar médicos por nombre`

**Ubicación**: Líneas 56-84

**Descripción**: Verifica que el servicio filtre correctamente por nombre usando búsqueda parcial (LIKE).

**Qué prueba**:
- Filtro por nombre usando operador `LIKE` con `%valor%`
- Búsqueda parcial (no exacta)

**Assertions clave**:
- `where: { nombre: { [Op.like]: '%Juan%' } }`

**Datos de prueba**:
- Filtros: `{ nombre: 'Juan' }`

---

### ✅ Test: `debería filtrar médicos por múltiples filtros`

**Ubicación**: Líneas 86-125

**Descripción**: Verifica que el servicio aplique múltiples filtros simultáneamente.

**Qué prueba**:
- Combinación de filtros de texto (nombre) y numéricos (id_especialidad, calificación, años)
- Uso de operadores apropiados: `LIKE` para texto, `eq` para igualdad, `gte` para mayor o igual

**Datos de prueba**:
- Filtros: `{ nombre: 'María', id_especialidad: 2, calificacion_promedio: 4.0, anios_experiencia: 3 }`

**Assertions clave**:
- `nombre: { [Op.like]: '%María%' }`
- `id_especialidad: { [Op.eq]: '2' }`
- `calificacion_promedio: { [Op.gte]: 4.0 }`
- `anios_experiencia: { [Op.gte]: 3 }`

---

### ✅ Test: `debería filtrar médicos por especialidad (texto)`

**Ubicación**: Líneas 127-152

**Descripción**: Verifica que el servicio filtre por especialidad usando búsqueda parcial en el texto.

**Qué prueba**:
- Filtro por nombre de especialidad usando `LIKE`
- Búsqueda parcial en el campo texto de especialidad

**Assertions clave**:
- `especialidad: { [Op.like]: '%Cardiología%' }`

---

### ✅ Test: `debería filtrar médicos por número de colegiatura`

**Ubicación**: Líneas 154-179

**Descripción**: Verifica que el servicio filtre por número de colegiatura usando búsqueda parcial.

**Qué prueba**:
- Filtro por número de colegiatura
- Uso de `LIKE` para búsqueda parcial

**Assertions clave**:
- `nro_colegiatura: { [Op.like]: '%12345%' }`

---

### ✅ Test: `debería retornar lista vacía cuando no hay médicos que coincidan`

**Ubicación**: Líneas 181-198

**Descripción**: Verifica que el servicio retorne un array vacío cuando no hay resultados.

**Qué prueba**:
- Filtros que no coinciden con ningún médico
- Respuesta: array vacío `[]`

**Datos de prueba**:
- Filtros: `{ nombre: 'NoExiste' }`
- Resultado esperado: `[]`

---

## 2. Casos Límite (Edge Cases)

### 📝 Test: `debería manejar filtros con valores vacíos`

**Ubicación**: Líneas 202-224

**Descripción**: Valida que el servicio maneje strings vacíos en los filtros.

**Qué prueba**:
- Filtros con strings vacíos (`''`)
- El servicio aún aplica los filtros (búsqueda de `%%` que coincide con todo o nada según la base de datos)

**Nota**: Este comportamiento puede variar según la base de datos. El test verifica que se llame con los valores proporcionados.

---

### 📝 Test: `debería manejar nombres con caracteres especiales`

**Ubicación**: Líneas 226-246

**Descripción**: Valida que el servicio maneje correctamente nombres con acentos y caracteres especiales.

**Datos de prueba**:
- Filtro: `{ nombre: 'María José' }`

**Assertions clave**:
- El filtro se aplica correctamente con caracteres especiales

---

### ⭐ Test: `debería manejar valores numéricos límite para calificación`

**Ubicación**: Líneas 248-266

**Descripción**: Valida que el servicio acepte valores mínimos para calificación (0.0).

**Qué prueba**:
- Filtro con calificación mínima (0.0)
- Operador `gte` (mayor o igual)

**Assertions clave**:
- `calificacion_promedio: { [Op.gte]: 0.0 }`

---

### 📅 Test: `debería manejar valores numéricos límite para años de experiencia`

**Ubicación**: Líneas 268-286

**Descripción**: Valida que el servicio acepte 0 años de experiencia como filtro válido.

**Assertions clave**:
- `anios_experiencia: { [Op.gte]: 0 }`

---

### 🔢 Test: `debería manejar id_especialidad como string`

**Ubicación**: Líneas 288-307

**Descripción**: Valida que el servicio maneje `id_especialidad` cuando viene como string desde query params.

**Qué prueba**:
- El servicio convierte el valor a string para la comparación
- Uso de operador `eq` (igualdad exacta)

**Datos de prueba**:
- Filtro: `{ id_especialidad: '1' }` (string)

**Nota**: El servicio convierte el número a string usando template literal `${filtros.id_especialidad}`.

---

### 🔢 Test: `debería manejar id_especialidad como número`

**Ubicación**: Líneas 309-328

**Descripción**: Valida que el servicio maneje `id_especialidad` cuando viene como número.

**Datos de prueba**:
- Filtro: `{ id_especialidad: 1 }` (número)

---

### 📊 Test: `debería ordenar por calificación descendente siempre`

**Ubicación**: Líneas 330-352

**Descripción**: Valida que los resultados siempre se ordenen por calificación promedio descendente, independientemente de los filtros.

**Qué prueba**:
- El ordenamiento siempre es `[['calificacion_promedio', 'DESC']]`
- Se mantiene incluso sin filtros o con cualquier combinación de filtros

**Assertions clave**:
- `order: [['calificacion_promedio', 'DESC']]` siempre presente

---

## 3. Casos de Excepción (Exception Cases)

### 🗄️ Test: `debería manejar error de conexión a base de datos`

**Ubicación**: Líneas 356-374

**Descripción**: Valida que el servicio propague correctamente errores de conexión a la base de datos.

**Qué prueba**:
- `VistaMedicos.findAll` lanza error de conexión
- El servicio propaga el error sin modificar el mensaje

**Error esperado**: `'Error de conexión a la base de datos'`

---

### ⏱️ Test: `debería manejar timeout de base de datos`

**Ubicación**: Líneas 376-390

**Descripción**: Valida que el servicio maneje timeouts de conexión a la base de datos.

**Error esperado**: `'Timeout de conexión a la base de datos'`

---

### ⚠️ Test: `debería manejar error genérico del servicio`

**Ubicación**: Líneas 392-406

**Descripción**: Valida que el servicio propague cualquier error genérico.

**Error esperado**: `'Error inesperado'`

---

### 🗄️ Test: `debería manejar error cuando VistaMedicos no está disponible`

**Ubicación**: Líneas 408-422

**Descripción**: Valida que el servicio maneje errores cuando la vista de base de datos no está disponible o no existe.

**Error esperado**: `'VistaMedicos no encontrada'`

---

### 🔄 Test: `debería manejar filtros con valores null`

**Ubicación**: Líneas 424-444

**Descripción**: Valida que el servicio ignore filtros con valores `null` (no los agregue al where).

**Qué prueba**:
- Filtros con `null` no se incluyen en la cláusula `where`
- Solo se filtran los campos con valores válidos (truthy)

**Assertions clave**:
- `where: {}` cuando todos los filtros son `null`

---

### 🔄 Test: `debería manejar filtros con valores undefined`

**Ubicación**: Líneas 446-466

**Descripción**: Valida que el servicio ignore filtros con valores `undefined`.

**Qué prueba**:
- Similar al caso de `null`, los valores `undefined` no se incluyen en el where

**Assertions clave**:
- `where: {}` cuando todos los filtros son `undefined`

---

## Configuración de Tests

### Setup y Teardown

- **`beforeEach`**: Limpia todos los mocks antes de cada test para asegurar aislamiento.

### Variables de Entorno

Los tests no requieren variables de entorno específicas, ya que todas las dependencias están mockeadas.

## Comandos de Ejecución

```bash
# Ejecutar solo los tests del servicio de médico
npm test -- medico.service.test

# Ejecutar en modo watch
npm run test:watch -- medico.service.test

# Ejecutar con cobertura
npm run test:coverage -- medico.service.test
```

## Cobertura Esperada

Los tests cubren:
- ✅ Casos exitosos (listado sin filtros, con filtros simples y múltiples)
- ✅ Casos límite (valores vacíos, null, undefined, valores límite, tipos de datos)
- ✅ Casos de error de infraestructura (base de datos, timeouts, vistas no disponibles)

## Notas Importantes

1. **Aislamiento Completo**: Todos los tests están completamente aislados mediante mocks. No hay dependencias de servicios externos reales.

2. **Patrón AAA**: Los tests siguen el patrón Arrange-Act-Assert (AAA) para claridad.

3. **Vista de Base de Datos**: El servicio usa `VistaMedicos`, que es una vista de base de datos. Los tests mockean esta vista como un modelo normal de Sequelize.

4. **Operadores Sequelize**: El servicio usa diferentes operadores según el tipo de filtro:
   - `Op.like`: Para búsquedas parciales en texto (nombre, paterno, materno, especialidad, nro_colegiatura)
   - `Op.eq`: Para igualdad exacta en id_especialidad (convertido a string)
   - `Op.gte`: Para comparaciones "mayor o igual que" en campos numéricos (anios_experiencia, calificacion_promedio)

5. **Conversión de Tipos**: El servicio convierte `id_especialidad` a string usando template literal, lo cual es consistente con cómo pueden venir los query parameters desde HTTP (siempre strings).

6. **Ordenamiento**: El servicio siempre ordena por `calificacion_promedio DESC`, lo que significa que los médicos mejor calificados aparecen primero.

7. **Filtros Opcionales**: Todos los filtros son opcionales. Si un filtro no está presente o tiene valor falsy (null, undefined, string vacío), no se agrega al objeto `where`.

8. **Búsqueda Parcial**: Los filtros de texto usan `LIKE` con `%valor%`, lo que permite búsquedas parciales. Por ejemplo, buscar "Juan" encontrará "Juan Pérez", "María Juan", etc.

