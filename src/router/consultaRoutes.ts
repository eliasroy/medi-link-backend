import { Router } from "express";
import ConsultaController from "../controller/ConsultaController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

// Solo médicos pueden iniciar o actualizar consultas
router.post("/iniciar", verifyToken, authorizeRoles("MEDICO"), ConsultaController.iniciarConsulta);
router.put("/actualizar/:id_consulta", verifyToken, authorizeRoles("MEDICO"), ConsultaController.actualizarConsulta);
router.post("/calificar",verifyToken,authorizeRoles("PACIENTE"),ConsultaController.calificarConsulta);
router.get("/cita/:idCita", verifyToken, authorizeRoles("MEDICO","PACIENTE"), ConsultaController.obtenerConsultaPorIdCita);
export default router;
