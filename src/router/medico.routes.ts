import { Router } from "express";
import { MedicoController } from "../controller/medico.controller";
import { verifyToken } from "../middlewares/auth";

const router = Router();

router.get("/medicos", verifyToken,MedicoController.getMedicosOrdenados);

export default router;
