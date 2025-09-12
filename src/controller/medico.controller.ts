import { Request, Response } from "express";
import { MedicoService } from "../service/medico.service";

export class MedicoController {
  static async getMedicosOrdenados(req: Request, res: Response) {
    try {
        console.log('entro');
      const medicos = await MedicoService.listarMedicosOrdenados();

      res.json(medicos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener médicos", error });
    }
  }
}
