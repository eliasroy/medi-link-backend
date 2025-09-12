import { Router } from "express";
import { MedicoController } from "../controller/medico.controller";
import { verifyToken ,authorizeRoles } from "../middlewares/auth";

const router = Router();

router.get("/medicos", verifyToken, authorizeRoles("PACIENTE"),MedicoController.getMedicosOrdenados);

export default router;
