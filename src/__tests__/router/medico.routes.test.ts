import request from 'supertest';
import express from 'express';
import medicoRoutes from '../../router/medico.routes';

// Mock the controllers
jest.mock('../../controller/medico.controller', () => ({
  getMedicos: jest.fn(),
}));

import { getMedicos } from '../../controller/medico.controller';

const mockedGetMedicos = getMedicos as jest.MockedFunction<any>;

// Mock middleware
jest.mock('../../middlewares/auth', () => ({
  verifyToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRoles: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('medicoRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/medicos', medicoRoutes);
    jest.clearAllMocks();
  });

  describe('GET /medicos/medicos - Normal Cases', () => {
    it('should handle successful retrieval of medicos', async () => {
      const mockMedicos = [
        {
          id: 1,
          usuario: {
            nombre: 'Dr. Juan',
            paterno: 'Pérez',
            materno: 'García',
            email: 'juan.perez@hospital.com'
          },
          especialidad: { nombre: 'Cardiología' }
        },
        {
          id: 2,
          usuario: {
            nombre: 'Dr. María',
            paterno: 'López',
            materno: 'Rodríguez',
            email: 'maria.lopez@hospital.com'
          },
          especialidad: { nombre: 'Neurología' }
        }
      ];
      const mockResponse = { success: true, data: mockMedicos, count: 2 };
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedGetMedicos).toHaveBeenCalledTimes(1);
    });

    it('should handle empty medicos list', async () => {
      const mockResponse = { success: true, data: [], count: 0 };
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /medicos/medicos - Limit Cases', () => {
    it('should handle large number of medicos', async () => {
      const mockMedicos = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        usuario: {
          nombre: `Dr. Nombre${i + 1}`,
          paterno: `Paterno${i + 1}`,
          materno: `Materno${i + 1}`,
          email: `doctor${i + 1}@hospital.com`
        },
        especialidad: { nombre: 'Medicina General' }
      }));
      const mockResponse = { success: true, data: mockMedicos, count: 50 };
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(response.body.data).toHaveLength(50);
    });

    it('should handle medicos with long names', async () => {
      const mockMedicos = [
        {
          id: 1,
          usuario: {
            nombre: 'Dr. NombreMuyLargoConMuchosCaracteres',
            paterno: 'ApellidoPaternoMuyLargoTambien',
            materno: 'ApellidoMaternoIgualmenteLargo',
            email: 'doctor.con.nombre.muy.largo@hospital.com'
          },
          especialidad: { nombre: 'Especialidad' }
        }
      ];
      const mockResponse = { success: true, data: mockMedicos, count: 1 };
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /medicos/medicos - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });

    it('should handle database connection error', async () => {
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error de conexión a la base de datos' });
    });

    it('should handle unauthorized access', async () => {
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        res.status(403).json({ success: false, message: 'Acceso no autorizado' });
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ success: false, message: 'Acceso no autorizado' });
    });

    it('should handle timeout error', async () => {
      mockedGetMedicos.mockImplementation(async (req: any, res: any) => {
        // Simulate timeout by throwing an error
        res.status(504).json({ success: false, message: 'Timeout error' });
      });

      const response = await request(app)
        .get('/medicos/medicos');

      expect(response.status).toBe(504);
      expect(response.body).toEqual({ success: false, message: 'Timeout error' });
    });
  });
});