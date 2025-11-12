import { Router } from "express";
import { registrarPaciente, registrarMedico } from "../controller/usuario.controller";

const router = Router();

/**
 * @swagger
 * /api/usuarios/paciente:
 *   post:
 *     summary: Registrar un nuevo paciente
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Perez
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *               telefono:
 *                 type: string
 *                 example: +1234567890
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *     responses:
 *       201:
 *         description: Paciente registrado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 */
router.post("/paciente", registrarPaciente);

/**
 * @swagger
 * /api/usuarios/medico:
 *   post:
 *     summary: Registrar un nuevo médico
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Dr. Maria Garcia
 *               email:
 *                 type: string
 *                 example: maria.garcia@example.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *               telefono:
 *                 type: string
 *                 example: +1234567890
 *               especialidadId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Médico registrado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 */
router.post("/medico", registrarMedico);

export default router;
