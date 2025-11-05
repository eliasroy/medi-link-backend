import request from 'supertest';
import express from 'express';
import especialidadRoutes from '../../router/especialidad.routes';

// Mock the controllers
jest.mock('../../controller/especialidad.controller', () => ({
  obtenerTodas: jest.fn(),
}));

import EspecialidadController from '../../controller/especialidad.controller';

const mockedObtenerTodas = EspecialidadController.obtenerTodas as jest.MockedFunction<any>;

// Mock middleware
jest.mock('../../middlewares/auth', () => ({
  verifyToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRoles: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('especialidadRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/especialidades', especialidadRoutes);
    jest.clearAllMocks();
  });

  describe('GET /especialidades/ - Normal Cases', () => {
    it('should handle successful retrieval of all especialidades', async () => {
      const mockEspecialidades = [
        { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad del corazón' },
        { id: 2, nombre: 'Neurología', descripcion: 'Especialidad del sistema nervioso' }
      ];
      const mockResponse = { success: true, data: mockEspecialidades, count: 2 };
      mockedObtenerTodas.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/especialidades/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedObtenerTodas).toHaveBeenCalledTimes(1);
    });

    it('should handle empty especialidades list', async () => {
      const mockResponse = { success: true, data: [], count: 0 };
      mockedObtenerTodas.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/especialidades/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /especialidades/ - Limit Cases', () => {
    it('should handle large number of especialidades', async () => {
      const mockEspecialidades = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        nombre: `Especialidad ${i + 1}`,
        descripcion: `Descripción ${i + 1}`
      }));
      const mockResponse = { success: true, data: mockEspecialidades, count: 100 };
      mockedObtenerTodas.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/especialidades/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(response.body.data).toHaveLength(100);
    });
  });

  describe('GET /especialidades/ - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedObtenerTodas.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/especialidades/');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });

    it('should handle database connection error', async () => {
      mockedObtenerTodas.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      });

      const response = await request(app)
        .get('/especialidades/');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error de conexión a la base de datos' });
    });

    it('should handle timeout error', async () => {
      mockedObtenerTodas.mockImplementation(async (req: any, res: any) => {
        // Simulate timeout by throwing an error
        res.status(504).json({ success: false, message: 'Timeout error' });
      });

      const response = await request(app)
        .get('/especialidades/');

      expect(response.status).toBe(504);
      expect(response.body).toEqual({ success: false, message: 'Timeout error' });
    });
  });
});