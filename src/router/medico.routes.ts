import { Router } from "express";
import { getMedicos } from "../controller/medico.controller";
import { verifyToken ,authorizeRoles } from "../middlewares/auth";

const router = Router();

router.get("/medicos", verifyToken, authorizeRoles("PACIENTE"),getMedicos);

export default router;
