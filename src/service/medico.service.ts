import { Op } from "sequelize";
import { VistaMedicos } from "../model/medicos";
export const listarMedicosFiltrados = async (filtros: any) => {
    const where: any = {};
  
    if (filtros.nombre) {
      where.nombre = { [Op.like]: `%${filtros.nombre}%` };
    }
    if (filtros.paterno) {
      where.paterno = { [Op.like]: `%${filtros.paterno}%` };
    }
    if (filtros.materno) {
      where.materno = { [Op.like]: `%${filtros.materno}%` };
    }
    if (filtros.nro_colegiatura) {
      where.nro_colegiatura = { [Op.like]: `%${filtros.nro_colegiatura}%` };
    }
    if (filtros.id_especialidad) {
      where.id_especialidad ={ [Op.eq]:  `${filtros.id_especialidad}` };
    }
    if (filtros.especialidad) {
      where.especialidad = {
        [Op.like]: `%${filtros.especialidad}%`,
      };
    }
    if (filtros.anios_experiencia) {
      where.anios_experiencia = { [Op.gte]: filtros.anios_experiencia };
    }
    if (filtros.calificacion_promedio) {
      where.calificacion_promedio = { [Op.gte]: filtros.calificacion_promedio };
    }
  
    const medicos = await VistaMedicos.findAll({
      where,
      order: [["calificacion_promedio", "DESC"]],
    });
  
    return medicos;
  };
