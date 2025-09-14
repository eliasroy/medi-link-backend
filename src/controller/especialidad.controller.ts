
import { Request, Response } from "express";
import EspecialidadService from "../service/especialidad.service";

class EspecialidadController {
  static async obtenerTodas(req: Request, res: Response) {
    try {
      const especialidades = await EspecialidadService.obtenerTodas();
      res.json({
        success: true,
        data: especialidades
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

}

export default EspecialidadController;
