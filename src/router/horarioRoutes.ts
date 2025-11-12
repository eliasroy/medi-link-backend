import { Router } from "express";
import HorarioController from "../controller/HorarioController";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/horarios/save:
 *   post:
 *     summary: Crear un nuevo horario
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: 2023-12-01
 *               horaInicio:
 *                 type: string
 *                 format: time
 *                 example: 09:00
 *               horaFin:
 *                 type: string
 *                 format: time
 *                 example: 17:00
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los médicos pueden crear horarios
 */
router.post("/save", verifyToken, authorizeRoles("MEDICO"), HorarioController.crearHorario);

/**
 * @swagger
 * /api/horarios/disponibles/semana:
 *   get:
 *     summary: Obtener horarios disponibles de la semana
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horarios disponibles obtenidos exitosamente
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
 *                     format: date
 *                     example: 2023-12-01
 *                   horaInicio:
 *                     type: string
 *                     format: time
 *                     example: 09:00
 *                   horaFin:
 *                     type: string
 *                     format: time
 *                     example: 17:00
 *                   medico:
 *                     type: string
 *                     example: Dr. Maria Garcia
 *       401:
 *         description: No autorizado
 */
router.get("/disponibles/semana", verifyToken,HorarioController.obtenerHorariosDisponiblesSemana);

/**
 * @swagger
 * /api/horarios/semana:
 *   get:
 *     summary: Obtener horarios disponibles de la semana (ruta alternativa)
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horarios disponibles obtenidos exitosamente
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
 *                     format: date
 *                     example: 2023-12-01
 *                   horaInicio:
 *                     type: string
 *                     format: time
 *                     example: 09:00
 *                   horaFin:
 *                     type: string
 *                     format: time
 *                     example: 17:00
 *                   medico:
 *                     type: string
 *                     example: Dr. Maria Garcia
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo los pacientes pueden acceder a este endpoint
 */
router.get("/semana", verifyToken, authorizeRoles("PACIENTE"), HorarioController.obtenerHorariosDisponiblesSemana);

/**
 * @swagger
 * /api/horarios/disponibles/rango:
 *   get:
 *     summary: Obtener horarios disponibles por rango de fechas
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin
 *     responses:
 *       200:
 *         description: Horarios disponibles obtenidos exitosamente
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
 *                     format: date
 *                     example: 2023-12-01
 *                   horaInicio:
 *                     type: string
 *                     format: time
 *                     example: 09:00
 *                   horaFin:
 *                     type: string
 *                     format: time
 *                     example: 17:00
 *                   medico:
 *                     type: string
 *                     example: Dr. Maria Garcia
 *       401:
 *         description: No autorizado
 */
router.get("/disponibles/rango",verifyToken, HorarioController.obtenerHorariosDisponiblesPorRango);

export default router;
