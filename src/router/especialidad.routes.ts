
import { Router } from "express";
import EspecialidadController from "../controller/especialidad.controller";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

// Obtener todas las especialidades (público)
router.get("/", EspecialidadController.obtenerTodas);


export default router;
