// associations.ts
import Horario from "./horario.model";
import {Medico} from "./medico.model";
import Especialidad from "./especialidad.model";
import Cita from "./cita.model";
import { Usuario } from "./usuario.model";
import { Paciente } from "./paciente.model";
import Consulta from "./Consulta";

// Asociación: Horario pertenece a un Médico
Horario.belongsTo(Medico, {
  foreignKey: 'id_medico',
  as: 'medico'
});

// Asociación: Médico tiene muchos Horarios
Medico.hasMany(Horario, {
  foreignKey: 'id_medico',
  as: 'horarios'
});

// Asociación: Médico pertenece a una Especialidad
Medico.belongsTo(Especialidad, {
  foreignKey: 'id_especialidad',
  as: 'especialidad'
});

// Asociación: Especialidad tiene muchos Médicos
Especialidad.hasMany(Medico, {
  foreignKey: 'id_especialidad',
  as: 'medicos'
});

// Asociación: Médico pertenece a un Usuario (para nombre y apellidos)
Medico.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// Asociación: Usuario tiene un Médico (1 a 1)
Usuario.hasOne(Medico, {
  foreignKey: 'id_usuario',
  as: 'medico'
});

// Asociación: Horario tiene muchas Citas
Horario.hasMany(Cita, {
  foreignKey: 'id_horario',
  as: 'citas'
});

// Asociación: Cita pertenece a Paciente
Cita.belongsTo(Paciente, {
  foreignKey: 'id_paciente',
  as: 'paciente'
});

// Asociación: Paciente tiene muchas Citas
Paciente.hasMany(Cita, {
  foreignKey: 'id_paciente',
  as: 'citas'
});

// Asociación: Paciente pertenece a Usuario
Paciente.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// Asociación: Consulta pertenece a Cita (definida en modelo de Consulta)
// Inversa: Cita tiene una Consulta
Cita.hasOne(Consulta, {
  foreignKey: 'id_cita',
  as: 'consulta'
});

export { Horario, Medico, Especialidad, Cita, Usuario, Paciente, Consulta };
