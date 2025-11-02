import { Request, Response } from 'express';
import EspecialidadService from '../../../service/especialidad.service';
import EspecialidadController from '../../../controller/especialidad.controller';

jest.mock('../../../service/especialidad.service');

const mockedEspecialidadService = EspecialidadService as jest.Mocked<typeof EspecialidadService>;

function createMockRequest() {
  return {} as Partial<Request> as Request;
}

function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

describe('Especialidad Controller - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerTodas - Casos Normales', () => {
    it('debe responder 200 con todas las especialidades cuando la consulta es exitosa', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const fakeResult = [
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
      ];

      mockedEspecialidadService.obtenerTodas.mockResolvedValueOnce(fakeResult as any);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(mockedEspecialidadService.obtenerTodas).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled(); // Status 200 por defecto
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeResult,
      });
    });

    it('debe responder 200 con lista vacía cuando no hay especialidades', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const fakeResult: any[] = [];

      mockedEspecialidadService.obtenerTodas.mockResolvedValueOnce(fakeResult);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(mockedEspecialidadService.obtenerTodas).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });

    it('debe responder con formato correcto de respuesta exitosa', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const fakeResult = [
        {
          id_especialidad: 1,
          nombre: 'Neurología',
        },
      ];

      mockedEspecialidadService.obtenerTodas.mockResolvedValueOnce(fakeResult as any);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeResult,
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe('obtenerTodas - Casos Límite', () => {
    it('debe responder 200 cuando hay una sola especialidad', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const fakeResult = [
        {
          id_especialidad: 1,
          nombre: 'Cardiología',
          descripcion: 'Especialidad en enfermedades del corazón',
        },
      ];

      mockedEspecialidadService.obtenerTodas.mockResolvedValueOnce(fakeResult as any);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeResult,
      });
    });

    it('debe responder 200 cuando hay muchas especialidades', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const fakeResult = Array.from({ length: 50 }, (_, i) => ({
        id_especialidad: i + 1,
        nombre: `Especialidad ${i + 1}`,
      }));

      mockedEspecialidadService.obtenerTodas.mockResolvedValueOnce(fakeResult as any);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeResult,
      });
      expect(res.json.mock.calls[0][0].data).toHaveLength(50);
    });

    it('debe manejar especialidades con caracteres especiales en nombres', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const fakeResult = [
        {
          id_especialidad: 1,
          nombre: 'Cardiología',
        },
        {
          id_especialidad: 2,
          nombre: "Otorrinolaringología",
        },
      ];

      mockedEspecialidadService.obtenerTodas.mockResolvedValueOnce(fakeResult as any);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeResult,
      });
    });
  });

  describe('obtenerTodas - Casos de Excepción', () => {
    it('debe responder 500 ante error de conexión a base de datos', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const dbError = new Error('Error al obtener especialidades');

      mockedEspecialidadService.obtenerTodas.mockRejectedValueOnce(dbError);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(mockedEspecialidadService.obtenerTodas).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener especialidades',
      });
    });

    it('debe responder 500 ante timeout de base de datos', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const timeoutError = new Error('Error al obtener especialidades');

      mockedEspecialidadService.obtenerTodas.mockRejectedValueOnce(timeoutError);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener especialidades',
      });
    });

    it('debe responder 500 ante error inesperado del servicio', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const genericError = new Error('Error al obtener especialidades');

      mockedEspecialidadService.obtenerTodas.mockRejectedValueOnce(genericError);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener especialidades',
      });
    });

    it('debe responder 500 cuando el servicio lanza error de tabla no encontrada', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const tableError = new Error('Error al obtener especialidades');

      mockedEspecialidadService.obtenerTodas.mockRejectedValueOnce(tableError);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener especialidades',
      });
    });

    it('debe mantener formato de error consistente', async () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      const error = new Error('Error al obtener especialidades');

      mockedEspecialidadService.obtenerTodas.mockRejectedValueOnce(error);

      // Act
      await EspecialidadController.obtenerTodas(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener especialidades',
      });
      expect(res.json.mock.calls[0][0]).toHaveProperty('success');
      expect(res.json.mock.calls[0][0]).toHaveProperty('message');
    });
  });
});

