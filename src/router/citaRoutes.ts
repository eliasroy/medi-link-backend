// routes/citaRoutes.ts
import { Router } from "express";
import CitaController from "../controller/CitaController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.post("/save", verifyToken, authorizeRoles("PACIENTE"), CitaController.crearCita);

export default router;
