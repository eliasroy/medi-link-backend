import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock de las dependencias antes de importar el servicio
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../model/usuario.model', () => ({
  Usuario: {
    findOne: jest.fn(),
  },
}));
jest.mock('../../../model/medico.model', () => ({
  Medico: {
    findOne: jest.fn(),
  },
}));
jest.mock('../../../model/paciente.model', () => ({
  Paciente: {
    findOne: jest.fn(),
  },
}));
jest.mock('../../../utils/mapper', () => ({
  usuarioToDTO: jest.fn(),
}));

// Importar después de los mocks
import { login } from '../../../service/auth.service';
import { Usuario } from '../../../model/usuario.model';
import { Medico } from '../../../model/medico.model';
import { Paciente } from '../../../model/paciente.model';
import { usuarioToDTO } from '../../../utils/mapper';

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockUsuario = Usuario as jest.Mocked<typeof Usuario>;
const mockMedico = Medico as jest.Mocked<typeof Medico>;
const mockPaciente = Paciente as jest.Mocked<typeof Paciente>;
const mockUsuarioToDTO = usuarioToDTO as jest.MockedFunction<typeof usuarioToDTO>;

describe('Auth Service - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('Casos Normales', () => {
    it('debería realizar login exitoso para un médico', async () => {
      // Arrange - Datos de prueba
      const email = 'medico@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;
      const medicoId = 100;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Dr. Juan',
        paterno: 'Pérez',
        materno: 'García',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockMedicoData = {
        id_medico: medicoId,
        id_usuario: userId,
        id_especialidad: 1,
        nro_colegiatura: '12345',
        anios_experiencia: 5,
        calificacion_promedio: 4.5,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockToken = 'mock-jwt-token';
      const mockUsuarioDTO = {
        id: medicoId,
        nombre: 'Dr. Juan',
        email: email,
        rol: 'MEDICO' as const,
      };

      // Mock de las respuestas de la base de datos
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockMedico.findOne = jest.fn().mockResolvedValue(mockMedicoData);
      mockPaciente.findOne = jest.fn().mockResolvedValue(null);
      
      // Mock de bcrypt
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      
      // Mock de jwt
      mockJwt.sign = jest.fn().mockReturnValue(mockToken);
      
      // Mock del mapper
      mockUsuarioToDTO.mockReturnValue(mockUsuarioDTO);

      // Act - Ejecutar la función
      const result = await login(email, password);

      // Assert - Verificar resultados
      expect(result).toEqual({
        mensaje: 'Login exitoso',
        token: mockToken,
        idUser: medicoId,
        usuario: mockUsuarioDTO,
      });

      // Verificar que se llamaron las funciones correctas
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockMedico.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockPaciente.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: medicoId, rol: 'MEDICO' },
        'test-secret-key',
        { expiresIn: '11h' }
      );
      expect(mockUsuarioToDTO).toHaveBeenCalledWith(mockUsuarioData, medicoId);
    });

    it('debería realizar login exitoso para un paciente', async () => {
      // Arrange - Datos de prueba
      const email = 'paciente@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 2;
      const pacienteId = 200;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'María',
        paterno: 'López',
        materno: 'Martínez',
        email: email,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        telefono: 987654321,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockPacienteData = {
        id_paciente: pacienteId,
        id_usuario: userId,
        fecha_nacimiento: new Date('1990-01-01'),
        sexo: 'F' as const,
        direccion: 'Calle Principal 123',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockToken = 'mock-jwt-token';
      const mockUsuarioDTO = {
        id: pacienteId,
        nombre: 'María',
        email: email,
        rol: 'PACIENTE' as const,
      };

      // Mock de las respuestas de la base de datos
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockMedico.findOne = jest.fn().mockResolvedValue(null);
      mockPaciente.findOne = jest.fn().mockResolvedValue(mockPacienteData);
      
      // Mock de bcrypt
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      
      // Mock de jwt
      mockJwt.sign = jest.fn().mockReturnValue(mockToken);
      
      // Mock del mapper
      mockUsuarioToDTO.mockReturnValue(mockUsuarioDTO);

      // Act - Ejecutar la función
      const result = await login(email, password);

      // Assert - Verificar resultados
      expect(result).toEqual({
        mensaje: 'Login exitoso',
        token: mockToken,
        idUser: pacienteId,
        usuario: mockUsuarioDTO,
      });

      // Verificar que se llamaron las funciones correctas
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockMedico.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockPaciente.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: pacienteId, rol: 'PACIENTE' },
        'test-secret-key',
        { expiresIn: '11h' }
      );
      expect(mockUsuarioToDTO).toHaveBeenCalledWith(mockUsuarioData, pacienteId);
    });
  });

  describe('Casos Límite', () => {
    it('debería lanzar error cuando el email no existe', async () => {
      // Arrange
      const email = 'noexiste@test.com';
      const password = 'password123';

      // Mock de usuario no encontrado
      mockUsuario.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Usuario no encontrado');
      
      // Verificar que se buscó el usuario
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      
      // Verificar que no se ejecutaron otras operaciones
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockMedico.findOne).not.toHaveBeenCalled();
      expect(mockPaciente.findOne).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la contraseña es incorrecta', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'passwordIncorrecta';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de usuario encontrado pero contraseña incorrecta
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockBcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Contraseña incorrecta');
      
      // Verificar que se buscó el usuario y se comparó la contraseña
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      
      // Verificar que no se ejecutaron otras operaciones
      expect(mockMedico.findOne).not.toHaveBeenCalled();
      expect(mockPaciente.findOne).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el usuario no tiene perfil de médico ni paciente', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Sin',
        materno: 'Perfil',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de usuario encontrado con contraseña correcta pero sin perfil
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockMedico.findOne = jest.fn().mockResolvedValue(null);
      mockPaciente.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('El usuario no tiene perfil de MÉDICO o PACIENTE');
      
      // Verificar que se ejecutaron todas las búsquedas
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockMedico.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockPaciente.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      
      // Verificar que no se generó token
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('debería manejar email con formato límite (muy largo)', async () => {
      // Arrange
      const email = 'a'.repeat(300) + '@test.com'; // Email muy largo
      const password = 'password123';

      // Mock de usuario no encontrado
      mockUsuario.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Usuario no encontrado');
      
      // Verificar que se buscó el usuario con el email largo
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('debería manejar contraseña vacía', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = '';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de usuario encontrado pero contraseña vacía incorrecta
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockBcrypt.compare = jest.fn().mockResolvedValue(false);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Contraseña incorrecta');
      
      // Verificar que se comparó la contraseña vacía
      expect(mockBcrypt.compare).toHaveBeenCalledWith('', hashedPassword);
    });

    it('debería manejar email vacío', async () => {
      // Arrange
      const email = '';
      const password = 'password123';

      // Mock de usuario no encontrado
      mockUsuario.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Usuario no encontrado');
      
      // Verificar que se buscó con email vacío
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email: '' } });
    });

    it('debería manejar caracteres especiales en email', async () => {
      // Arrange
      const email = 'usuario+test@test-domain.co.uk';
      const password = 'password123';

      // Mock de usuario no encontrado
      mockUsuario.findOne = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Usuario no encontrado');
      
      // Verificar que se buscó con email con caracteres especiales
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('Casos de Excepción', () => {
    it('debería lanzar error cuando JWT_SECRET no está definido', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;
      const medicoId = 100;

      // Eliminar JWT_SECRET del entorno
      delete process.env.JWT_SECRET;

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockMedicoData = {
        id_medico: medicoId,
        id_usuario: userId,
        id_especialidad: 1,
        nro_colegiatura: '12345',
        anios_experiencia: 5,
        calificacion_promedio: 4.5,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de las respuestas de la base de datos
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockMedico.findOne = jest.fn().mockResolvedValue(mockMedicoData);
      mockPaciente.findOne = jest.fn().mockResolvedValue(null);
      
      // Mock de bcrypt
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow(' JWT_SECRET no está definido en .env');
      
      // Verificar que se ejecutaron las validaciones hasta JWT_SECRET
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      
      // Verificar que no se ejecutaron las búsquedas de médico y paciente porque JWT_SECRET falla antes
      expect(mockMedico.findOne).not.toHaveBeenCalled();
      expect(mockPaciente.findOne).not.toHaveBeenCalled();
      
      // Verificar que no se generó token
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al buscar usuario', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const dbError = new Error('Error de conexión a la base de datos');

      // Mock de error en la base de datos
      mockUsuario.findOne = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Error de conexión a la base de datos');
      
      // Verificar que se intentó buscar el usuario
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      
      // Verificar que no se ejecutaron otras operaciones
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockMedico.findOne).not.toHaveBeenCalled();
      expect(mockPaciente.findOne).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al buscar médico', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;
      const dbError = new Error('Error al consultar tabla médico');

      // Configurar JWT_SECRET para este test
      process.env.JWT_SECRET = 'test-secret-key';

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de las respuestas
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockMedico.findOne = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Error al consultar tabla médico');
      
      // Verificar que se ejecutaron las operaciones hasta la búsqueda del médico
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockMedico.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      
      // Verificar que no se buscó paciente ni se generó token
      expect(mockPaciente.findOne).not.toHaveBeenCalled();
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('debería manejar error de base de datos al buscar paciente', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;
      const dbError = new Error('Error al consultar tabla paciente');

      // Configurar JWT_SECRET para este test
      process.env.JWT_SECRET = 'test-secret-key';

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: hashedPassword,
        rol: 'PACIENTE' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de las respuestas
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockMedico.findOne = jest.fn().mockResolvedValue(null);
      mockPaciente.findOne = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Error al consultar tabla paciente');
      
      // Verificar que se ejecutaron todas las búsquedas hasta paciente
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockMedico.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockPaciente.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      
      // Verificar que no se generó token
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('debería manejar error de bcrypt al comparar contraseñas', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;
      const bcryptError = new Error('Error interno de bcrypt');

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de las respuestas
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockBcrypt.compare = jest.fn().mockRejectedValue(bcryptError);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Error interno de bcrypt');
      
      // Verificar que se buscó el usuario y se intentó comparar la contraseña
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      
      // Verificar que no se ejecutaron otras operaciones
      expect(mockMedico.findOne).not.toHaveBeenCalled();
      expect(mockPaciente.findOne).not.toHaveBeenCalled();
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('debería manejar error de JWT al generar token', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      const userId = 1;
      const medicoId = 100;
      const jwtError = new Error('Error al generar JWT');

      process.env.JWT_SECRET = 'test-secret-key';

      const mockUsuarioData = {
        id_usuario: userId,
        nombre: 'Usuario',
        paterno: 'Test',
        materno: 'Test',
        email: email,
        password: hashedPassword,
        rol: 'MEDICO' as const,
        telefono: 123456789,
        estado: 'ACTIVO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockMedicoData = {
        id_medico: medicoId,
        id_usuario: userId,
        id_especialidad: 1,
        nro_colegiatura: '12345',
        anios_experiencia: 5,
        calificacion_promedio: 4.5,
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de las respuestas
      mockUsuario.findOne = jest.fn().mockResolvedValue(mockUsuarioData);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockMedico.findOne = jest.fn().mockResolvedValue(mockMedicoData);
      mockPaciente.findOne = jest.fn().mockResolvedValue(null);
      mockJwt.sign = jest.fn().mockImplementation(() => {
        throw jwtError;
      });

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Error al generar JWT');
      
      // Verificar que se ejecutaron todas las operaciones hasta JWT
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockMedico.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockPaciente.findOne).toHaveBeenCalledWith({ where: { id_usuario: userId } });
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: medicoId, rol: 'MEDICO' },
        'test-secret-key',
        { expiresIn: '11h' }
      );
    });

    it('debería manejar timeout de base de datos', async () => {
      // Arrange
      const email = 'usuario@test.com';
      const password = 'password123';
      const timeoutError = new Error('Timeout de conexión a la base de datos');

      // Mock de timeout en la base de datos
      mockUsuario.findOne = jest.fn().mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow('Timeout de conexión a la base de datos');
      
      // Verificar que se intentó buscar el usuario
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });
});
