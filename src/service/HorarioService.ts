import Horario from "../model/horario.model";
import { Transaction, Op } from "sequelize";
import {sequelize} from "../config/database";

class HorarioService {
  /**
   * Registra un nuevo horario disponible para un médico
   * @param idMedico ID del médico
   * @param data Datos del horario
   * @returns Horario creado
   */
  static async crearHorario(
    idMedico: number,
    data: {
      titulo: string;
      fecha: string;         // 'YYYY-MM-DD'
      hora_inicio: string;   // 'HH:mm:ss'
      hora_fin: string;      // 'HH:mm:ss'
      modalidad: "PRESENCIAL" | "VIRTUAL";
    }
  ) {
    return await sequelize.transaction(async (t: Transaction) => {
      // Validación de solapamiento de horarios
      const horarioExistente = await Horario.findOne({
        where: {
          id_medico: idMedico,
          fecha: data.fecha,
          estado: { [Op.ne]: "CANCELADO" }, // ignorar cancelados
          [Op.and]: [
            { hora_inicio: { [Op.lt]: data.hora_fin } },  // inicio existente < fin nuevo
            { hora_fin: { [Op.gt]: data.hora_inicio } }   // fin existente > inicio nuevo
          ]
        },
        transaction: t,
      });

      if (horarioExistente) {
        throw new Error("Ya existe un horario en esa fecha y hora");
      }

      // Crear horario disponible
      const horario = await Horario.create(
        {
          id_medico: idMedico,
          titulo: data.titulo,
          fecha: data.fecha,
          hora_inicio: data.hora_inicio,
          hora_fin: data.hora_fin,
          modalidad: data.modalidad,
          estado: "DISPONIBLE",  // el médico lo deja disponible
          fecha_registro: new Date(),
          fecha_actualizacion: new Date(),
        },
        { transaction: t }
      );

      return horario;
    });
  }
}

export default HorarioService;
