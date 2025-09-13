import { Request, Response } from "express";
import HorarioService from "../service/HorarioService";

class HorarioController {
  static async crearHorario(req: Request, res: Response) {
    try {
      const idMedico = (req as any).user.id; // viene del token del médico
      const { titulo, fecha, hora_inicio, hora_fin, modalidad } = req.body;

      const horario = await HorarioService.crearHorario(idMedico, {
        titulo,
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
}

export default HorarioController;
