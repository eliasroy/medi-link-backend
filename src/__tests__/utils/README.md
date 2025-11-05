# Pruebas de Utilidades

Este directorio contiene pruebas unitarias para funciones de utilidad usadas en toda la aplicación.

## Cobertura de Pruebas

Las pruebas de utilidades cubren las siguientes áreas:

### Utilidades de Mapeo (`mapper.test.ts`)
- **Casos Normales**: Mapeo exitoso entre Usuario y UsuarioDTO
- **Casos Límite**: Casos extremos con cadenas vacías, caracteres especiales, valores grandes
- **Casos de Excepción**: Valores null/undefined, tipos de datos inválidos, propiedades faltantes

## Estructura de Pruebas

Cada archivo de prueba sigue una estructura consistente:

1. **Configuración**: Simular dependencias y configurar entorno de prueba
2. **Casos Normales**: Probar comportamiento esperado bajo condiciones normales
3. **Casos Límite**: Probar casos extremos y condiciones de límite
4. **Casos de Excepción**: Probar manejo de errores y escenarios inesperados

## Ejecutando Pruebas

```bash
# Ejecutar todas las pruebas de utilidades
npm test -- --testPathPattern=utils

# Ejecutar prueba específica de utilidades
npm test -- mapper.test.ts

# Ejecutar con cobertura
npm test -- --testPathPattern=utils --coverage
```

## Metas de Cobertura

- **Sentencias**: 100%
- **Ramas**: 100%
- **Funciones**: 100%
- **Líneas**: 100%

## Estrategia de Simulación

Las pruebas usan simulaciones de Jest para aislar comportamiento de funciones de utilidad:
- Clases de modelo están simuladas para evitar dependencias de base de datos
- Clases DTO están simuladas para enfocarse en lógica de mapeo
- Dependencias externas están simuladas donde sea necesario

## Datos de Prueba

Las pruebas usan conjuntos de datos completos:
- Pares entrada/salida válidos para funciones de mapeo
- Valores de casos extremos (cadenas vacías, caracteres especiales, números grandes)
- Tipos de datos inválidos para probar resiliencia a errores
- Valores null/undefined para probar robustez

## Funciones de Utilidad Probadas

### `usuarioToDTO`
Mapea una instancia de modelo Usuario a UsuarioDTO para respuestas de API:
- Preserva ID de usuario, nombre, email y rol
- Maneja conversiones de tipos de datos
- Mantiene integridad de datos
- Proporciona formato de salida consistente