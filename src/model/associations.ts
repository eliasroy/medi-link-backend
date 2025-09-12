import { Usuario } from "./usuario.model";
import { Medico } from "./medico.model";
import { Especialidad } from "./especialidad.model";

Medico.belongsTo(Usuario, { foreignKey: "id_usuario" });
Medico.belongsTo(Especialidad, { foreignKey: "id_especialidad" });

Usuario.hasOne(Medico, { foreignKey: "id_usuario" });
Especialidad.hasMany(Medico, { foreignKey: "id_especialidad" });
