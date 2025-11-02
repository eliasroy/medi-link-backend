// Mock de las dependencias antes de importar el servicio
jest.mock('../../../model/especialidad.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

// Importar después de los mocks
import EspecialidadService from '../../../service/especialidad.service';
import Especialidad from '../../../model/especialidad.model';

const mockEspecialidad = Especialidad as jest.Mocked<typeof Especialidad>;

describe('Especialidad Service - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerTodas - Casos Normales', () => {
    it('debería retornar todas las especialidades ordenadas por nombre ascendente', async () => {
      // Arrange
      const mockEspecialidades = [
        {
          id_especialidad: 1,
          nombre: 'Cardiología',
          descripcion: 'Especialidad en enfermedades del corazón',
        },
        {
          id_especialidad: 2,
          nombre: 'Dermatología',
          descripcion: 'Especialidad en enfermedades de la piel',
        },
        {
          id_especialidad: 3,
          nombre: 'Pediatría',
          descripcion: 'Especialidad en atención médica de niños',
        },
      ];

      mockEspecialidad.findAll = jest.fn().mockResolvedValue(mockEspecialidades as any);

      // Act
      const result = await EspecialidadService.obtenerTodas();

      // Assert
      expect(result).toEqual(mockEspecialidades);
      expect(mockEspecialidad.findAll).toHaveBeenCalledWith({
        order: [['nombre', 'ASC']],
      });
    });

    it('debería retornar lista vacía cuando no hay especialidades', async () => {
      // Arrange
      const mockEspecialidades: any[] = [];

      mockEspecialidad.findAll = jest.fn().mockResolvedValue(mockEspecialidades);

      // Act
      const result = await EspecialidadService.obtenerTodas();

      // Assert
      expect(result).toEqual([]);
      expect(mockEspecialidad.findAll).toHaveBeenCalledWith({
        order: [['nombre', 'ASC']],
      });
    });

    it('debería retornar especialidades con todas sus propiedades', async () => {
      // Arrange
      const mockEspecialidades = [
        {
          id_especialidad: 1,
          nombre: 'Neurología',
          descripcion: 'Especialidad en enfermedades del sistema nervioso',
          estado: 'ACTIVA',
          fecha_registro: new Date('2020-01-01'),
        },
      ];

      mockEspecialidad.findAll = jest.fn().mockResolvedValue(mockEspecialidades as any);

      // Act
      const result = await EspecialidadService.obtenerTodas();

      // Assert
      expect(result).toEqual(mockEspecialidades);
      expect(result[0]).toHaveProperty('id_especialidad');
      expect(result[0]).toHaveProperty('nombre');
      expect(result[0]).toHaveProperty('descripcion');
    });
  });

  describe('obtenerTodas - Casos Límite', () => {
    it('debería manejar una sola especialidad', async () => {
      // Arrange
      const mockEspecialidades = [
        {
          id_especialidad: 1,
          nombre: 'Cardiología',
          descripcion: 'Especialidad en enfermedades del corazón',
        },
      ];

      mockEspecialidad.findAll = jest.fn().mockResolvedValue(mockEspecialidades as any);

      // Act
      const result = await EspecialidadService.obtenerTodas();

      // Assert
      expect(result).toHaveLength(1);
      expect(mockEspecialidad.findAll).toHaveBeenCalledWith({
        order: [['nombre', 'ASC']],
      });
    });

    it('debería manejar muchas especialidades (límite superior)', async () => {
      // Arrange
      const mockEspecialidades = Array.from({ length: 100 }, (_, i) => ({
        id_especialidad: i + 1,
        nombre: `Especialidad ${i + 1}`,
        descripcion: `Descripción ${i + 1}`,
      }));

      mockEspecialidad.findAll = jest.fn().mockResolvedValue(mockEspecialidades as any);

      // Act
      const result = await EspecialidadService.obtenerTodas();

      // Assert
      expect(result).toHaveLength(100);
      expect(mockEspecialidad.findAll).toHaveBeenCalled();
    });

    it('debería ordenar correctamente por nombre ascendente', async () => {
      // Arrange
      const mockEspecialidades = [
        {
          id_especialidad: 3,
          nombre: 'Pediatría',
        },
        {
          id_especialidad: 1,
          nombre: 'Cardiología',
        },
        {
          id_especialidad: 2,
          nombre: 'Dermatología',
        },
      ];

      mockEspecialidad.findAll = jest.fn().mockResolvedValue(mockEspecialidades as any);

      // Act
      await EspecialidadService.obtenerTodas();

      // Assert
      // Verificamos que se ordena por nombre ASC
      expect(mockEspecialidad.findAll).toHaveBeenCalledWith({
        order: [['nombre', 'ASC']],
      });
    });

    it('debería manejar nombres de especialidades con caracteres especiales', async () => {
      // Arrange
      const mockEspecialidades = [
        {
          id_especialidad: 1,
          nombre: 'Cardiología',
          descripcion: 'Con acento',
        },
        {
          id_especialidad: 2,
          nombre: "Otorrinolaringología",
          descripcion: 'Palabra muy larga',
        },
      ];

      mockEspecialidad.findAll = jest.fn().mockResolvedValue(mockEspecialidades as any);

      // Act
      const result = await EspecialidadService.obtenerTodas();

      // Assert
      expect(result).toEqual(mockEspecialidades);
    });
  });

  describe('obtenerTodas - Casos de Excepción', () => {
    it('debería lanzar error cuando hay error de conexión a base de datos', async () => {
      // Arrange
      const dbError = new Error('Error de conexión a la base de datos');

      mockEspecialidad.findAll = jest.fn().mockRejectedValue(dbError);

      // Act & Assert
      await expect(EspecialidadService.obtenerTodas()).rejects.toThrow(
        'Error al obtener especialidades'
      );

      expect(mockEspecialidad.findAll).toHaveBeenCalledWith({
        order: [['nombre', 'ASC']],
      });
    });

    it('debería lanzar error cuando hay timeout de base de datos', async () => {
      // Arrange
      const timeoutError = new Error('Timeout de conexión a la base de datos');

      mockEspecialidad.findAll = jest.fn().mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(EspecialidadService.obtenerTodas()).rejects.toThrow(
        'Error al obtener especialidades'
      );
    });

    it('debería lanzar error genérico cuando falla la consulta', async () => {
      // Arrange
      const genericError = new Error('Error inesperado');

      mockEspecialidad.findAll = jest.fn().mockRejectedValue(genericError);

      // Act & Assert
      await expect(EspecialidadService.obtenerTodas()).rejects.toThrow(
        'Error al obtener especialidades'
      );
    });

    it('debería manejar error cuando la tabla de especialidades no existe', async () => {
      // Arrange
      const tableError = new Error('Table "especialidad" does not exist');

      mockEspecialidad.findAll = jest.fn().mockRejectedValue(tableError);

      // Act & Assert
      await expect(EspecialidadService.obtenerTodas()).rejects.toThrow(
        'Error al obtener especialidades'
      );
    });
  });
});

