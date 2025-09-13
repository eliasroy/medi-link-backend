import Consulta from "../model/Consulta";
import { Transaction } from "sequelize";
import {sequelize} from "../config/database";
import Cita from "../model/cita.model";
import Horario from "../model/horario.model";


class ConsultaService {
  // Iniciar consulta
  static async iniciarConsulta(idCita: number, motivo: string,idMedico: number) {
    return await sequelize.transaction(async (t: Transaction) => {
         // Obtener la cita junto con el horario
        const cita = await Cita.findOne({ where: { id_cita: idCita }, transaction: t });
    
        if (!cita) throw new Error("Cita no encontrada");
        const horario = await Horario.findOne({ where: { id_horario: cita.id_horario }, transaction: t });
    
    
        if (!cita.id_horario) throw new Error("Horario de la cita no encontrado");
    
        // Verificar que el horario pertenece al médico
        if (horario?.id_medico !== idMedico)
            throw new Error("No puedes iniciar una consulta que no te pertenece");
    

        // Verificar si ya existe consulta para esa cita
      const existente = await Consulta.findOne({ where: { id_cita: idCita }, transaction: t });
      if (existente) throw new Error("La consulta para esta cita ya fue iniciada");

      const consulta = await Consulta.create(
        {
          id_cita: idCita,
          motivo,
          estado: "INICIADO",
          fecha_registro: new Date(),
          fecha_actualizacion: new Date(),
        },
        { transaction: t }
      );
      return consulta;
    });
  }

  // Actualizar consulta (según modalidad)
  static async actualizarConsulta(
    idConsulta: number,
    idMedico: number,
    data: {
      diagnostico?: string;
      pathArchivo?: string;
      tratamiento?: string;
      observaciones?: string;
      calificacion?: number;
      estado: "EN_REVISION" | "DIAGNOSTICADA" | "FINALIZADA";
    }
  ) {
    return await sequelize.transaction(async (t: Transaction) => {
      const consulta = await Consulta.findByPk(idConsulta, { transaction: t });
      if (!consulta) throw new Error("Consulta no encontrada");
    //  Bloquear cambios si ya está finalizada
    if (consulta.estado === "FINALIZADA") {
            throw new Error("La consulta ya está finalizada y no puede actualizarse");
        }
      // Obtener cita + horario
      const cita = await Cita.findByPk(consulta.id_cita, { transaction: t });
      if (!cita) throw new Error("Cita no encontrada");

      const horario = await Horario.findByPk(cita.id_horario, { transaction: t });
      if (!horario) throw new Error("Horario de la cita no encontrado");

      // Validar que el horario pertenece al médico
      if (horario.id_medico !== idMedico) {
        throw new Error("No puedes actualizar una consulta que no te pertenece");
      }

      // Reglas de transición según modalidad
      if (horario.modalidad === "VIRTUAL") {
        // Virtual: solo puede estar en INICIADO o FINALIZADA
        if (data.estado !== "FINALIZADA") {
          throw new Error("Las consultas virtuales solo pueden pasar a FINALIZADA");
        }
      } else if (horario.modalidad === "PRESENCIAL") {
        // Presencial: puede ir a EN_REVISION, DIAGNOSTICADA o FINALIZADA
        if (!["EN_REVISION", "DIAGNOSTICADA", "FINALIZADA"].includes(data.estado)) {
          throw new Error("Estado inválido para consulta presencial");
        }
      }

      // Actualizar la consulta
      await consulta.update(
        {
          ...data,
          fecha_actualizacion: new Date(),
        },
        { transaction: t }
      );

      return consulta;
    });
  }

static async calificarConsulta(
  idConsulta: number,
  idPaciente: number,
  calificacion: number
) {
  if (calificacion < 1 || calificacion > 10) {
    throw new Error("La calificación debe ser un número entre 1 y 10");
  }

  return await sequelize.transaction(async (t: Transaction) => {
    const consulta = await Consulta.findByPk(idConsulta, { transaction: t });
    if (!consulta) throw new Error("Consulta no encontrada");

    // Solo consultas FINALIZADAS pueden ser calificadas
    if (consulta.estado !== "FINALIZADA") {
      throw new Error("Solo se pueden calificar consultas finalizadas");
    }

    // Verificar que la cita pertenece al paciente
    const cita = await Cita.findByPk(consulta.id_cita, { transaction: t });
    if (!cita) throw new Error("Cita no encontrada");

    if (cita.id_paciente !== idPaciente) {
      throw new Error("No puedes calificar una consulta que no te pertenece");
    }

    // Evitar recalificación
    if (consulta.calificacion) {
      throw new Error("La consulta ya fue calificada");
    }

    // Actualizar calificación
    await consulta.update(
      { calificacion, fecha_actualizacion: new Date() },
      { transaction: t }
    );

    return consulta;
  });
}

  
}

export default ConsultaService;
