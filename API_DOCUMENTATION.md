# Documentación de API REST - Sistema Médico

## Base URL
```
http://localhost:3000/api
```

## Autenticación
La mayoría de endpoints requieren autenticación mediante JWT token en el header:
```
Authorization: Bearer <token>
```

---

## 1. AUTENTICACIÓN

### POST /auth/login
**Descripción:** Iniciar sesión en el sistema

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Login exitoso",
  "token": "jwt_token_here",
  "usuario": {
    "id_usuario": "number",
    "email": "string",
    "rol": "PACIENTE" | "MEDICO"
  }
}
```

**Respuesta de error (400):**
```json
{
  "error": "Usuario no encontrado" | "Contraseña incorrecta"
}
```

---

## 2. USUARIOS

### POST /usuarios/paciente
**Descripción:** Registrar un nuevo paciente

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "fecha_nacimiento": "YYYY-MM-DD",
  "genero": "M" | "F",
  "direccion": "string"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_usuario": "number",
    "email": "string",
    "rol": "PACIENTE"
  }
}
```

### POST /usuarios/medico
**Descripción:** Registrar un nuevo médico

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "fecha_nacimiento": "YYYY-MM-DD",
  "genero": "M" | "F",
  "direccion": "string",
  "id_especialidad": "number",
  "numero_colegiatura": "string"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_usuario": "number",
    "email": "string",
    "rol": "MEDICO"
  }
}
```

---

## 3. MÉDICOS

### GET /listarMedicos/medicos
**Descripción:** Obtener lista de médicos (solo pacientes)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (opcionales):**
```
especialidad?: string
nombre?: string
modalidad?: "PRESENCIAL" | "VIRTUAL"
```

**Respuesta exitosa (200):**
```json
[
  {
    "id_medico": "number",
    "nombre": "string",
    "apellido": "string",
    "especialidad": "string",
    "modalidad": "PRESENCIAL" | "VIRTUAL",
    "calificacion_promedio": "number"
  }
]
```

---

## 4. HORARIOS

### POST /horarios/save
**Descripción:** Crear un nuevo horario (solo médicos)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "string",
  "fecha": "YYYY-MM-DD",
  "hora_inicio": "HH:MM:SS",
  "hora_fin": "HH:MM:SS",
  "modalidad": "PRESENCIAL" | "VIRTUAL"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_horario": "number",
    "id_medico": "number",
    "titulo": "string",
    "fecha": "YYYY-MM-DD",
    "hora_inicio": "HH:MM:SS",
    "hora_fin": "HH:MM:SS",
    "estado": "DISPONIBLE",
    "modalidad": "PRESENCIAL" | "VIRTUAL"
  }
}
```

### GET /horarios/disponibles/semana
**Descripción:** Obtener horarios disponibles de la semana actual (público)

**Query Parameters (opcionales):**
```
idMedico?: number
especialidad?: string
modalidad?: "PRESENCIAL" | "VIRTUAL"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_horario": "number",
      "id_medico": "number",
      "titulo": "string",
      "fecha": "YYYY-MM-DD",
      "hora_inicio": "HH:MM:SS",
      "hora_fin": "HH:MM:SS",
      "estado": "DISPONIBLE",
      "modalidad": "PRESENCIAL" | "VIRTUAL",
      "medico": {
        "id_medico": "number",
        "nombre": "string",
        "apellido": "string",
        "especialidad": {
          "id_especialidad": "number",
          "nombre": "string",
          "descripcion": "string"
        }
      }
    }
  ],
  "total": "number"
}
```

### GET /horarios/disponibles/rango
**Descripción:** Obtener horarios disponibles por rango de fechas (público)

**Query Parameters:**
```
fechaInicio: string (YYYY-MM-DD) - Requerido
fechaFin: string (YYYY-MM-DD) - Requerido
idMedico?: number
especialidad?: string
modalidad?: "PRESENCIAL" | "VIRTUAL"
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_horario": "number",
      "id_medico": "number",
      "titulo": "string",
      "fecha": "YYYY-MM-DD",
      "hora_inicio": "HH:MM:SS",
      "hora_fin": "HH:MM:SS",
      "estado": "DISPONIBLE",
      "modalidad": "PRESENCIAL" | "VIRTUAL",
      "medico": {
        "id_medico": "number",
        "nombre": "string",
        "apellido": "string",
        "especialidad": {
          "id_especialidad": "number",
          "nombre": "string",
          "descripcion": "string"
        }
      }
    }
  ],
  "total": "number"
}
```

---

## 5. ESPECIALIDADES

### GET /especialidades
**Descripción:** Obtener todas las especialidades (público)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id_especialidad": "number",
      "nombre": "string",
      "descripcion": "string"
    }
  ]
}
```

---

## 6. CITAS

### POST /citas/save
**Descripción:** Crear una nueva cita (solo pacientes)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "idHorario": "number (opcional)",
  "idMedico": "number",
  "titulo": "string",
  "fecha": "YYYY-MM-DD",
  "hora_inicio": "HH:MM:SS",
  "hora_fin": "HH:MM:SS",
  "modalidad": "PRESENCIAL" | "VIRTUAL"
}
```

**Notas:**
- Si `idHorario` se proporciona, se usará un horario existente
- Si no se proporciona `idHorario`, se creará un nuevo horario

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_cita": "number",
    "id_paciente": "number",
    "id_horario": "number",
    "fecha_cita": "YYYY-MM-DD",
    "hora_inicio": "HH:MM:SS",
    "hora_fin": "HH:MM:SS",
    "modalidad": "PRESENCIAL" | "VIRTUAL",
    "estado": "PENDIENTE"
  }
}
```

---

## 7. CONSULTAS

### POST /consultas/iniciar
**Descripción:** Iniciar una consulta (solo médicos)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "id_cita": "number",
  "motivo": "string"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id_consulta": "number",
    "id_cita": "number",
    "id_medico": "number",
    "motivo": "string",
    "fecha_inicio": "YYYY-MM-DDTHH:MM:SS",
    "estado": "EN_PROGRESO"
  }
}
```

### PUT /consultas/actualizar/:id_consulta
**Descripción:** Actualizar una consulta (solo médicos)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `id_consulta`: ID de la consulta a actualizar

**Body:**
```json
{
  "diagnostico": "string (opcional)",
  "pathArchivo": "string (opcional)",
  "tratamiento": "string (opcional)",
  "observaciones": "string (opcional)",
  "calificacion": "number (opcional)",
  "estado": "FINALIZADA" | "CANCELADA"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id_consulta": "number",
    "diagnostico": "string",
    "tratamiento": "string",
    "observaciones": "string",
    "estado": "FINALIZADA"
  }
}
```

### POST /consultas/calificar
**Descripción:** Calificar una consulta (solo pacientes)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "id_consulta": "number",
  "calificacion": "number (1-5)"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id_consulta": "number",
    "calificacion": "number",
    "fecha_calificacion": "YYYY-MM-DDTHH:MM:SS"
  }
}
```

---

## Códigos de Estado HTTP

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Error en la solicitud
- **401**: Unauthorized - Token no válido o faltante
- **403**: Forbidden - Sin permisos para acceder al recurso
- **500**: Internal Server Error - Error interno del servidor

## Notas Importantes

1. **Autenticación**: Todos los endpoints excepto `/auth/login` y registro de usuarios requieren token JWT
2. **Roles**: 
   - `PACIENTE`: Puede crear citas, calificar consultas, ver médicos
   - `MEDICO`: Puede crear horarios, iniciar/actualizar consultas
3. **Formatos de fecha**: 
   - Fechas: `YYYY-MM-DD`
   - Fechas con hora: `YYYY-MM-DDTHH:MM:SS`
   - Horas: `HH:MM:SS`
4. **Validaciones**: El sistema valida conflictos de horarios y disponibilidad automáticamente
