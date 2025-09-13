import { Request, Response } from "express";
import { listarMedicosFiltrados  } from "../service/medico.service";

export const getMedicos = async (req: Request, res: Response) => {
    try {
      const filtros = req.query; // parámetros opcionales en query string
      const medicos = await listarMedicosFiltrados(filtros);
      res.json(medicos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener médicos", error });
    }
  };
  
