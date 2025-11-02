import { Op } from 'sequelize';

// Mock de las dependencias antes de importar el servicio
jest.mock('../../../model/medicos', () => ({
  VistaMedicos: {
    findAll: jest.fn(),
  },
}));

// Importar después de los mocks
import { listarMedicosFiltrados } from '../../../service/medico.service';
import { VistaMedicos } from '../../../model/medicos';

const mockVistaMedicos = VistaMedicos as jest.Mocked<typeof VistaMedicos>;

describe('Medico Service - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listarMedicosFiltrados - Casos Normales', () => {
    it('debería listar todos los médicos cuando no hay filtros', async () => {
      // Arrange
      const filtros = {};
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          paterno: 'Pérez',
          materno: 'García',
          nro_colegiatura: '12345',
          id_especialidad: 1,
          especialidad: 'Cardiología',
          anios_experiencia: 10,
          calificacion_promedio: 4.5,
        },
        {
          id_medico: 2,
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Martínez',
          nro_colegiatura: '67890',
          id_especialidad: 2,
          especialidad: 'Pediatría',
          anios_experiencia: 5,
          calificacion_promedio: 4.8,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería filtrar médicos por nombre', async () => {
      // Arrange
      const filtros = { nombre: 'Juan' };
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          paterno: 'Pérez',
          materno: 'García',
          nro_colegiatura: '12345',
          id_especialidad: 1,
          especialidad: 'Cardiología',
          anios_experiencia: 10,
          calificacion_promedio: 4.5,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          nombre: { [Op.like]: '%Juan%' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería filtrar médicos por múltiples filtros', async () => {
      // Arrange
      const filtros = {
        nombre: 'María',
        id_especialidad: 2,
        calificacion_promedio: 4.0,
        anios_experiencia: 3,
      };

      const mockMedicos = [
        {
          id_medico: 2,
          nombre: 'Dr. María',
          paterno: 'López',
          materno: 'Martínez',
          nro_colegiatura: '67890',
          id_especialidad: 2,
          especialidad: 'Pediatría',
          anios_experiencia: 5,
          calificacion_promedio: 4.8,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          nombre: { [Op.like]: '%María%' },
          id_especialidad: { [Op.eq]: '2' },
          calificacion_promedio: { [Op.gte]: 4.0 },
          anios_experiencia: { [Op.gte]: 3 },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería filtrar médicos por especialidad (texto)', async () => {
      // Arrange
      const filtros = { especialidad: 'Cardiología' };
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          especialidad: 'Cardiología',
          calificacion_promedio: 4.5,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          especialidad: { [Op.like]: '%Cardiología%' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería filtrar médicos por número de colegiatura', async () => {
      // Arrange
      const filtros = { nro_colegiatura: '12345' };
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          nro_colegiatura: '12345',
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          nro_colegiatura: { [Op.like]: '%12345%' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería filtrar médicos por apellido paterno', async () => {
      // Arrange
      const filtros = { paterno: 'Pérez' };
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          paterno: 'Pérez',
          materno: 'García',
          calificacion_promedio: 4.5,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          paterno: { [Op.like]: '%Pérez%' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería filtrar médicos por apellido materno', async () => {
      // Arrange
      const filtros = { materno: 'García' };
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          paterno: 'Pérez',
          materno: 'García',
          calificacion_promedio: 4.5,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          materno: { [Op.like]: '%García%' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería filtrar médicos por nombre, paterno y materno simultáneamente', async () => {
      // Arrange
      const filtros = {
        nombre: 'Juan',
        paterno: 'Pérez',
        materno: 'García',
      };
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          paterno: 'Pérez',
          materno: 'García',
          calificacion_promedio: 4.5,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual(mockMedicos);
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          nombre: { [Op.like]: '%Juan%' },
          paterno: { [Op.like]: '%Pérez%' },
          materno: { [Op.like]: '%García%' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería retornar lista vacía cuando no hay médicos que coincidan', async () => {
      // Arrange
      const filtros = { nombre: 'NoExiste' };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual([]);
      expect(mockVistaMedicos.findAll).toHaveBeenCalled();
    });
  });

  describe('listarMedicosFiltrados - Casos Límite', () => {
    it('debería ignorar filtros con valores vacíos', async () => {
      // Arrange
      const filtros = { nombre: '', especialidad: '' };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(result).toEqual([]);
      // Los filtros vacíos se ignoran porque son falsy en JavaScript
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería manejar nombres con caracteres especiales', async () => {
      // Arrange
      const filtros = { nombre: "María José" };
      const mockMedicos = [
        {
          id_medico: 1,
          nombre: 'Dr. María José',
          calificacion_promedio: 4.5,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          nombre: { [Op.like]: '%María José%' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería ignorar valores numéricos cero (0) para calificación', async () => {
      // Arrange
      const filtros = { calificacion_promedio: 0.0 };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      await listarMedicosFiltrados(filtros);

      // Assert
      // El valor 0 es falsy en JavaScript, por lo que se ignora el filtro
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería ignorar valores numéricos cero (0) para años de experiencia', async () => {
      // Arrange
      const filtros = { anios_experiencia: 0 };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      await listarMedicosFiltrados(filtros);

      // Assert
      // El valor 0 es falsy en JavaScript, por lo que se ignora el filtro
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería manejar id_especialidad como string', async () => {
      // Arrange
      const filtros = { id_especialidad: '1' };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      await listarMedicosFiltrados(filtros);

      // Assert
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          id_especialidad: { [Op.eq]: '1' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería manejar id_especialidad como número', async () => {
      // Arrange
      const filtros = { id_especialidad: 1 };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      await listarMedicosFiltrados(filtros);

      // Assert
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {
          id_especialidad: { [Op.eq]: '1' },
        },
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería ordenar por calificación descendente siempre', async () => {
      // Arrange
      const filtros = {};
      const mockMedicos = [
        {
          id_medico: 1,
          calificacion_promedio: 4.8,
        },
        {
          id_medico: 2,
          calificacion_promedio: 4.5,
        },
      ];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos as any);

      // Act
      await listarMedicosFiltrados(filtros);

      // Assert
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['calificacion_promedio', 'DESC']],
      });
    });
  });

  describe('listarMedicosFiltrados - Casos de Excepción', () => {
    it('debería manejar error de conexión a base de datos', async () => {
      // Arrange
      const filtros = {};
      const dbError = new Error('Error de conexión a la base de datos');

      mockVistaMedicos.findAll = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(listarMedicosFiltrados(filtros)).rejects.toThrow(
        'Error de conexión a la base de datos'
      );

      expect(mockVistaMedicos.findAll).toHaveBeenCalled();
    });

    it('debería manejar timeout de base de datos', async () => {
      // Arrange
      const filtros = { nombre: 'Juan' };
      const timeoutError = new Error('Timeout de conexión a la base de datos');

      mockVistaMedicos.findAll = jest.fn().mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(listarMedicosFiltrados(filtros)).rejects.toThrow(
        'Timeout de conexión a la base de datos'
      );
    });

    it('debería manejar error genérico del servicio', async () => {
      // Arrange
      const filtros = {};
      const genericError = new Error('Error inesperado');

      mockVistaMedicos.findAll = jest.fn().mockRejectedValue(genericError);

      // Act & Assert
      await expect(listarMedicosFiltrados(filtros)).rejects.toThrow('Error inesperado');
    });

    it('debería manejar error cuando VistaMedicos no está disponible', async () => {
      // Arrange
      const filtros = {};
      const error = new Error('VistaMedicos no encontrada');

      mockVistaMedicos.findAll = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(listarMedicosFiltrados(filtros)).rejects.toThrow('VistaMedicos no encontrada');
    });

    it('debería manejar filtros con valores null', async () => {
      // Arrange
      const filtros: any = { nombre: null, especialidad: null };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      const result = await listarMedicosFiltrados(filtros);

      // Assert
      // Los valores null no se agregan al where porque el if los evalúa como falsy
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['calificacion_promedio', 'DESC']],
      });
    });

    it('debería manejar filtros con valores undefined', async () => {
      // Arrange
      const filtros: any = { nombre: undefined, especialidad: undefined };
      const mockMedicos: any[] = [];

      mockVistaMedicos.findAll = jest.fn().mockResolvedValue(mockMedicos);

      // Act
      await listarMedicosFiltrados(filtros);

      // Assert
      // Los valores undefined no se agregan al where
      expect(mockVistaMedicos.findAll).toHaveBeenCalledWith({
        where: {},
        order: [['calificacion_promedio', 'DESC']],
      });
    });
  });
});

