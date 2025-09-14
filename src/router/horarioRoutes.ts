import { Router } from "express";
import HorarioController from "../controller/HorarioController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

// Solo médicos pueden registrar horarios
router.post("/save", verifyToken, authorizeRoles("MEDICO"), HorarioController.crearHorario);

// Obtener horarios disponibles de la semana (público)
router.get("/disponibles/semana", verifyToken, authorizeRoles("PACIENTE"),HorarioController.obtenerHorariosDisponiblesSemana);
router.get("/semana", verifyToken, authorizeRoles("PACIENTE"), HorarioController.obtenerHorariosDisponiblesSemana); // Ruta alternativa

// Obtener horarios disponibles por rango de fechas (público)
router.get("/disponibles/rango",verifyToken, authorizeRoles("PACIENTE"), HorarioController.obtenerHorariosDisponiblesPorRango);

export default router;
