import request from 'supertest';
import express from 'express';
import consultaRoutes from '../../router/consultaRoutes';

// Mock the controllers
jest.mock('../../controller/ConsultaController', () => ({
  iniciarConsulta: jest.fn(),
  actualizarConsulta: jest.fn(),
  calificarConsulta: jest.fn(),
  obtenerConsultaPorIdCita: jest.fn(),
}));

import ConsultaController from '../../controller/ConsultaController';

const mockedIniciarConsulta = ConsultaController.iniciarConsulta as jest.MockedFunction<any>;
const mockedActualizarConsulta = ConsultaController.actualizarConsulta as jest.MockedFunction<any>;
const mockedCalificarConsulta = ConsultaController.calificarConsulta as jest.MockedFunction<any>;
const mockedObtenerConsultaPorIdCita = ConsultaController.obtenerConsultaPorIdCita as jest.MockedFunction<any>;

// Mock middleware
jest.mock('../../middlewares/auth', () => ({
  verifyToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRoles: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('consultaRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/consultas', consultaRoutes);
    jest.clearAllMocks();
  });

  describe('POST /consultas/iniciar - Normal Cases', () => {
    it('should handle successful consulta initiation', async () => {
      const mockResponse = { success: true, data: { id_consulta: 1 } };
      mockedIniciarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/consultas/iniciar')
        .send({
          idCita: 1,
          diagnostico: 'Diagnóstico inicial',
          tratamiento: 'Tratamiento recomendado'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(mockedIniciarConsulta).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /consultas/iniciar - Limit Cases', () => {
    it('should handle missing required fields', async () => {
      mockedIniciarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
      });

      const response = await request(app)
        .post('/consultas/iniciar')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Campos requeridos faltantes' });
    });

    it('should handle invalid cita ID', async () => {
      mockedIniciarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'ID de cita inválido' });
      });

      const response = await request(app)
        .post('/consultas/iniciar')
        .send({
          idCita: 'invalid',
          diagnostico: 'Diagnóstico',
          tratamiento: 'Tratamiento'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'ID de cita inválido' });
    });

    it('should handle non-existent cita', async () => {
      mockedIniciarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(404).json({ success: false, message: 'Cita no encontrada' });
      });

      const response = await request(app)
        .post('/consultas/iniciar')
        .send({
          idCita: 999,
          diagnostico: 'Diagnóstico',
          tratamiento: 'Tratamiento'
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'Cita no encontrada' });
    });
  });

  describe('POST /consultas/iniciar - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedIniciarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .post('/consultas/iniciar')
        .send({
          idCita: 1,
          diagnostico: 'Diagnóstico',
          tratamiento: 'Tratamiento'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });

    it('should handle database connection error', async () => {
      mockedIniciarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      });

      const response = await request(app)
        .post('/consultas/iniciar')
        .send({
          idCita: 1,
          diagnostico: 'Diagnóstico',
          tratamiento: 'Tratamiento'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error de conexión a la base de datos' });
    });
  });

  describe('PUT /consultas/actualizar/:id_consulta - Normal Cases', () => {
    it('should handle successful consulta update', async () => {
      const mockResponse = { success: true, data: { id_consulta: 1, estado: 'ACTUALIZADA' } };
      mockedActualizarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put('/consultas/actualizar/1')
        .send({
          diagnostico: 'Diagnóstico actualizado',
          tratamiento: 'Tratamiento actualizado'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedActualizarConsulta).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /consultas/actualizar/:id_consulta - Limit Cases', () => {
    it('should handle invalid consulta ID', async () => {
      mockedActualizarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'ID de consulta inválido' });
      });

      const response = await request(app)
        .put('/consultas/actualizar/invalid')
        .send({
          diagnostico: 'Diagnóstico',
          tratamiento: 'Tratamiento'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'ID de consulta inválido' });
    });

    it('should handle non-existent consulta', async () => {
      mockedActualizarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(404).json({ success: false, message: 'Consulta no encontrada' });
      });

      const response = await request(app)
        .put('/consultas/actualizar/999')
        .send({
          diagnostico: 'Diagnóstico',
          tratamiento: 'Tratamiento'
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'Consulta no encontrada' });
    });

    it('should handle empty update fields', async () => {
      mockedActualizarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Al menos un campo debe ser actualizado' });
      });

      const response = await request(app)
        .put('/consultas/actualizar/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Al menos un campo debe ser actualizado' });
    });
  });

  describe('PUT /consultas/actualizar/:id_consulta - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedActualizarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .put('/consultas/actualizar/1')
        .send({
          diagnostico: 'Diagnóstico',
          tratamiento: 'Tratamiento'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('POST /consultas/calificar - Normal Cases', () => {
    it('should handle successful consulta rating', async () => {
      const mockResponse = { success: true, message: 'Consulta calificada exitosamente' };
      mockedCalificarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/consultas/calificar')
        .send({
          idConsulta: 1,
          calificacion: 5,
          comentario: 'Excelente atención'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedCalificarConsulta).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /consultas/calificar - Limit Cases', () => {
    it('should handle invalid rating value', async () => {
      mockedCalificarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Calificación debe estar entre 1 y 5' });
      });

      const response = await request(app)
        .post('/consultas/calificar')
        .send({
          idConsulta: 1,
          calificacion: 6,
          comentario: 'Comentario'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Calificación debe estar entre 1 y 5' });
    });

    it('should handle missing rating', async () => {
      mockedCalificarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Calificación es requerida' });
      });

      const response = await request(app)
        .post('/consultas/calificar')
        .send({
          idConsulta: 1,
          comentario: 'Comentario'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Calificación es requerida' });
    });
  });

  describe('POST /consultas/calificar - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedCalificarConsulta.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .post('/consultas/calificar')
        .send({
          idConsulta: 1,
          calificacion: 5,
          comentario: 'Comentario'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('GET /consultas/cita/:idCita - Normal Cases', () => {
    it('should handle successful consulta retrieval by cita ID', async () => {
      const mockResponse = { success: true, data: { id_consulta: 1, diagnostico: 'Diagnóstico' } };
      mockedObtenerConsultaPorIdCita.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/consultas/cita/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedObtenerConsultaPorIdCita).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /consultas/cita/:idCita - Limit Cases', () => {
    it('should handle invalid cita ID', async () => {
      mockedObtenerConsultaPorIdCita.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'ID de cita inválido' });
      });

      const response = await request(app)
        .get('/consultas/cita/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'ID de cita inválido' });
    });

    it('should handle non-existent consulta for cita', async () => {
      mockedObtenerConsultaPorIdCita.mockImplementation(async (req: any, res: any) => {
        res.status(404).json({ success: false, message: 'Consulta no encontrada para esta cita' });
      });

      const response = await request(app)
        .get('/consultas/cita/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'Consulta no encontrada para esta cita' });
    });
  });

  describe('GET /consultas/cita/:idCita - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedObtenerConsultaPorIdCita.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/consultas/cita/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });
});