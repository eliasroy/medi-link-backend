import request from 'supertest';
import express from 'express';
import usuarioRoutes from '../../router/usuario.routes';

// Mock the controllers
jest.mock('../../controller/usuario.controller', () => ({
  registrarPaciente: jest.fn(),
  registrarMedico: jest.fn(),
}));

import { registrarPaciente, registrarMedico } from '../../controller/usuario.controller';

const mockedRegistrarPaciente = registrarPaciente as jest.MockedFunction<any>;
const mockedRegistrarMedico = registrarMedico as jest.MockedFunction<any>;

describe('usuarioRoutes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/usuarios', usuarioRoutes);
    jest.clearAllMocks();
  });

  describe('POST /usuarios/paciente - Normal Cases', () => {
    it('should handle successful paciente registration', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          usuario: {
            nombre: 'Juan',
            paterno: 'Pérez',
            materno: 'García',
            email: 'juan.perez@example.com'
          }
        }
      };
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'juan.perez@example.com',
          password: 'password123',
          fecha_nacimiento: '1990-01-01'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(mockedRegistrarPaciente).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /usuarios/paciente - Limit Cases', () => {
    it('should handle missing required fields', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Campos requeridos faltantes' });
    });

    it('should handle empty nombre', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Nombre es requerido' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: '',
          paterno: 'Pérez',
          materno: 'García',
          email: 'juan.perez@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Nombre es requerido' });
    });

    it('should handle empty email', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Email es requerido' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: '',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Email es requerido' });
    });

    it('should handle invalid email format', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Formato de email inválido' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Formato de email inválido' });
    });

    it('should handle weak password', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Contraseña muy débil' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'juan.perez@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Contraseña muy débil' });
    });

    it('should handle existing email', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(409).json({ success: false, message: 'Email ya registrado' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ success: false, message: 'Email ya registrado' });
    });
  });

  describe('POST /usuarios/paciente - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'juan.perez@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });

    it('should handle database connection error', async () => {
      mockedRegistrarPaciente.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      });

      const response = await request(app)
        .post('/usuarios/paciente')
        .send({
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'juan.perez@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error de conexión a la base de datos' });
    });
  });

  describe('POST /usuarios/medico - Normal Cases', () => {
    it('should handle successful medico registration', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          usuario: {
            nombre: 'Dr. María',
            paterno: 'López',
            materno: 'Rodríguez',
            email: 'maria.lopez@hospital.com'
          },
          especialidad: { nombre: 'Cardiología' }
        }
      };
      mockedRegistrarMedico.mockImplementation(async (req: any, res: any) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/usuarios/medico')
        .send({
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Rodríguez',
          email: 'maria.lopez@hospital.com',
          password: 'password123',
          id_especialidad: 1,
          numero_colegiatura: '12345'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(mockedRegistrarMedico).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /usuarios/medico - Limit Cases', () => {
    it('should handle missing required fields', async () => {
      mockedRegistrarMedico.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
      });

      const response = await request(app)
        .post('/usuarios/medico')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Campos requeridos faltantes' });
    });

    it('should handle invalid especialidad ID', async () => {
      mockedRegistrarMedico.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Especialidad inválida' });
      });

      const response = await request(app)
        .post('/usuarios/medico')
        .send({
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Rodríguez',
          email: 'maria.lopez@hospital.com',
          password: 'password123',
          id_especialidad: 'invalid',
          numero_colegiatura: '12345'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Especialidad inválida' });
    });

    it('should handle missing numero_colegiatura', async () => {
      mockedRegistrarMedico.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ success: false, message: 'Número de colegiatura requerido' });
      });

      const response = await request(app)
        .post('/usuarios/medico')
        .send({
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Rodríguez',
          email: 'maria.lopez@hospital.com',
          password: 'password123',
          id_especialidad: 1,
          numero_colegiatura: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'Número de colegiatura requerido' });
    });

    it('should handle existing numero_colegiatura', async () => {
      mockedRegistrarMedico.mockImplementation(async (req: any, res: any) => {
        res.status(409).json({ success: false, message: 'Número de colegiatura ya registrado' });
      });

      const response = await request(app)
        .post('/usuarios/medico')
        .send({
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Rodríguez',
          email: 'maria.lopez@hospital.com',
          password: 'password123',
          id_especialidad: 1,
          numero_colegiatura: '12345'
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ success: false, message: 'Número de colegiatura ya registrado' });
    });
  });

  describe('POST /usuarios/medico - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedRegistrarMedico.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      });

      const response = await request(app)
        .post('/usuarios/medico')
        .send({
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Rodríguez',
          email: 'maria.lopez@hospital.com',
          password: 'password123',
          id_especialidad: 1,
          numero_colegiatura: '12345'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error interno del servidor' });
    });

    it('should handle database connection error', async () => {
      mockedRegistrarMedico.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ success: false, message: 'Error de conexión a la base de datos' });
      });

      const response = await request(app)
        .post('/usuarios/medico')
        .send({
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Rodríguez',
          email: 'maria.lopez@hospital.com',
          password: 'password123',
          id_especialidad: 1,
          numero_colegiatura: '12345'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Error de conexión a la base de datos' });
    });
  });
});