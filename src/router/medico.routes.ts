import { Router } from "express";
import { getMedicos } from "../controller/medico.controller";
import { verifyToken ,authorizeRoles } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/listarMedicos/medicos:
 *   get:
 *     summary: Obtener lista de médicos
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de médicos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: Dr. Maria Garcia
 *                   especialidad:
 *                     type: string
 *                     example: Cardiología
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los pacientes pueden acceder a este endpoint
 */
router.get("/medicos", verifyToken, authorizeRoles("PACIENTE","MEDICO"),getMedicos);

export default router;
