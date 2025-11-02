import bcrypt from 'bcrypt';

// Mock de las dependencias antes de importar el servicio
jest.mock('bcrypt');
jest.mock('../../../model/usuario.model', () => ({
  Usuario: {
    findOne: jest.fn(),
  },
}));

// Importar después de los mocks
import { changePasswordByEmail } from '../../../service/passwordChange.service';
import { Usuario } from '../../../model/usuario.model';

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockUsuario = Usuario as jest.Mocked<typeof Usuario>;

describe('PasswordChange Service - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changePasswordByEmail - Casos Normales', () => {
    it('debería cambiar la contraseña exitosamente cuando el usuario existe', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'newPassword123';
      const hashedPassword = '$2b$10$newhashedpassword';
      const userId = 1;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: '$2b$10$oldpassword',
        rol: 'PACIENTE' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      const result = await changePasswordByEmail(email, newPassword);

      // Assert
      expect(result).toEqual({
        mensaje: 'Contraseña actualizada exitosamente',
      });

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockUsuarioData.update).toHaveBeenCalledWith({
        password: hashedPassword,
        fecha_actualizacion: expect.any(Date),
      });
    });

    it('debería cambiar la contraseña exitosamente para un médico', async () => {
      // Arrange
      const email = 'medico@test.com';
      const newPassword = 'medicoPassword123';
      const hashedPassword = '$2b$10$medicohashedpassword';
      const userId = 2;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Dr. Médico',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: '$2b$10$oldmedicopassword',
        rol: 'MEDICO' as const,
        telefono: 987654321,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      const result = await changePasswordByEmail(email, newPassword);

      // Assert
      expect(result).toEqual({
        mensaje: 'Contraseña actualizada exitosamente',
      });

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockUsuarioData.update).toHaveBeenCalledWith({
        password: hashedPassword,
        fecha_actualizacion: expect.any(Date),
      });
    });

    it('debería actualizar la fecha_actualizacion correctamente', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const beforeUpdate = new Date();

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
        fecha_registro: new Date('2020-01-01'),
        fecha_actualizacion: beforeUpdate,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      await changePasswordByEmail(email, newPassword);

      // Assert
      const updateCall = mockUsuarioData.update.mock.calls[0][0];
      expect(updateCall.fecha_actualizacion).toBeInstanceOf(Date);
      expect(updateCall.fecha_actualizacion.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });
  });

  describe('changePasswordByEmail - Casos Límite', () => {
    it('debería manejar email con formato límite (muy largo)', async () => {
      // Arrange
      const email = 'a'.repeat(250) + '@test.com';
      const newPassword = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      await changePasswordByEmail(email, newPassword);

      // Assert
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('debería manejar contraseña muy corta (mínimo permitido)', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = '123456'; // Mínimo 6 caracteres
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      await changePasswordByEmail(email, newPassword);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });

    it('debería manejar contraseña muy larga', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'a'.repeat(500);
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      await changePasswordByEmail(email, newPassword);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
    });

    it('debería manejar email con caracteres especiales', async () => {
      // Arrange
      const email = 'usuario+test@test-domain.co.uk';
      const newPassword = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      await changePasswordByEmail(email, newPassword);

      // Assert
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('debería manejar contraseña con caracteres especiales', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'P@ssw0rd!#$%&*()';
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act
      await changePasswordByEmail(email, newPassword);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
    });
  });

  describe('changePasswordByEmail - Casos de Excepción', () => {
    it('debería lanzar error cuando el usuario no existe', async () => {
      // Arrange
      const email = 'noexiste@test.com';
      const newPassword = 'password123';

      mockUsuario.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(changePasswordByEmail(email, newPassword)).rejects.toThrow(
        'Usuario no encontrado con ese email'
      );

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el email está vacío', async () => {
      // Arrange
      const email = '';
      const newPassword = 'password123';

      mockUsuario.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(changePasswordByEmail(email, newPassword)).rejects.toThrow(
        'Usuario no encontrado con ese email'
      );

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email: '' } });
    });

    it('debería manejar error de bcrypt al hashear contraseña', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'password123';

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
      };

      const bcryptError = new Error('Error interno de bcrypt');

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockRejectedValue(bcryptError);

      // Act & Assert
      await expect(changePasswordByEmail(email, newPassword)).rejects.toThrow(
        'Error al actualizar contraseña: Error interno de bcrypt'
      );

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
    });

    it('debería manejar error de base de datos al buscar usuario', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'password123';
      const dbError = new Error('Error de conexión a la base de datos');

      mockUsuario.findOne = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(changePasswordByEmail(email, newPassword)).rejects.toThrow(
        'Error al actualizar contraseña: Error de conexión a la base de datos'
      );

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al actualizar usuario', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUsuarioData = {
        id_usuario: 1,
        email: email,
        password: 'oldpassword',
        rol: 'PACIENTE' as const,
        update: jest.fn().mockRejectedValue(new Error('Error al actualizar en la base de datos')),
      };

      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData as any);
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      // Act & Assert
      await expect(changePasswordByEmail(email, newPassword)).rejects.toThrow(
        'Error al actualizar contraseña: Error al actualizar en la base de datos'
      );

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockUsuarioData.update).toHaveBeenCalled();
    });

    it('debería manejar timeout de base de datos', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'password123';
      const timeoutError = new Error('Timeout de conexión a la base de datos');

      mockUsuario.findOne = jest.fn().mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(changePasswordByEmail(email, newPassword)).rejects.toThrow(
        'Error al actualizar contraseña: Timeout de conexión a la base de datos'
      );

      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('debería manejar error genérico del servicio', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const newPassword = 'password123';
      const genericError = new Error('Error inesperado');

      mockUsuario.findOne = jest.fn().mockRejectedValue(genericError);

      // Act & Assert
      await expect(changePasswordByEmail(email, newPassword)).rejects.toThrow(
        'Error al actualizar contraseña: Error inesperado'
      );
    });
  });
});

