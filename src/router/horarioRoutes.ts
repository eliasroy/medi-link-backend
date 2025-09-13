import { Router } from "express";
import HorarioController from "../controller/HorarioController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

// Solo médicos pueden registrar horarios
router.post("/save", verifyToken, authorizeRoles("MEDICO"), HorarioController.crearHorario);

export default router;
