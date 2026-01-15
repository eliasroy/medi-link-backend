import Horario from "../model/horario.model";
import { Transaction, Op } from "sequelize";
import {sequelize} from "../config/database";
import { Medico } from "../model/medico.model";
import Especialidad from "../model/especialidad.model";
import { Usuario } from "../model/usuario.model";

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
    const { whereConditions, includeOptions } = this._buildQuerySemana(filtros);

    return this._findHorariosSemana(whereConditions, includeOptions);
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
    const { whereConditions, includeOptions } = this._buildQueryRango(fechaInicio, fechaFin, filtros);

    return this._findHorariosRango(whereConditions, includeOptions);
  }

  /**
   * Helper method to find horarios for semana with error handling
   */
  private static async _findHorariosSemana(whereConditions: any, includeOptions: any) {
    return Horario.findAll({
      where: whereConditions,
      include: includeOptions,
      order: [
        ['fecha', 'ASC'],
        ['hora_inicio', 'ASC']
      ]
    }).catch(error => {
      throw new Error("Error al obtener horarios disponibles de la semana");
    });
  }

  /**
   * Helper method to find horarios for rango with error handling
   */
  private static async _findHorariosRango(whereConditions: any, includeOptions: any) {
    return Horario.findAll({
      where: whereConditions,
      include: includeOptions,
      order: [
        ['fecha', 'ASC'],
        ['hora_inicio', 'ASC']
      ]
    }).catch(error => {
      throw new Error("Error al obtener horarios disponibles por rango");
    });
  }

  /**
   * Builds query conditions for semana
   */
  private static _buildQuerySemana(filtros: {
    idMedico?: number;
    estado?: string;
    modalidad?: "PRESENCIAL" | "VIRTUAL";
  }) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo de esta semana
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado de esta semana
    endOfWeek.setHours(23, 59, 59, 999);

    const whereConditions: any = {
      fecha: {
        [Op.between]: [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
      },
      estado: filtros.estado || "DISPONIBLE"
    };

    if (filtros.idMedico) {
      whereConditions.id_medico = filtros.idMedico;
    }

    if (filtros.modalidad) {
      whereConditions.modalidad = filtros.modalidad;
    }

    const includeOptions = [
      {
        model: Medico,
        as: 'medico',
        attributes: ['id_medico'],
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'paterno', 'materno']
          },
          {
            model: Especialidad,
            as: 'especialidad',
            attributes: ['id_especialidad', 'nombre']
          }
        ]
      }
    ];

    return { whereConditions, includeOptions };
  }

  /**
   * Builds query conditions for rango
   */
  private static _buildQueryRango(fechaInicio: string, fechaFin: string, filtros: {
    idMedico?: number;
    estado?: string;
    modalidad?: "PRESENCIAL" | "VIRTUAL";
  }) {
    const whereConditions: any = {
      fecha: {
        [Op.between]: [fechaInicio, fechaFin]
      },
      estado: filtros.estado || "DISPONIBLE"
    };

    if (filtros.idMedico) {
      whereConditions.id_medico = filtros.idMedico;
    }

    if (filtros.modalidad) {
      whereConditions.modalidad = filtros.modalidad;
    }

    const includeOptions = [
      {
        model: Medico,
        as: 'medico',
        attributes: ['id_medico'],
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['nombre', 'paterno', 'materno']
          },
          {
            model: Especialidad,
            as: 'especialidad',
            attributes: ['id_especialidad', 'nombre']
          }
        ]
      }
    ];

    return { whereConditions, includeOptions };
  }
}

export default HorarioService;
