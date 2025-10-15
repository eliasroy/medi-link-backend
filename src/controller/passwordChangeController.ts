import { Request, Response } from "express";
import * as passwordChangeService from "../service/passwordChange.service";

// Cambiar contraseña por email
export const changePasswordByEmail = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  // Validar que se proporcionen los datos requeridos
  if (!email || !newPassword) {
    return res.status(400).json({ 
      error: "Email y nueva contraseña son requeridos" 
    });
  }

  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: "Formato de email inválido" 
    });
  }

  // Validar longitud mínima de contraseña
  if (newPassword.length < 6) {
    return res.status(400).json({ 
      error: "La contraseña debe tener al menos 6 caracteres" 
    });
  }

  try {
    const result = await passwordChangeService.changePasswordByEmail(email, newPassword);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
