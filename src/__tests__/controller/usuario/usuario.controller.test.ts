import { Request, Response } from 'express';
import * as usuarioService from '../../../service/usuario.service';
import { registrarPaciente as registrarPacienteController, registrarMedico as registrarMedicoController } from '../../../controller/usuario.controller';

jest.mock('../../../service/usuario.service');

const mockedUsuarioService = usuarioService as jest.Mocked<typeof usuarioService>;

function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

describe('Usuario Controller - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registrarPaciente - Casos Normales', () => {
    it('debe responder 201 con el resultado cuando el registro es exitoso', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'juan.perez@test.com',
          telefono: 123456789,
          password: 'password123',
          fecha_nacimiento: new Date('1990-01-15'),
          sexo: 'M',
          direccion: 'Calle Principal 123',
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        usuario: {
          id_usuario: 1,
          nombre: 'Juan',
          email: 'juan.perez@test.com',
          rol: 'PACIENTE',
        },
        paciente: {
          id_paciente: 100,
          id_usuario: 1,
        },
      };

      mockedUsuarioService.registrarPaciente.mockResolvedValueOnce(fakeResult as any);

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(mockedUsuarioService.registrarPaciente).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('debe responder 201 cuando el registro es exitoso solo con datos obligatorios', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'María',
          paterno: 'López',
          materno: 'Martínez',
          email: 'maria.lopez@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        usuario: {
          id_usuario: 2,
          nombre: 'María',
          email: 'maria.lopez@test.com',
          rol: 'PACIENTE',
        },
        paciente: {
          id_paciente: 101,
          id_usuario: 2,
        },
      };

      mockedUsuarioService.registrarPaciente.mockResolvedValueOnce(fakeResult as any);

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(mockedUsuarioService.registrarPaciente).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });
  });

  describe('registrarMedico - Casos Normales', () => {
    it('debe responder 201 con el resultado cuando el registro es exitoso', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Carlos',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'carlos.rodriguez@test.com',
          telefono: 987654321,
          password: 'password123',
          nro_colegiatura: '12345',
          anios_experiencia: 10,
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        usuario: {
          id_usuario: 3,
          nombre: 'Dr. Carlos',
          email: 'carlos.rodriguez@test.com',
          rol: 'MEDICO',
        },
        medico: {
          id_medico: 200,
          id_usuario: 3,
          nro_colegiatura: '12345',
        },
      };

      mockedUsuarioService.registrarMedico.mockResolvedValueOnce(fakeResult as any);

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(mockedUsuarioService.registrarMedico).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('debe responder 201 cuando el registro es exitoso sin años de experiencia', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Ana',
          paterno: 'González',
          materno: 'Fernández',
          id_especialidad: 2,
          calificacion: 4.8,
          email: 'ana.gonzalez@test.com',
          password: 'password123',
          nro_colegiatura: '67890',
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        usuario: {
          id_usuario: 4,
          nombre: 'Dr. Ana',
          email: 'ana.gonzalez@test.com',
          rol: 'MEDICO',
        },
        medico: {
          id_medico: 201,
          id_usuario: 4,
        },
      };

      mockedUsuarioService.registrarMedico.mockResolvedValueOnce(fakeResult as any);

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(mockedUsuarioService.registrarMedico).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });
  });

  describe('registrarPaciente - Casos Límite', () => {
    it('debe responder 400 cuando falta nombre', async () => {
      // Arrange
      const req = {
        body: {
          paterno: 'Pérez',
          materno: 'García',
          email: 'test@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('El nombre es requerido'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(mockedUsuarioService.registrarPaciente).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El nombre es requerido' });
    });

    it('debe responder 400 cuando falta email', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('El email es requerido'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El email es requerido' });
    });

    it('debe responder 400 cuando falta password', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'test@test.com',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('La contraseña es requerida'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'La contraseña es requerida' });
    });

    it('debe responder 400 cuando el email tiene formato inválido', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'email-invalido',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('Formato de email inválido'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Formato de email inválido' });
    });

    it('debe responder 400 cuando el email ya existe', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'existente@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('Email ya existe en la base de datos'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email ya existe en la base de datos' });
    });
  });

  describe('registrarMedico - Casos Límite', () => {
    it('debe responder 400 cuando falta nombre', async () => {
      // Arrange
      const req = {
        body: {
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'test@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('El nombre es requerido'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El nombre es requerido' });
    });

    it('debe responder 400 cuando falta id_especialidad', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          calificacion: 4.5,
          email: 'test@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('La especialidad es requerida'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'La especialidad es requerida' });
    });

    it('debe responder 400 cuando falta nro_colegiatura', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'test@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('El número de colegiatura es requerido'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El número de colegiatura es requerido' });
    });

    it('debe responder 400 cuando el email ya existe', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'existente@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('Email ya existe en la base de datos'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email ya existe en la base de datos' });
    });

    it('debe responder 400 cuando el número de colegiatura ya existe', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'nuevo@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('Número de colegiatura ya existe'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Número de colegiatura ya existe' });
    });
  });

  describe('registrarPaciente - Casos de Excepción', () => {
    it('debe responder 400 ante error de conexión a base de datos', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'test@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('Error de conexión a la base de datos'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error de conexión a la base de datos' });
    });

    it('debe responder 400 ante error inesperado del servicio', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'test@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('Error inesperado en el servicio'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error inesperado en el servicio' });
    });

    it('debe responder 400 ante error de bcrypt', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'test@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('Error interno de bcrypt'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno de bcrypt' });
    });

    it('debe responder 400 ante timeout de base de datos', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Juan',
          paterno: 'Pérez',
          materno: 'García',
          email: 'test@test.com',
          password: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarPaciente.mockRejectedValueOnce(new Error('Timeout de conexión a la base de datos'));

      // Act
      await registrarPacienteController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Timeout de conexión a la base de datos' });
    });
  });

  describe('registrarMedico - Casos de Excepción', () => {
    it('debe responder 400 ante error de conexión a base de datos', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'test@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('Error de conexión a la base de datos'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error de conexión a la base de datos' });
    });

    it('debe responder 400 ante error inesperado del servicio', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'test@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('Error inesperado en el servicio'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error inesperado en el servicio' });
    });

    it('debe responder 400 ante error de bcrypt', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'test@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('Error interno de bcrypt'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno de bcrypt' });
    });

    it('debe responder 400 ante timeout de base de datos', async () => {
      // Arrange
      const req = {
        body: {
          nombre: 'Dr. Test',
          paterno: 'Rodríguez',
          materno: 'Sánchez',
          id_especialidad: 1,
          calificacion: 4.5,
          email: 'test@test.com',
          password: 'password123',
          nro_colegiatura: '12345',
        },
      } as Request;

      const res = createMockResponse();

      mockedUsuarioService.registrarMedico.mockRejectedValueOnce(new Error('Timeout de conexión a la base de datos'));

      // Act
      await registrarMedicoController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Timeout de conexión a la base de datos' });
    });
  });
});

