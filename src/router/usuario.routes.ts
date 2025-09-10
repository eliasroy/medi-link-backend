import { Router } from "express";
import { registrarPaciente, registrarMedico } from "../controller/usuario.controller";

const router = Router();

router.post("/paciente", registrarPaciente);
router.post("/medico", registrarMedico);

export default router;
