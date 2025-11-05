import request from 'supertest';
import express from 'express';
import horarioRoutes from '../../router/horarioRoutes';

// Mock the controllers
jest.mock('../../controller/HorarioController', () => ({
  crearHorario: jest.fn(),
  obtenerHorariosDisponiblesSemana: jest.fn(),
  obtenerHorariosDisponiblesPorRango: jest.fn(),
}));

import HorarioController from '../../controller/HorarioController';

const mockedCrearHorario = HorarioController.crearHorario as jest.MockedFunction<any>;
const mockedObtenerHorariosDisponiblesSemana = HorarioController.obtenerHorariosDisponiblesSemana as jest.MockedFunction<any>;
const mockedObtenerHorariosDisponiblesPorRango = HorarioController.obtenerHorariosDisponiblesPorRango as jest.MockedFunction<any>;

// Mock middleware
jest.mock('../../middlewares/auth', () => ({
  verifyToken: jest.fn((req: any, res: any, next: any) => next()),
  authorizeRoles: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

describe('horarioRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/horarios', horarioRoutes);
    jest.clearAllMocks();
  });

  describe('POST /horarios/save - Normal Cases', () => {
    it('should handle successful horario creation', async () => {
      const mockResponse = { success: true, data: { id_horario: 1 } };
      mockedCrearHorario.mockImplementation(async (req: any, res: any) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/horarios/save')
        .send({
          titulo: 'Consulta General',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(mockedCrearHorario).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /horarios/save - Limit Cases', () => {
    it('should handle missing required fields', async () => {
      mockedCrearHorario.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
      });

      const response = await request(app)
        .post('/horarios/save')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Campos requeridos faltantes' });
    });

    it('should handle invalid date format', async () => {
      mockedCrearHorario.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Formato de fecha inválido' });
      });

      const response = await request(app)
        .post('/horarios/save')
        .send({
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
      mockedCrearHorario.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Formato de hora inválido' });
      });

      const response = await request(app)
        .post('/horarios/save')
        .send({
          titulo: 'Consulta',
          fecha: '2024-12-01',
          hora_inicio: 'invalid-time',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Formato de hora inválido' });
    });

    it('should handle past date', async () => {
      mockedCrearHorario.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'No se pueden crear horarios en fechas pasadas' });
      });

      const response = await request(app)
        .post('/horarios/save')
        .send({
          titulo: 'Consulta',
          fecha: '2020-01-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'No se pueden crear horarios en fechas pasadas' });
    });
  });

  describe('POST /horarios/save - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedCrearHorario.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .post('/horarios/save')
        .send({
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
      mockedCrearHorario.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      });

      const response = await request(app)
        .post('/horarios/save')
        .send({
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

  describe('GET /horarios/disponibles/semana - Normal Cases', () => {
    it('should handle successful retrieval of weekly available horarios', async () => {
      const mockHorarios = [
        { id: 1, titulo: 'Consulta General', fecha: '2024-12-01', hora_inicio: '09:00:00' },
        { id: 2, titulo: 'Consulta Especializada', fecha: '2024-12-02', hora_inicio: '10:00:00' }
      ];
      const mockResponse = { success: true, data: mockHorarios, count: 2 };
      mockedObtenerHorariosDisponiblesSemana.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/horarios/disponibles/semana');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedObtenerHorariosDisponiblesSemana).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /horarios/disponibles/semana - Limit Cases', () => {
    it('should handle no available horarios', async () => {
      const mockResponse = { success: true, data: [], count: 0 };
      mockedObtenerHorariosDisponiblesSemana.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/horarios/disponibles/semana');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('GET /horarios/disponibles/semana - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedObtenerHorariosDisponiblesSemana.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/horarios/disponibles/semana');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('GET /horarios/semana - Normal Cases', () => {
    it('should handle successful retrieval of weekly horarios for patients', async () => {
      const mockHorarios = [
        { id: 1, titulo: 'Consulta General', fecha: '2024-12-01', hora_inicio: '09:00:00' }
      ];
      const mockResponse = { success: true, data: mockHorarios, count: 1 };
      mockedObtenerHorariosDisponiblesSemana.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/horarios/semana');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedObtenerHorariosDisponiblesSemana).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /horarios/semana - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedObtenerHorariosDisponiblesSemana.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/horarios/semana');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('GET /horarios/disponibles/rango - Normal Cases', () => {
    it('should handle successful retrieval of horarios by date range', async () => {
      const mockHorarios = [
        { id: 1, titulo: 'Consulta General', fecha: '2024-12-01', hora_inicio: '09:00:00' }
      ];
      const mockResponse = { success: true, data: mockHorarios, count: 1 };
      mockedObtenerHorariosDisponiblesPorRango.mockImplementation(async (req: any, res: any) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/horarios/disponibles/rango?fechaInicio=2024-12-01&fechaFin=2024-12-07');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedObtenerHorariosDisponiblesPorRango).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /horarios/disponibles/rango - Limit Cases', () => {
    it('should handle missing date parameters', async () => {
      mockedObtenerHorariosDisponiblesPorRango.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Parámetros de fecha requeridos' });
      });

      const response = await request(app)
        .get('/horarios/disponibles/rango');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Parámetros de fecha requeridos' });
    });

    it('should handle invalid date range', async () => {
      mockedObtenerHorariosDisponiblesPorRango.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Rango de fechas inválido' });
      });

      const response = await request(app)
        .get('/horarios/disponibles/rango?fechaInicio=2024-12-07&fechaFin=2024-12-01');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Rango de fechas inválido' });
    });
  });

  describe('GET /horarios/disponibles/rango - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedObtenerHorariosDisponiblesPorRango.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .get('/horarios/disponibles/rango?fechaInicio=2024-12-01&fechaFin=2024-12-07');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });
  });
});