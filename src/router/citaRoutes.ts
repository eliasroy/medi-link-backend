// routes/citaRoutes.ts
import { Router } from "express";
import CitaController from "../controller/CitaController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.post("/save", verifyToken, authorizeRoles("PACIENTE"), CitaController.crearCita);
router.get("/paciente/:idPaciente", verifyToken,authorizeRoles("PACIENTE"), CitaController.obtenerCitasPorPaciente);
router.delete("/:idCita", verifyToken, authorizeRoles("PACIENTE"), CitaController.eliminarCita);
router.get("/medico", verifyToken, authorizeRoles("MEDICO"), CitaController.obtenerCitasPorMedico);

export default router;
