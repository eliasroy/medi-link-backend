import bcrypt from 'bcrypt';

// Mock de las dependencias antes de importar el servicio
jest.mock('bcrypt');
jest.mock('../../../model/usuario.model', () => ({
  Usuario: {
    create: jest.fn(),
  },
}));
jest.mock('../../../model/paciente.model', () => ({
  Paciente: {
    create: jest.fn(),
  },
}));
jest.mock('../../../model/medico.model', () => ({
  Medico: {
    create: jest.fn(),
  },
}));

// Importar después de los mocks
import { registrarPaciente, registrarMedico } from '../../../service/usuario.service';
import { Usuario } from '../../../model/usuario.model';
import { Paciente } from '../../../model/paciente.model';
import { Medico } from '../../../model/medico.model';

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockUsuario = Usuario as jest.Mocked<typeof Usuario>;
const mockPaciente = Paciente as jest.Mocked<typeof Paciente>;
const mockMedico = Medico as jest.Mocked<typeof Medico>;

describe('Usuario Service - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registrarPaciente - Casos Normales', () => {
    it('debería registrar un paciente exitosamente con todos los datos', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Juan',
        paterno: 'Pérez',
        materno: 'García',
        email: 'juan.perez@test.com',
        telefono: 123456789,
        password: 'password123',
        fecha_nacimiento: new Date('1990-01-15'),
        sexo: 'M' as const,
        direccion: 'Calle Principal 123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 1,
        nombre: pacienteData.nombre,
        paterno: pacienteData.paterno,
        materno: pacienteData.materno,
        email: pacienteData.email,
        telefono: pacienteData.telefono,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockPacienteCreated = {
        id_paciente: 100,
        id_usuario: 1,
        fecha_nacimiento: pacienteData.fecha_nacimiento,
        sexo: pacienteData.sexo,
        direccion: pacienteData.direccion,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockPaciente.create = jest.fn().mockResolvedValue(mockPacienteCreated as any);

      // Act
      const result = await registrarPaciente(pacienteData);

      // Assert
      expect(result).toEqual({
        usuario: mockUsuarioCreated,
        paciente: mockPacienteCreated,
      });

      expect(mockBcrypt.hash).toHaveBeenCalledWith(pacienteData.password, 10);
      expect(mockUsuario.create).toHaveBeenCalledWith({
        nombre: pacienteData.nombre,
        paterno: pacienteData.paterno,
        materno: pacienteData.materno,
        email: pacienteData.email,
        telefono: pacienteData.telefono,
        password: hashedPassword,
        rol: 'PACIENTE',
      });
      expect(mockPaciente.create).toHaveBeenCalledWith({
        id_usuario: mockUsuarioCreated.id_usuario,
        fecha_nacimiento: pacienteData.fecha_nacimiento,
        sexo: pacienteData.sexo,
        direccion: pacienteData.direccion,
      });
    });

    it('debería registrar un paciente exitosamente solo con datos obligatorios', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'María',
        paterno: 'López',
        materno: 'Martínez',
        email: 'maria.lopez@test.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 2,
        ...pacienteData,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockPacienteCreated = {
        id_paciente: 101,
        id_usuario: 2,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockPaciente.create = jest.fn().mockResolvedValue(mockPacienteCreated as any);

      // Act
      const result = await registrarPaciente(pacienteData);

      // Assert
      expect(result).toEqual({
        usuario: mockUsuarioCreated,
        paciente: mockPacienteCreated,
      });

      expect(mockUsuario.create).toHaveBeenCalledWith({
        nombre: pacienteData.nombre,
        paterno: pacienteData.paterno,
        materno: pacienteData.materno,
        email: pacienteData.email,
        telefono: undefined,
        password: hashedPassword,
        rol: 'PACIENTE',
      });
    });
  });

  describe('registrarMedico - Casos Normales', () => {
    it('debería registrar un médico exitosamente con todos los datos', async () => {
      // Arrange
      const medicoData = {
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
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 3,
        nombre: medicoData.nombre,
        paterno: medicoData.paterno,
        materno: medicoData.materno,
        email: medicoData.email,
        telefono: medicoData.telefono,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockMedicoCreated = {
        id_medico: 200,
        id_usuario: 3,
        id_especialidad: medicoData.id_especialidad,
        calificacion_promedio: medicoData.calificacion,
        nro_colegiatura: medicoData.nro_colegiatura,
        anios_experiencia: medicoData.anios_experiencia,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockMedico.create = jest.fn().mockResolvedValue(mockMedicoCreated as any);

      // Act
      const result = await registrarMedico(medicoData);

      // Assert
      expect(result).toEqual({
        usuario: mockUsuarioCreated,
        medico: mockMedicoCreated,
      });

      expect(mockBcrypt.hash).toHaveBeenCalledWith(medicoData.password, 10);
      expect(mockUsuario.create).toHaveBeenCalledWith({
        nombre: medicoData.nombre,
        paterno: medicoData.paterno,
        materno: medicoData.materno,
        email: medicoData.email,
        telefono: medicoData.telefono,
        password: hashedPassword,
        rol: 'MEDICO',
      });
      expect(mockMedico.create).toHaveBeenCalledWith({
        id_usuario: mockUsuarioCreated.id_usuario,
        id_especialidad: medicoData.id_especialidad,
        calificacion_promedio: medicoData.calificacion,
        nro_colegiatura: medicoData.nro_colegiatura,
        anios_experiencia: medicoData.anios_experiencia,
      });
    });

    it('debería registrar un médico exitosamente sin años de experiencia', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Ana',
        paterno: 'González',
        materno: 'Fernández',
        id_especialidad: 2,
        calificacion: 4.8,
        email: 'ana.gonzalez@test.com',
        password: 'password123',
        nro_colegiatura: '67890',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 4,
        ...medicoData,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockMedicoCreated = {
        id_medico: 201,
        id_usuario: 4,
        id_especialidad: medicoData.id_especialidad,
        calificacion_promedio: medicoData.calificacion,
        nro_colegiatura: medicoData.nro_colegiatura,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockMedico.create = jest.fn().mockResolvedValue(mockMedicoCreated as any);

      // Act
      const result = await registrarMedico(medicoData);

      // Assert
      expect(result.medico.anios_experiencia).toBeUndefined();
      expect(mockMedico.create).toHaveBeenCalledWith({
        id_usuario: mockUsuarioCreated.id_usuario,
        id_especialidad: medicoData.id_especialidad,
        calificacion_promedio: medicoData.calificacion,
        nro_colegiatura: medicoData.nro_colegiatura,
        anios_experiencia: undefined,
      });
    });
  });

  describe('registrarPaciente - Casos Límite', () => {
    it('debería manejar email con formato límite (muy largo)', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'Long',
        email: 'a'.repeat(250) + '@test.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 5,
        ...pacienteData,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockPaciente.create = jest.fn().mockResolvedValue({ id_paciente: 102, id_usuario: 5 } as any);

      // Act
      await registrarPaciente(pacienteData);

      // Assert
      expect(mockUsuario.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: pacienteData.email,
        })
      );
    });

    it('debería manejar contraseña muy corta', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'Short',
        email: 'short@test.com',
        password: '123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 6,
        ...pacienteData,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockPaciente.create = jest.fn().mockResolvedValue({ id_paciente: 103, id_usuario: 6 } as any);

      // Act
      await registrarPaciente(pacienteData);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith('123', 10);
    });

    it('debería manejar contraseña muy larga', async () => {
      // Arrange
      const longPassword = 'a'.repeat(500);
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'Long',
        email: 'long@test.com',
        password: longPassword,
      };

      const hashedPassword = '$2b$10$hashedpassword';
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue({
        id_usuario: 7,
        ...pacienteData,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any);
      mockPaciente.create = jest.fn().mockResolvedValue({ id_paciente: 104, id_usuario: 7 } as any);

      // Act
      await registrarPaciente(pacienteData);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith(longPassword, 10);
    });

    it('debería manejar nombres con caracteres especiales', async () => {
      // Arrange
      const pacienteData = {
        nombre: "María José",
        paterno: "O'Brien",
        materno: "García-López",
        email: 'special@test.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue({
        id_usuario: 8,
        ...pacienteData,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any);
      mockPaciente.create = jest.fn().mockResolvedValue({ id_paciente: 105, id_usuario: 8 } as any);

      // Act
      await registrarPaciente(pacienteData);

      // Assert
      expect(mockUsuario.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: pacienteData.nombre,
          paterno: pacienteData.paterno,
          materno: pacienteData.materno,
        })
      );
    });

    it('debería manejar sexo con valor X', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'X',
        email: 'x@test.com',
        password: 'password123',
        sexo: 'X' as const,
      };

      const hashedPassword = '$2b$10$hashedpassword';
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue({
        id_usuario: 9,
        ...pacienteData,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any);
      mockPaciente.create = jest.fn().mockResolvedValue({
        id_paciente: 106,
        id_usuario: 9,
        sexo: 'X',
      } as any);

      // Act
      const result = await registrarPaciente(pacienteData);

      // Assert
      expect(result.paciente.sexo).toBe('X');
    });
  });

  describe('registrarMedico - Casos Límite', () => {
    it('debería manejar número de colegiatura muy largo', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Long',
        id_especialidad: 1,
        calificacion: 5.0,
        email: 'long@test.com',
        password: 'password123',
        nro_colegiatura: 'A'.repeat(100),
      };

      const hashedPassword = '$2b$10$hashedpassword';
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue({
        id_usuario: 10,
        ...medicoData,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any);
      mockMedico.create = jest.fn().mockResolvedValue({
        id_medico: 202,
        id_usuario: 10,
        nro_colegiatura: medicoData.nro_colegiatura,
      } as any);

      // Act
      await registrarMedico(medicoData);

      // Assert
      expect(mockMedico.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nro_colegiatura: medicoData.nro_colegiatura,
        })
      );
    });

    it('debería manejar calificación límite (0.0)', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Zero',
        id_especialidad: 1,
        calificacion: 0.0,
        email: 'zero@test.com',
        password: 'password123',
        nro_colegiatura: '00000',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue({
        id_usuario: 11,
        ...medicoData,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any);
      mockMedico.create = jest.fn().mockResolvedValue({
        id_medico: 203,
        id_usuario: 11,
        calificacion_promedio: 0.0,
      } as any);

      // Act
      const result = await registrarMedico(medicoData);

      // Assert
      expect(result.medico.calificacion_promedio).toBe(0.0);
    });

    it('debería manejar calificación límite (5.0)', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Max',
        id_especialidad: 1,
        calificacion: 5.0,
        email: 'max@test.com',
        password: 'password123',
        nro_colegiatura: '99999',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue({
        id_usuario: 12,
        ...medicoData,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any);
      mockMedico.create = jest.fn().mockResolvedValue({
        id_medico: 204,
        id_usuario: 12,
        calificacion_promedio: 5.0,
      } as any);

      // Act
      const result = await registrarMedico(medicoData);

      // Assert
      expect(result.medico.calificacion_promedio).toBe(5.0);
    });

    it('debería manejar años de experiencia como 0', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'New',
        id_especialidad: 1,
        calificacion: 3.0,
        email: 'new@test.com',
        password: 'password123',
        nro_colegiatura: '11111',
        anios_experiencia: 0,
      };

      const hashedPassword = '$2b$10$hashedpassword';
      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue({
        id_usuario: 13,
        ...medicoData,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any);
      mockMedico.create = jest.fn().mockResolvedValue({
        id_medico: 205,
        id_usuario: 13,
        anios_experiencia: 0,
      } as any);

      // Act
      const result = await registrarMedico(medicoData);

      // Assert
      expect(result.medico.anios_experiencia).toBe(0);
    });
  });

  describe('registrarPaciente - Casos de Excepción', () => {
    it('debería manejar error de bcrypt al hashear contraseña', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'Error',
        email: 'error@test.com',
        password: 'password123',
      };

      const bcryptError = new Error('Error interno de bcrypt');
      mockBcrypt.hash = jest.fn().mockRejectedValue(bcryptError);

      // Act & Assert
      await expect(registrarPaciente(pacienteData)).rejects.toThrow('Error interno de bcrypt');

      expect(mockBcrypt.hash).toHaveBeenCalledWith(pacienteData.password, 10);
      expect(mockUsuario.create).not.toHaveBeenCalled();
      expect(mockPaciente.create).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al crear usuario', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'DB',
        email: 'db@test.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const dbError = new Error('Error de conexión a la base de datos');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(registrarPaciente(pacienteData)).rejects.toThrow('Error de conexión a la base de datos');

      expect(mockBcrypt.hash).toHaveBeenCalled();
      expect(mockUsuario.create).toHaveBeenCalled();
      expect(mockPaciente.create).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al crear paciente', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'Patient',
        email: 'patient@test.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 14,
        ...pacienteData,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const dbError = new Error('Error al crear registro de paciente');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockPaciente.create = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(registrarPaciente(pacienteData)).rejects.toThrow('Error al crear registro de paciente');

      expect(mockBcrypt.hash).toHaveBeenCalled();
      expect(mockUsuario.create).toHaveBeenCalled();
      expect(mockPaciente.create).toHaveBeenCalled();
    });

    it('debería manejar error de validación de email duplicado', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'Duplicate',
        email: 'duplicate@test.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const duplicateError = new Error('Email ya existe en la base de datos');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(registrarPaciente(pacienteData)).rejects.toThrow('Email ya existe en la base de datos');
    });

    it('debería manejar timeout de base de datos', async () => {
      // Arrange
      const pacienteData = {
        nombre: 'Test',
        paterno: 'User',
        materno: 'Timeout',
        email: 'timeout@test.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const timeoutError = new Error('Timeout de conexión a la base de datos');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(registrarPaciente(pacienteData)).rejects.toThrow('Timeout de conexión a la base de datos');
    });
  });

  describe('registrarMedico - Casos de Excepción', () => {
    it('debería manejar error de bcrypt al hashear contraseña', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Error',
        id_especialidad: 1,
        calificacion: 4.0,
        email: 'error@test.com',
        password: 'password123',
        nro_colegiatura: '12345',
      };

      const bcryptError = new Error('Error interno de bcrypt');
      mockBcrypt.hash = jest.fn().mockRejectedValue(bcryptError);

      // Act & Assert
      await expect(registrarMedico(medicoData)).rejects.toThrow('Error interno de bcrypt');

      expect(mockBcrypt.hash).toHaveBeenCalledWith(medicoData.password, 10);
      expect(mockUsuario.create).not.toHaveBeenCalled();
      expect(mockMedico.create).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al crear usuario', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'DB',
        id_especialidad: 1,
        calificacion: 4.0,
        email: 'db@test.com',
        password: 'password123',
        nro_colegiatura: '12345',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const dbError = new Error('Error de conexión a la base de datos');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(registrarMedico(medicoData)).rejects.toThrow('Error de conexión a la base de datos');

      expect(mockBcrypt.hash).toHaveBeenCalled();
      expect(mockUsuario.create).toHaveBeenCalled();
      expect(mockMedico.create).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al crear médico', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Medico',
        id_especialidad: 1,
        calificacion: 4.0,
        email: 'medico@test.com',
        password: 'password123',
        nro_colegiatura: '12345',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 15,
        ...medicoData,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const dbError = new Error('Error al crear registro de médico');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockMedico.create = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(registrarMedico(medicoData)).rejects.toThrow('Error al crear registro de médico');

      expect(mockBcrypt.hash).toHaveBeenCalled();
      expect(mockUsuario.create).toHaveBeenCalled();
      expect(mockMedico.create).toHaveBeenCalled();
    });

    it('debería manejar error de validación de email duplicado', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Duplicate',
        id_especialidad: 1,
        calificacion: 4.0,
        email: 'duplicate@test.com',
        password: 'password123',
        nro_colegiatura: '12345',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const duplicateError = new Error('Email ya existe en la base de datos');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(registrarMedico(medicoData)).rejects.toThrow('Email ya existe en la base de datos');
    });

    it('debería manejar error de validación de número de colegiatura duplicado', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Duplicate',
        id_especialidad: 1,
        calificacion: 4.0,
        email: 'new@test.com',
        password: 'password123',
        nro_colegiatura: '12345',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const mockUsuarioCreated = {
        id_usuario: 16,
        ...medicoData,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const duplicateError = new Error('Número de colegiatura ya existe');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockResolvedValue(mockUsuarioCreated as any);
      mockMedico.create = jest.fn().mockRejectedValue(duplicateError);

      // Act & Assert
      await expect(registrarMedico(medicoData)).rejects.toThrow('Número de colegiatura ya existe');
    });

    it('debería manejar timeout de base de datos', async () => {
      // Arrange
      const medicoData = {
        nombre: 'Dr. Test',
        paterno: 'User',
        materno: 'Timeout',
        id_especialidad: 1,
        calificacion: 4.0,
        email: 'timeout@test.com',
        password: 'password123',
        nro_colegiatura: '12345',
      };

      const hashedPassword = '$2b$10$hashedpassword';
      const timeoutError = new Error('Timeout de conexión a la base de datos');

      mockBcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUsuario.create = jest.fn().mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(registrarMedico(medicoData)).rejects.toThrow('Timeout de conexión a la base de datos');
    });
  });
});

