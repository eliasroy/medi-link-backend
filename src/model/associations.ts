// associations.ts
import Horario from "./horario.model";
import {Medico} from "./medico.model";
import Especialidad from "./especialidad.model";
import Cita from "./cita.model";

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

// Asociación: Horario tiene muchas Citas
Horario.hasMany(Cita, {
  foreignKey: 'id_horario',
  as: 'citas'
});

export { Horario, Medico, Especialidad, Cita };
