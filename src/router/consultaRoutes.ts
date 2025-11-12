import { Router } from "express";
import ConsultaController from "../controller/ConsultaController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/consultas/iniciar:
 *   post:
 *     summary: Iniciar una nueva consulta
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idCita:
 *                 type: integer
 *                 example: 1
 *               diagnostico:
 *                 type: string
 *                 example: Resfriado común
 *               tratamiento:
 *                 type: string
 *                 example: Reposo e hidratación
 *     responses:
 *       201:
 *         description: Consulta iniciada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los médicos pueden iniciar consultas
 */
router.post("/iniciar", verifyToken, authorizeRoles("MEDICO"), ConsultaController.iniciarConsulta);

/**
 * @swagger
 * /api/consultas/actualizar/{id_consulta}:
 *   put:
 *     summary: Actualizar una consulta
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_consulta
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la consulta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnostico:
 *                 type: string
 *                 example: Diagnóstico actualizado
 *               tratamiento:
 *                 type: string
 *                 example: Tratamiento actualizado
 *     responses:
 *       200:
 *         description: Consulta actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los médicos pueden actualizar consultas
 *       404:
 *         description: Consulta no encontrada
 */
router.put("/actualizar/:id_consulta", verifyToken, authorizeRoles("MEDICO"), ConsultaController.actualizarConsulta);

/**
 * @swagger
 * /api/consultas/calificar:
 *   post:
 *     summary: Calificar una consulta
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idConsulta:
 *                 type: integer
 *                 example: 1
 *               calificacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 example: Excelente servicio
 *     responses:
 *       200:
 *         description: Consulta calificada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los pacientes pueden calificar consultas
 */
router.post("/calificar",verifyToken,authorizeRoles("PACIENTE"),ConsultaController.calificarConsulta);

/**
 * @swagger
 * /api/consultas/cita/{idCita}:
 *   get:
 *     summary: Obtener consulta por ID de cita
 *     tags: [Consultas]
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
 *         description: Consulta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 diagnostico:
 *                   type: string
 *                   example: Resfriado común
 *                 tratamiento:
 *                   type: string
 *                   example: Reposo e hidratación
 *                 calificacion:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo médicos y pacientes pueden acceder a las consultas
 *       404:
 *         description: Consulta no encontrada
 */
router.get("/cita/:idCita", verifyToken, authorizeRoles("MEDICO","PACIENTE"), ConsultaController.obtenerConsultaPorIdCita);
export default router;
