// services/CitaService.ts
import Cita from "../model/cita.model";
import Horario from "../model/horario.model";
import { Medico } from "../model/medico.model";
import { Transaction, Op } from "sequelize";
import {sequelize} from "../config/database";
import { title } from "process";
import { Usuario } from "../model/usuario.model";
import { Paciente } from "../model/paciente.model";
import Consulta from "../model/Consulta";

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
      estadoCita?: string;
    }
  ) {
    return await sequelize.transaction(async (t: Transaction) => {
      let horario: Horario;

      //caso que el paciente cancele la cita 

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
        await horario.update({ estado: "OCUPADO",titulo:data.titulo }, { transaction: t });
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
                id_horario: (horario as any).id_horario,
                [Op.or]: [
                { estado: "PENDIENTE" },
                { estado: "CONFIRMADA" }
                ]
            },
            transaction: t,
            });

            if (citaExistente) {
              throw new Error("Ya existe una cita activa para ese horario");
            }

            // Crear cita
            const cita = await Cita.create(
            {
                id_paciente: idPaciente,
                id_horario: (horario as any).id_horario,
                fecha_cita: (horario as any).fecha,
                hora_inicio: (horario as any).hora_inicio,
                hora_fin: (horario as any).hora_fin,
                modalidad: (horario as any).modalidad,
                fecha_registro: new Date(),
                fecha_actualizacion: new Date(),
            },
            { transaction: t }
            );

      return cita;
    });
  }

  static async obtenerCitasPorPaciente(idPaciente: number) {
    try {
      const citas = await Cita.findAll({
        where: { id_paciente: idPaciente },
        include: [
          {
            model: Horario,
            include: [
              {
                model: Medico,
                as: 'medico',
                include: [
                  {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id_usuario','nombre','paterno','materno']
                  }
                ],
                attributes: ['id_medico', 'nro_colegiatura', 'anios_experiencia', 'calificacion_promedio']
              }
            ],
            attributes: ['id_horario', 'titulo', 'fecha', 'hora_inicio', 'hora_fin', 'modalidad', 'estado']
          },
          {
            model: Consulta,
            as: 'consulta',
            attributes: ['id_consulta', 'calificacion', 'estado']
          }
        ],
        attributes: ['id_cita', 'estado', 'modalidad', 'fecha_registro', 'fecha_actualizacion'],
        order: [['fecha_registro', 'DESC']]
      });

      return citas;
    } catch (error) {
      throw new Error(`Error al obtener las citas del paciente: ${error}`);
    }
  }

  static async obtenerCitasPorMedico(idMedico: number) {
    try {
      const citas = await Cita.findAll({
        include: [
          {
            model: Horario,
            where: { id_medico: idMedico },
            include: [
              {
                model: Medico,
                as: 'medico',
                attributes: ['id_medico'],
                include: [
                  {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id_usuario','nombre','paterno','materno']
                  }
                ]
              }
            ],
            attributes: ['id_horario', 'titulo', 'fecha', 'hora_inicio', 'hora_fin', 'modalidad', 'estado']
          },
          {
            model: Paciente,
            as: 'paciente',
            include: [
              {
                model: Usuario,
                as: 'usuario',
                attributes: ['id_usuario','nombre','paterno','materno']
              }
            ],
            attributes: ['id_paciente']
          },
          {
            model: Consulta,
            as: 'consulta',
            attributes: ['id_consulta','calificacion','estado']
          }
        ],
        attributes: ['id_cita', 'id_paciente', 'estado', 'modalidad', 'fecha_registro', 'fecha_actualizacion'],
        order: [['fecha_registro', 'DESC']]
      });
      return citas;
    } catch (error) {
      throw new Error(`Error al obtener las citas del médico: ${error}`);
    }
  }

  static async eliminarCita(idCita: number, idPaciente: number) {
    return await sequelize.transaction(async (t: Transaction) => {
      const cita = await Cita.findByPk(idCita, { transaction: t });
      if (!cita) {
        throw new Error("Cita no encontrada");
      }
      if ((cita as any).id_paciente !== idPaciente) {
        throw new Error("No puedes eliminar una cita que no te pertenece");
      }

      const horario = await Horario.findByPk((cita as any).id_horario, { transaction: t });
      if (!horario) {
        throw new Error("Horario asociado a la cita no encontrado");
      }

      // Marcar la cita como CANCELADA
      await (cita as any).update({ estado: "CANCELADA", fecha_actualizacion: new Date() }, { transaction: t });

      // Liberar el horario si estaba ocupado
      if ((horario as any).estado === "OCUPADO") {
        await (horario as any).update({ estado: "DISPONIBLE", fecha_actualizacion: new Date() }, { transaction: t });
      }

      return { id_cita: (cita as any).id_cita, estado: "CANCELADA" };
    });
  }
}

export default CitaService;
