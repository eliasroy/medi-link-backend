import { Request, Response } from 'express';
import * as passwordChangeService from '../../../service/passwordChange.service';
import { changePasswordByEmail as changePasswordByEmailController } from '../../../controller/passwordChangeController';

jest.mock('../../../service/passwordChange.service');

const mockedPasswordChangeService = passwordChangeService as jest.Mocked<typeof passwordChangeService>;

function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

describe('PasswordChange Controller - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changePasswordByEmail - Casos Normales', () => {
    it('debe responder 200 con el resultado cuando el cambio de contraseña es exitoso', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
          newPassword: 'newPassword123',
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        mensaje: 'Contraseña actualizada exitosamente',
      };

      mockedPasswordChangeService.changePasswordByEmail.mockResolvedValueOnce(fakeResult);

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).toHaveBeenCalledWith(
        'usuario@test.com',
        'newPassword123'
      );
      expect(res.status).not.toHaveBeenCalled(); // Status 200 por defecto
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('debe responder 200 cuando el cambio es exitoso para un médico', async () => {
      // Arrange
      const req = {
        body: {
          email: 'medico@test.com',
          newPassword: 'medicoPassword123',
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        mensaje: 'Contraseña actualizada exitosamente',
      };

      mockedPasswordChangeService.changePasswordByEmail.mockResolvedValueOnce(fakeResult);

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).toHaveBeenCalledWith(
        'medico@test.com',
        'medicoPassword123'
      );
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });
  });

  describe('changePasswordByEmail - Casos Límite', () => {
    it('debe responder 400 cuando falta email', async () => {
      // Arrange
      const req = {
        body: {
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email y nueva contraseña son requeridos',
      });
    });

    it('debe responder 400 cuando falta newPassword', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
        },
      } as Request;

      const res = createMockResponse();

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email y nueva contraseña son requeridos',
      });
    });

    it('debe responder 400 cuando email y newPassword están vacíos', async () => {
      // Arrange
      const req = {
        body: {
          email: '',
          newPassword: '',
        },
      } as Request;

      const res = createMockResponse();

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email y nueva contraseña son requeridos',
      });
    });

    it('debe responder 400 cuando el email tiene formato inválido (sin @)', async () => {
      // Arrange
      const req = {
        body: {
          email: 'emailinvalido',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formato de email inválido',
      });
    });

    it('debe responder 400 cuando el email tiene formato inválido (sin dominio)', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formato de email inválido',
      });
    });

    it('debe responder 400 cuando el email tiene formato inválido (sin punto en dominio)', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formato de email inválido',
      });
    });

    it('debe responder 400 cuando la contraseña tiene menos de 6 caracteres', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
          newPassword: '12345', // Solo 5 caracteres
        },
      } as Request;

      const res = createMockResponse();

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'La contraseña debe tener al menos 6 caracteres',
      });
    });

    it('debe responder 200 cuando la contraseña tiene exactamente 6 caracteres', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
          newPassword: '123456', // Exactamente 6 caracteres
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        mensaje: 'Contraseña actualizada exitosamente',
      };

      mockedPasswordChangeService.changePasswordByEmail.mockResolvedValueOnce(fakeResult);

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).toHaveBeenCalledWith(
        'usuario@test.com',
        '123456'
      );
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('debe aceptar email con formato válido complejo', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario+test@test-domain.co.uk',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      const fakeResult = {
        mensaje: 'Contraseña actualizada exitosamente',
      };

      mockedPasswordChangeService.changePasswordByEmail.mockResolvedValueOnce(fakeResult);

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(mockedPasswordChangeService.changePasswordByEmail).toHaveBeenCalledWith(
        'usuario+test@test-domain.co.uk',
        'password123'
      );
    });
  });

  describe('changePasswordByEmail - Casos de Excepción', () => {
    it('debe responder 400 cuando el usuario no existe', async () => {
      // Arrange
      const req = {
        body: {
          email: 'noexiste@test.com',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedPasswordChangeService.changePasswordByEmail.mockRejectedValueOnce(
        new Error('Usuario no encontrado con ese email')
      );

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Usuario no encontrado con ese email',
      });
    });

    it('debe responder 400 ante error de conexión a base de datos', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedPasswordChangeService.changePasswordByEmail.mockRejectedValueOnce(
        new Error('Error al actualizar contraseña: Error de conexión a la base de datos')
      );

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al actualizar contraseña: Error de conexión a la base de datos',
      });
    });

    it('debe responder 400 ante error de bcrypt', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedPasswordChangeService.changePasswordByEmail.mockRejectedValueOnce(
        new Error('Error al actualizar contraseña: Error interno de bcrypt')
      );

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al actualizar contraseña: Error interno de bcrypt',
      });
    });

    it('debe responder 400 ante error inesperado del servicio', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedPasswordChangeService.changePasswordByEmail.mockRejectedValueOnce(
        new Error('Error al actualizar contraseña: Error inesperado')
      );

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al actualizar contraseña: Error inesperado',
      });
    });

    it('debe responder 400 ante timeout de base de datos', async () => {
      // Arrange
      const req = {
        body: {
          email: 'usuario@test.com',
          newPassword: 'password123',
        },
      } as Request;

      const res = createMockResponse();

      mockedPasswordChangeService.changePasswordByEmail.mockRejectedValueOnce(
        new Error('Error al actualizar contraseña: Timeout de conexión a la base de datos')
      );

      // Act
      await changePasswordByEmailController(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error al actualizar contraseña: Timeout de conexión a la base de datos',
      });
    });
  });
});

