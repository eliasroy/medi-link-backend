import { Request, Response } from "express";
import * as usuarioService from "../service/usuario.service";

export const registrarPaciente = async (req: Request, res: Response) => {
  try {
    const result = await usuarioService.registrarPaciente(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const registrarMedico = async (req: Request, res: Response) => {
  try {
    const result = await usuarioService.registrarMedico(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
