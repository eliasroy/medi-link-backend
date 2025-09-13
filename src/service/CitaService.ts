// services/CitaService.ts
import Cita from "../model/cita.model";
import Horario from "../model/horario.model";
import { Transaction, Op } from "sequelize";
import {sequelize} from "../config/database";

class CitaService {
  static async crearCitaConHorario(
    idPaciente: number,
    data: {
      idHorario?: number;
      idMedico: number;
      titulo: string;
      fecha: string;
      hora_inicio: string;
      hora_fin: string;
      modalidad: "PRESENCIAL" | "VIRTUAL";
    }
  ) {
    return await sequelize.transaction(async (t: Transaction) => {
      let horario: Horario;

      // Caso 1: paciente elige un horario existente
      if (data.idHorario) {
        const horarioEncontrado = await Horario.findOne({
          where: { id_horario: data.idHorario, estado: "DISPONIBLE",modalidad:data.modalidad },
          transaction: t,
        });

        if (!horarioEncontrado) {
          throw new Error("El horario seleccionado no está disponible");
        }
        
        horario = horarioEncontrado;

        // actualizar estado a ocupado
        await horario.update({ estado: "OCUPADO" }, { transaction: t });
      } else {
            // Verificar si ya existe horario en la misma fecha/hora del mismo médico
            const horarioExistente = await Horario.findOne({
                where: {
                id_medico: data.idMedico,
                estado: { [Op.ne]: "CANCELADO" }, // ignorar cancelados
                fecha: data.fecha,
                [Op.and]: [
                    { hora_inicio: { [Op.lt]: data.hora_fin } },   // inicio existente < fin nuevo
                    { hora_fin: { [Op.gt]: data.hora_inicio } }   // fin existente > inicio nuevo
                  ]
                },
                transaction: t,
            });

            if (horarioExistente) {
                throw new Error("Ya existe un horario en esa fecha y hora");
            }

            // Crear horario
            horario = await Horario.create(
                {
                id_medico: data.idMedico,
                titulo: data.titulo,
                fecha: data.fecha,
                hora_inicio: data.hora_inicio,
                hora_fin: data.hora_fin,
                modalidad: data.modalidad,
                estado: "OCUPADO",
                fecha_registro: new Date(),
                fecha_actualizacion: new Date(),
                },
                { transaction: t }
            );
            }

            // ----- VALIDAR CITA -----
            const citaExistente = await Cita.findOne({
            where: {
                id_horario: horario.id_horario,
                [Op.or]: [
                { estado: "PENDIENTE" },
                { estado: "CONFIRMADA" }
                ]
            },
            transaction: t,
            });

            if (citaExistente) {
            throw new Error("Ya existe una cita para este horario");
            }

            // Crear cita
            const cita = await Cita.create(
            {
                id_paciente: idPaciente,
                id_horario: horario.id_horario,
                fecha_cita: horario.fecha,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                modalidad: horario.modalidad,
                fecha_registro: new Date(),
                fecha_actualizacion: new Date(),
            },
            { transaction: t }
            );

      return cita;
    });
  }
}

export default CitaService;
