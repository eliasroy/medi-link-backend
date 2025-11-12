
import { Router } from "express";
import EspecialidadController from "../controller/especialidad.controller";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/especialidades:
 *   get:
 *     summary: Obtener todas las especialidades
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Especialidades obtenidas exitosamente
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
 *                     example: Cardiología
 *                   descripcion:
 *                     type: string
 *                     example: Especialidad médica que trata los trastornos del corazón
 */
router.get("/", EspecialidadController.obtenerTodas);


export default router;
