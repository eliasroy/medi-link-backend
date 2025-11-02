import { Request, Response } from 'express';
import * as medicoService from '../../../service/medico.service';
import { getMedicos } from '../../../controller/medico.controller';

jest.mock('../../../service/medico.service');

const mockedMedicoService = medicoService as jest.Mocked<typeof medicoService>;

function createMockRequest(query: any = {}) {
  return {
    query,
  } as Partial<Request> as Request;
}

function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

describe('Medico Controller - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMedicos - Casos Normales', () => {
    it('debe responder 200 con la lista de médicos cuando no hay filtros', async () => {
      // Arrange
      const req = createMockRequest({});

      const res = createMockResponse();

      const fakeResult = [
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

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult as any);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({});
      expect(res.status).not.toHaveBeenCalled(); // Status 200 por defecto
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('debe responder 200 con médicos filtrados por nombre', async () => {
      // Arrange
      const req = createMockRequest({ nombre: 'Juan' });

      const res = createMockResponse();

      const fakeResult = [
        {
          id_medico: 1,
          nombre: 'Dr. Juan',
          especialidad: 'Cardiología',
          calificacion_promedio: 4.5,
        },
      ];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult as any);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({ nombre: 'Juan' });
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('debe responder 200 con médicos filtrados por múltiples parámetros', async () => {
      // Arrange
      const req = createMockRequest({
        nombre: 'María',
        id_especialidad: '2',
        calificacion_promedio: '4.0',
        anios_experiencia: '5',
      });

      const res = createMockResponse();

      const fakeResult = [
        {
          id_medico: 2,
          nombre: 'Dr. María',
          especialidad: 'Pediatría',
          calificacion_promedio: 4.8,
        },
      ];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult as any);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({
        nombre: 'María',
        id_especialidad: '2',
        calificacion_promedio: '4.0',
        anios_experiencia: '5',
      });
      expect(res.json).toHaveBeenCalledWith(fakeResult);
    });

    it('debe responder 200 con lista vacía cuando no hay médicos', async () => {
      // Arrange
      const req = createMockRequest({});

      const res = createMockResponse();

      const fakeResult: any[] = [];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getMedicos - Casos Límite', () => {
    it('debe manejar query params con valores vacíos', async () => {
      // Arrange
      const req = createMockRequest({ nombre: '', especialidad: '' });

      const res = createMockResponse();

      const fakeResult: any[] = [];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({
        nombre: '',
        especialidad: '',
      });
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('debe manejar query params con valores numéricos como strings', async () => {
      // Arrange
      const req = createMockRequest({
        id_especialidad: '1',
        calificacion_promedio: '4.5',
        anios_experiencia: '10',
      });

      const res = createMockResponse();

      const fakeResult: any[] = [];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({
        id_especialidad: '1',
        calificacion_promedio: '4.5',
        anios_experiencia: '10',
      });
    });

    it('debe manejar nombres con caracteres especiales en query params', async () => {
      // Arrange
      const req = createMockRequest({ nombre: 'María José' });

      const res = createMockResponse();

      const fakeResult: any[] = [];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({
        nombre: 'María José',
      });
    });

    it('debe manejar filtro por especialidad como texto', async () => {
      // Arrange
      const req = createMockRequest({ especialidad: 'Cardiología' });

      const res = createMockResponse();

      const fakeResult = [
        {
          id_medico: 1,
          especialidad: 'Cardiología',
        },
      ];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult as any);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({
        especialidad: 'Cardiología',
      });
    });

    it('debe manejar filtro por número de colegiatura', async () => {
      // Arrange
      const req = createMockRequest({ nro_colegiatura: '12345' });

      const res = createMockResponse();

      const fakeResult: any[] = [];

      mockedMedicoService.listarMedicosFiltrados.mockResolvedValueOnce(fakeResult);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({
        nro_colegiatura: '12345',
      });
    });
  });

  describe('getMedicos - Casos de Excepción', () => {
    it('debe responder 500 ante error de conexión a base de datos', async () => {
      // Arrange
      const req = createMockRequest({});

      const res = createMockResponse();

      const dbError = new Error('Error de conexión a la base de datos');

      mockedMedicoService.listarMedicosFiltrados.mockRejectedValueOnce(dbError);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(mockedMedicoService.listarMedicosFiltrados).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener médicos',
        error: dbError,
      });
    });

    it('debe responder 500 ante timeout de base de datos', async () => {
      // Arrange
      const req = createMockRequest({ nombre: 'Juan' });

      const res = createMockResponse();

      const timeoutError = new Error('Timeout de conexión a la base de datos');

      mockedMedicoService.listarMedicosFiltrados.mockRejectedValueOnce(timeoutError);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener médicos',
        error: timeoutError,
      });
    });

    it('debe responder 500 ante error inesperado del servicio', async () => {
      // Arrange
      const req = createMockRequest({});

      const res = createMockResponse();

      const genericError = new Error('Error inesperado');

      mockedMedicoService.listarMedicosFiltrados.mockRejectedValueOnce(genericError);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener médicos',
        error: genericError,
      });
    });

    it('debe responder 500 cuando el servicio lanza error de vista no encontrada', async () => {
      // Arrange
      const req = createMockRequest({});

      const res = createMockResponse();

      const error = new Error('VistaMedicos no encontrada');

      mockedMedicoService.listarMedicosFiltrados.mockRejectedValueOnce(error);

      // Act
      await getMedicos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error al obtener médicos',
        error: error,
      });
    });
  });
});

