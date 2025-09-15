import { Request, Response } from "express";
import ConsultaService from "../service/ConsultaService";

class ConsultaController {
  // Iniciar consulta
  static async iniciarConsulta(req: Request, res: Response) {
    try {
      const { id_cita, motivo } = req.body;
      const idMedico = (req as any).user.id; // viene del token del médico
      const consulta = await ConsultaService.iniciarConsulta(id_cita, motivo,idMedico);
      res.status(201).json({ success: true, data: consulta });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Actualizar consulta
  static async actualizarConsulta(req: Request, res: Response) {
    try {
      const { id_consulta } = req.params;
      const idMedico = (req as any).user.id; // viene del token del médico
      const { diagnostico, pathArchivo, tratamiento, observaciones, calificacion, estado } = req.body;
      console.log("enra")
      const consulta = await ConsultaService.actualizarConsulta(Number(id_consulta),idMedico, {
        diagnostico,
        pathArchivo,
        tratamiento,
        observaciones,
        calificacion,
        estado,
      });

      res.status(200).json({ success: true, data: consulta });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async calificarConsulta(req: Request, res: Response) {
    try {
      const idPaciente = (req as any).user.id; // paciente del token
      const { id_consulta, calificacion } = req.body;
  
      const consulta = await ConsultaService.calificarConsulta(
        Number(id_consulta),
        idPaciente,
        Number(calificacion)
      );
  
      res.status(200).json({ success: true, data: consulta });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
  
  static async obtenerConsultaPorIdCita(req: Request, res: Response) {
    try {
      const { idCita } = req.params;
      if (!idCita || isNaN(Number(idCita))) {
        return res.status(400).json({ success: false, message: 'ID de cita inválido' });
      }
      const consulta = await ConsultaService.obtenerConsultaPorIdCita(Number(idCita));
      return res.status(200).json({ success: true, data: consulta });
    } catch (err: any) {
      const status = err.message.includes('no encontrada') ? 404 : 400;
      return res.status(status).json({ success: false, message: err.message });
    }
  }
}

export default ConsultaController;
