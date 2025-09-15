import { Request, Response } from "express";
import CitaService from "../service/CitaService";

class CitaController {
    static async crearCita(req: Request, res: Response) {
        try {
          const idPaciente = (req as any).user.id; // del token
          const { idHorario, idMedico, titulo, fecha, hora_inicio, hora_fin, modalidad } = req.body;
    
          const cita = await CitaService.crearCitaConHorario(idPaciente, {
            idHorario,
            idMedico,
            titulo,
            fecha,
            hora_inicio,
            hora_fin,
            modalidad,
          });
    
          res.status(201).json({ success: true, data: cita });
        } catch (err: any) {
          res.status(400).json({ success: false, message: err.message });
        }
      }

    static async obtenerCitasPorPaciente(req: Request, res: Response) {
        try {
          const { idPaciente } = req.params;
          
          if (!idPaciente || isNaN(Number(idPaciente))) {
            return res.status(400).json({ 
              success: false, 
              message: "ID de paciente inválido" 
            });
          }

          const citas = await CitaService.obtenerCitasPorPaciente(Number(idPaciente));
          
          res.status(200).json({ 
            success: true, 
            data: citas,
            count: citas.length 
          });
        } catch (err: any) {
          res.status(500).json({ 
            success: false, 
            message: err.message 
          });
        }
      }

      static async eliminarCita(req: Request, res: Response) {
        try {
          const { idCita } = req.params;
          if (!idCita || isNaN(Number(idCita))) {
            return res.status(400).json({ success: false, message: "ID de cita inválido" });
          }
          const idPaciente = (req as any).user.id; // del token
          const result = await CitaService.eliminarCita(Number(idCita), Number(idPaciente));
          return res.status(200).json({ success: true, data: result });
        } catch (err: any) {
          const status = err.message.includes("no encontrada") ? 404 : 400;
          return res.status(status).json({ success: false, message: err.message });
        }
      }

      static async obtenerCitasPorMedico(req: Request, res: Response) {
        try {
          const idMedico = (req as any).user.id; // del token
          console.log(idMedico);
          const citas = await CitaService.obtenerCitasPorMedico(Number(idMedico));
          return res.status(200).json({ success: true, data: citas, count: citas.length });
        } catch (err: any) {
          return res.status(500).json({ success: false, message: err.message });
        }
      }
}

export default CitaController;
