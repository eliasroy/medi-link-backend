import Horario from "../model/horario.model";
import { Transaction, Op } from "sequelize";
import {sequelize} from "../config/database";
import { Medico } from "../model/medico.model";
import Especialidad from "../model/especialidad.model";

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

  /**
   * Obtiene horarios disponibles de la semana actual
   * @param filtros Filtros opcionales (idMedico, especialidad, modalidad)
   * @returns Lista de horarios disponibles con información del médico
   */
  static async obtenerHorariosDisponiblesSemana(filtros: {
    idMedico?: number;
    estado?: string;
    modalidad?: "PRESENCIAL" | "VIRTUAL";
  } = {}) {
    try {
      // Calcular inicio y fin de la semana actual
      const hoy = new Date();
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo
      inicioSemana.setHours(0, 0, 0, 0);
      
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6); // Sábado
      finSemana.setHours(23, 59, 59, 999);

      // Construir condiciones de búsqueda
      const whereConditions: any = {
        fecha: {
          [Op.between]: [inicioSemana, finSemana]
        }
      };

      if (filtros.idMedico) {
        whereConditions.id_medico = filtros.idMedico;
      }

      if (filtros.modalidad) {
        whereConditions.modalidad = filtros.modalidad;
      }
      if (filtros.estado) {
        whereConditions.estado = filtros.estado;
      }
      // Construir include para joins
      const includeOptions: any = [
        {
          model: Medico,
          as: 'medico',
          include: [
            {
              model: Especialidad,
              as: 'especialidad'
            }
          ]
        }
      ];

 
      const horarios = await Horario.findAll({
        where: whereConditions,
        include: includeOptions,
        order: [
          ['fecha', 'ASC'],
          ['hora_inicio', 'ASC']
        ]
      });

      return horarios;
    } catch (error) {
      throw new Error("Error al obtener horarios disponibles de la semana");
    }
  }

  /**
   * Obtiene horarios disponibles por rango de fechas
   * @param fechaInicio Fecha de inicio (YYYY-MM-DD)
   * @param fechaFin Fecha de fin (YYYY-MM-DD)
   * @param filtros Filtros opcionales
   * @returns Lista de horarios disponibles
   */
  static async obtenerHorariosDisponiblesPorRango(
    fechaInicio: string,
    fechaFin: string,
    filtros: {
      idMedico?: number;
      estado?: string;
      modalidad?: "PRESENCIAL" | "VIRTUAL";
    } = {}
  ) {
    try {
      const whereConditions: any = {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      };

      if (filtros.idMedico) {
        whereConditions.id_medico = filtros.idMedico;
      }

      if (filtros.modalidad) {
        whereConditions.modalidad = filtros.modalidad;
      }
      if (filtros.estado) {
        whereConditions.estado = filtros.estado;
      }
      const includeOptions: any = [
        {
          model: Medico,
          as: 'medico',
          include: [
            {
              model: Especialidad,
              as: 'especialidad'
            }
          ]
        }
      ];

  

      const horarios = await Horario.findAll({
        where: whereConditions,
        include: includeOptions,
        order: [
          ['fecha', 'ASC'],
          ['hora_inicio', 'ASC']
        ]
      });

      return horarios;
    } catch (error) {
      throw new Error("Error al obtener horarios disponibles por rango");
    }
  }
}

export default HorarioService;
