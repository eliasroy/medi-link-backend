import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1]; // formato "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Guardamos la info del usuario en la request para usarla en el controller
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado", error });
  }
};
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
  
      if (!user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
  
      if (!roles.includes(user.rol)) {
        return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
      }
  
      next();
    };
  };