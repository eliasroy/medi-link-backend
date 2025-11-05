# Pruebas de Modelos

Este directorio contiene pruebas unitarias para los modelos Sequelize usados en la aplicación.

## Cobertura de Pruebas

Las pruebas de modelos cubren las siguientes áreas:

### Modelo Consulta (`Consulta.test.ts`)
- **Casos Normales**: Inicialización de modelo, validación de propiedades, integridad de datos
- **Casos Límite**: Campos de texto grandes, valores máximos, casos extremos
- **Casos de Excepción**: Tipos de datos inválidos, campos requeridos faltantes, errores de base de datos

### Asociaciones (`associations.test.ts`)
- **Casos Normales**: Configuración de relaciones entre modelos (belongsTo, hasMany, hasOne)
- **Casos Límite**: Múltiples asociaciones en el mismo modelo, relaciones bidireccionales
- **Casos de Excepción**: Referencias de modelo faltantes, dependencias circulares

### Modelo Cita (`cita.model.test.ts`)
- **Casos Normales**: Propiedades del modelo, valores por defecto, transiciones de estado
- **Casos Límite**: Valores de ID grandes, validación de enum, manejo de fechas
- **Casos de Excepción**: Valores de enum inválidos, desajustes de tipo, violaciones de restricciones

## Estructura de Pruebas

Cada archivo de prueba sigue una estructura consistente:

1. **Configuración**: Simular dependencias y configurar entorno de prueba
2. **Casos Normales**: Probar comportamiento esperado bajo condiciones normales
3. **Casos Límite**: Probar casos extremos y condiciones de límite
4. **Casos de Excepción**: Probar manejo de errores y escenarios inesperados

## Ejecutando Pruebas

```bash
# Ejecutar todas las pruebas de modelos
npm test -- --testPathPattern=model

# Ejecutar prueba específica de modelo
npm test -- Consulta.test.ts

# Ejecutar con cobertura
npm test -- --testPathPattern=model --coverage
```

## Metas de Cobertura

- **Sentencias**: 100%
- **Ramas**: 100%
- **Funciones**: 100%
- **Líneas**: 100%

## Estrategia de Simulación

Las pruebas usan simulaciones de Jest para aislar comportamiento de modelos:
- DataTypes de Sequelize están simulados
- Conexiones a base de datos están simuladas
- Modelos relacionados están simulados para evitar dependencias circulares
- Métodos de modelo están simulados donde sea necesario

## Datos de Prueba

Las pruebas usan conjuntos de datos realistas pero mínimos:
- Instancias de modelo válidas con todos los campos requeridos
- Valores de casos extremos (IDs min/max, cadenas largas)
- Datos inválidos para probar manejo de errores
- Valores vacíos/null donde apropiado