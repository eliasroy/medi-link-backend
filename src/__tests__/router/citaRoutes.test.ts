import request from 'supertest';
import express from 'express';
import citaRoutes from '../../router/citaRoutes';

// Mock the controllers
jest.mock('../../controller/CitaController', () => ({
  crearCita: jest.fn(),
  obtenerCitasPorPaciente: jest.fn(),
  eliminarCita: jest.fn(),
  obtenerCitasPorMedico: jest.fn(),
}));

import CitaController from '../../controller/CitaController';

const mockedCrearCita = CitaController.crearCita as jest.MockedFunction<any>;
const mockedObtenerCitasPorPaciente = CitaController.obtenerCitasPorPaciente as jest.MockedFunction<any>;
const mockedEliminarCita = CitaController.eliminarCita as jest.MockedFunction<any>;
const mockedObtenerCitasPorMedico = CitaController.obtenerCitasPorMedico as jest.MockedFunction<any>;

// Mock middleware
jest.mock('../../middlewares/auth', () => ({
  verifyToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRoles: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('citaRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/citas', citaRoutes);
    jest.clearAllMocks();
  });

  describe('POST /citas/save - Normal Cases', () => {
    it('should handle successful cita creation', async () => {
      const mockResponse = { success: true, data: { id_cita: 1 } };
      mockedCrearCita.mockImplementation(async (req: any, res: any) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/citas/save')
        .send({
          idHorario: 1,
          idMedico: 1,
          titulo: 'Consulta General',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(mockedCrearCita).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /citas/save - Limit Cases', () => {
    it('should handle missing required fields', async () => {
      mockedCrearCita.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
      });

      const response = await request(app)
        .post('/citas/save')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Campos requeridos faltantes' });
    });

    it('should handle invalid date format', async () => {
      mockedCrearCita.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Formato de fecha inválido' });
      });

      const response = await request(app)
        .post('/citas/save')
        .send({
          idHorario: 1,
          idMedico: 1,
          titulo: 'Consulta',
          fecha: 'invalid-date',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Formato de fecha inválido' });
    });

    it('should handle invalid time format', async () => {
      mockedCrearCita.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Formato de hora inválido' });
      });

      const response = await request(app)
        .post('/citas/save')
        .send({
          idHorario: 1,
          idMedico: 1,
          titulo: 'Consulta',
          fecha: '2024-12-01',
          hora_inicio: 'invalid-time',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Formato de hora inválido' });
    });
  });

  describe('POST /citas/save - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedCrearCita.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .post('/citas/save')
        .send({
          idHorario: 1,
          idMedico: 1,
          titulo: 'Consulta',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });

    it('should handle database connection error', async () => {
      mockedCrearCita.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      });

      const response = await request(app)
        .post('/citas/save')
        .send({
          idHorario: 1,
          idMedico: 1,
          titulo: 'Consulta',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error de conexión a la base de datos' });
    });
  });

  describe('GET /citas/paciente/:idPaciente - Normal Cases', () => {
    it('should handle successful retrieval of patient appointments', async () => {
      const mockResponse = { success: true, data: [{ id_cita: 1 }], count: 1 };
      mockedObtenerCitasPorPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/citas/paciente/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedObtenerCitasPorPaciente).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /citas/paciente/:idPaciente - Limit Cases', () => {
    it('should handle invalid patient ID', async () => {
      mockedObtenerCitasPorPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'ID de paciente inválido' });
      });

      const response = await request(app)
        .get('/citas/paciente/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'ID de paciente inválido' });
    });

    it('should handle non-existent patient', async () => {
      mockedObtenerCitasPorPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(404).json({ success: false, message: 'Paciente no encontrado' });
      });

      const response = await request(app)
        .get('/citas/paciente/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'Paciente no encontrado' });
    });
  });

  describe('GET /citas/paciente/:idPaciente - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedObtenerCitasPorPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/citas/paciente/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('DELETE /citas/:idCita - Normal Cases', () => {
    it('should handle successful cita deletion', async () => {
      const mockResponse = { success: true, data: { id_cita: 1, estado: 'CANCELADA' } };
      mockedEliminarCita.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .delete('/citas/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedEliminarCita).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /citas/:idCita - Limit Cases', () => {
    it('should handle invalid cita ID', async () => {
      mockedEliminarCita.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'ID de cita inválido' });
      });

      const response = await request(app)
        .delete('/citas/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'ID de cita inválido' });
    });

    it('should handle non-existent cita', async () => {
      mockedEliminarCita.mockImplementation(async (req: any, res: any) => {
        res.status(404).json({ success: false, message: 'Cita no encontrada' });
      });

      const response = await request(app)
        .delete('/citas/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'Cita no encontrada' });
    });
  });

  describe('DELETE /citas/:idCita - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedEliminarCita.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .delete('/citas/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('GET /citas/medico - Normal Cases', () => {
    it('should handle successful retrieval of doctor appointments', async () => {
      const mockResponse = { success: true, data: [{ id_cita: 1 }], count: 1 };
      mockedObtenerCitasPorMedico.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/citas/medico');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedObtenerCitasPorMedico).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /citas/medico - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedObtenerCitasPorMedico.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/citas/medico');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });
});