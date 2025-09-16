import { Request, Response } from "express";
import HorarioService from "../service/HorarioService";

class HorarioController {
  static async crearHorario(req: Request, res: Response) {
    try {
      const idMedico = (req as any).user.id; // viene del token del médico
      const { titulo, fecha, hora_inicio, hora_fin, modalidad } = req.body;

      const horario = await HorarioService.crearHorario(idMedico, {
      
        fecha,
        hora_inicio,
        hora_fin,
        modalidad,
      });

      res.status(201).json({ success: true, data: horario });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Obtener horarios disponibles de la semana
  static async obtenerHorariosDisponiblesSemana(req: Request, res: Response) {
    try {
      const { idMedico, estado, modalidad } = req.query;
      
      const filtros: any = {};
      if (idMedico) filtros.idMedico = Number(idMedico);
      if (estado) filtros.estado = estado as string;
      if (modalidad) filtros.modalidad = modalidad as "PRESENCIAL" | "VIRTUAL";

      const horarios = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);
      
      res.json({
        success: true,
        data: horarios,
        total: horarios.length
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Obtener horarios disponibles por rango de fechas
  static async obtenerHorariosDisponiblesPorRango(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin, idMedico, estado, modalidad } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          success: false,
          message: "fechaInicio y fechaFin son requeridos"
        });
      }

      const filtros: any = {};
      if (idMedico) filtros.idMedico = Number(idMedico);
      if (estado) filtros.estado = estado as string;
      if (modalidad) filtros.modalidad = modalidad as "PRESENCIAL" | "VIRTUAL";

      const horarios = await HorarioService.obtenerHorariosDisponiblesPorRango(
        fechaInicio as string,
        fechaFin as string,
        filtros
      );
      
      res.json({
        success: true,
        data: horarios,
        total: horarios.length
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default HorarioController;
