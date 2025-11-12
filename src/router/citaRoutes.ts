// routes/citaRoutes.ts
import { Router } from "express";
import CitaController from "../controller/CitaController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/citas/save:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPaciente:
 *                 type: integer
 *                 example: 1
 *               idHorario:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los pacientes pueden crear citas
 */
router.post("/save", verifyToken, authorizeRoles("PACIENTE"), CitaController.crearCita);

/**
 * @swagger
 * /api/citas/paciente/{idPaciente}:
 *   get:
 *     summary: Obtener citas por ID de paciente
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPaciente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Citas obtenidas exitosamente
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
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-12-01T10:00:00Z
 *                   medico:
 *                     type: string
 *                     example: Dr. Maria Garcia
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los pacientes pueden acceder a sus propias citas
 */
router.get("/paciente/:idPaciente", verifyToken,authorizeRoles("PACIENTE"), CitaController.obtenerCitasPorPaciente);

/**
 * @swagger
 * /api/citas/{idCita}:
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCita
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los pacientes pueden eliminar citas
 *       404:
 *         description: Cita no encontrada
 */
router.delete("/:idCita", verifyToken, authorizeRoles("PACIENTE"), CitaController.eliminarCita);

/**
 * @swagger
 * /api/citas/medico:
 *   get:
 *     summary: Obtener citas por médico
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Citas obtenidas exitosamente
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
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: 2023-12-01T10:00:00Z
 *                   paciente:
 *                     type: string
 *                     example: Juan Perez
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los médicos pueden acceder a este endpoint
 */
router.get("/medico", verifyToken, authorizeRoles("MEDICO"), CitaController.obtenerCitasPorMedico);

export default router;
