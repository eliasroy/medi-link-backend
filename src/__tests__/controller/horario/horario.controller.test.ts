import { Request, Response } from 'express';
import HorarioController from '../../../controller/HorarioController';
import HorarioService from '../../../service/HorarioService';

jest.mock('../../../service/HorarioService');

const mockedHorarioService = HorarioService as jest.Mocked<typeof HorarioService>;

function createMockRequest(body: any = {}, query: any = {}, user: any = {}) {
  return {
    body,
    query,
    user,
  } as Partial<Request> as Request;
}

function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

describe('HorarioController - Tests Completos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crearHorario - Casos Normales', () => {
    it('debe crear un horario exitosamente y responder 201', async () => {
      // Arrange
      const req = createMockRequest(
        {
          titulo: 'Consulta General',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        {},
        { id: 1 }
      );

      const res = createMockResponse();

      const mockHorario = {
        id_horario: 1,
        id_medico: 1,
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
        estado: 'DISPONIBLE',
        titulo: 'Consulta General',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any;

      mockedHorarioService.crearHorario.mockResolvedValue(mockHorario as any);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(1, {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorario,
      });
    });

    it('debe crear un horario virtual exitosamente', async () => {
      // Arrange
      const req = createMockRequest(
        {
          titulo: 'Consulta Virtual',
          fecha: '2024-12-02',
          hora_inicio: '14:00:00',
          hora_fin: '15:00:00',
          modalidad: 'VIRTUAL',
        },
        {},
        { id: 2 }
      );

      const res = createMockResponse();

      const mockHorario = {
        id_horario: 2,
        id_medico: 2,
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
        estado: 'DISPONIBLE',
        titulo: 'Consulta Virtual',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any;

      mockedHorarioService.crearHorario.mockResolvedValue(mockHorario as any);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(2, {
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorario,
      });
    });
  });

  describe('crearHorario - Casos Límite', () => {
    it('debe manejar horario con hora mínima (00:00:00)', async () => {
      // Arrange
      const req = createMockRequest(
        {
          fecha: '2024-12-01',
          hora_inicio: '00:00:00',
          hora_fin: '01:00:00',
          modalidad: 'PRESENCIAL',
        },
        {},
        { id: 1 }
      );

      const res = createMockResponse();

      const mockHorario = {
        id_horario: 1,
        id_medico: 1,
        fecha: '2024-12-01',
        hora_inicio: '00:00:00',
        hora_fin: '01:00:00',
        modalidad: 'PRESENCIAL',
        estado: 'DISPONIBLE',
        titulo: 'Consulta Nocturna',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any;

      mockedHorarioService.crearHorario.mockResolvedValue(mockHorario as any);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(1, {
        fecha: '2024-12-01',
        hora_inicio: '00:00:00',
        hora_fin: '01:00:00',
        modalidad: 'PRESENCIAL',
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('debe manejar horario con hora máxima (23:59:59)', async () => {
      // Arrange
      const req = createMockRequest(
        {
          fecha: '2024-12-01',
          hora_inicio: '23:00:00',
          hora_fin: '23:59:59',
          modalidad: 'VIRTUAL',
        },
        {},
        { id: 1 }
      );

      const res = createMockResponse();

      const mockHorario = {
        id_horario: 1,
        id_medico: 1,
        fecha: '2024-12-01',
        hora_inicio: '23:00:00',
        hora_fin: '23:59:59',
        modalidad: 'VIRTUAL',
        estado: 'DISPONIBLE',
        titulo: 'Consulta Tardía',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any;

      mockedHorarioService.crearHorario.mockResolvedValue(mockHorario as any);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(1, {
        fecha: '2024-12-01',
        hora_inicio: '23:00:00',
        hora_fin: '23:59:59',
        modalidad: 'VIRTUAL',
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('debe manejar fecha futura lejana', async () => {
      // Arrange
      const req = createMockRequest(
        {
          fecha: '2025-12-31',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        {},
        { id: 1 }
      );

      const res = createMockResponse();

      const mockHorario = {
        id_horario: 1,
        id_medico: 1,
        fecha: '2025-12-31',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
        estado: 'DISPONIBLE',
        titulo: 'Consulta Futura',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      } as any;

      mockedHorarioService.crearHorario.mockResolvedValue(mockHorario as any);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(1, {
        fecha: '2025-12-31',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('crearHorario - Casos de Excepción', () => {
    it('debe responder 400 cuando ya existe un horario en esa fecha y hora', async () => {
      // Arrange
      const req = createMockRequest(
        {
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        {},
        { id: 1 }
      );

      const res = createMockResponse();

      const error = new Error('Ya existe un horario en esa fecha y hora');

      mockedHorarioService.crearHorario.mockRejectedValue(error);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(1, {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Ya existe un horario en esa fecha y hora',
      });
    });

    it('debe responder 400 ante error de validación de datos', async () => {
      // Arrange
      const req = createMockRequest(
        {
          fecha: 'invalid-date',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        {},
        { id: 1 }
      );

      const res = createMockResponse();

      const error = new Error('Fecha inválida');

      mockedHorarioService.crearHorario.mockRejectedValue(error);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Fecha inválida',
      });
    });

    it('debe responder 400 ante error de base de datos en creación', async () => {
      // Arrange
      const req = createMockRequest(
        {
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        {},
        { id: 1 }
      );

      const res = createMockResponse();

      const error = new Error('Error al insertar en tabla horario');

      mockedHorarioService.crearHorario.mockRejectedValue(error);

      // Act
      await HorarioController.crearHorario(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al insertar en tabla horario',
      });
    });
  });

  describe('obtenerHorariosDisponiblesSemana - Casos Normales', () => {
    it('debe obtener horarios de la semana actual sin filtros', async () => {
      // Arrange
      const req = createMockRequest({}, {});

      const res = createMockResponse();

      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            nombre: 'Dr. Juan',
            especialidad: { nombre: 'Cardiología' },
          },
        },
      ];

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesSemana).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorarios,
        total: 1,
      });
    });

    it('debe obtener horarios filtrados por idMedico', async () => {
      // Arrange
      const req = createMockRequest({}, { idMedico: '1' });

      const res = createMockResponse();

      const mockHorarios = [
        {
          id_horario: 1,
          id_medico: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
        },
      ];

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesSemana).toHaveBeenCalledWith({
        idMedico: 1,
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorarios,
        total: 1,
      });
    });

    it('debe obtener horarios filtrados por modalidad', async () => {
      // Arrange
      const req = createMockRequest({}, { modalidad: 'VIRTUAL' });

      const res = createMockResponse();

      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-12-01',
          hora_inicio: '14:00:00',
          hora_fin: '15:00:00',
          modalidad: 'VIRTUAL',
          estado: 'DISPONIBLE',
        },
      ];

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesSemana).toHaveBeenCalledWith({
        modalidad: 'VIRTUAL',
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorarios,
        total: 1,
      });
    });

    it('debe obtener lista vacía cuando no hay horarios', async () => {
      // Arrange
      const req = createMockRequest({}, {});

      const res = createMockResponse();

      const mockHorarios: any[] = [];

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesSemana).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        total: 0,
      });
    });
  });

  describe('obtenerHorariosDisponiblesSemana - Casos Límite', () => {
    it('debe manejar filtros con valores inválidos', async () => {
      // Arrange
      const req = createMockRequest({}, { idMedico: 'invalid', estado: 'INVALIDO' });

      const res = createMockResponse();

      const mockHorarios: any[] = [];

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesSemana).toHaveBeenCalledWith({
        idMedico: NaN, // Number('invalid') = NaN
        estado: 'INVALIDO',
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        total: 0,
      });
    });

    it('debe manejar múltiples filtros combinados', async () => {
      // Arrange
      const req = createMockRequest({}, {
        idMedico: '1',
        estado: 'DISPONIBLE',
        modalidad: 'PRESENCIAL',
      });

      const res = createMockResponse();

      const mockHorarios = [
        {
          id_horario: 1,
          id_medico: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
        },
      ];

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesSemana).toHaveBeenCalledWith({
        idMedico: 1,
        estado: 'DISPONIBLE',
        modalidad: 'PRESENCIAL',
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorarios,
        total: 1,
      });
    });
  });

  describe('obtenerHorariosDisponiblesSemana - Casos de Excepción', () => {
    it('debe responder 500 ante error de base de datos', async () => {
      // Arrange
      const req = createMockRequest({}, {});

      const res = createMockResponse();

      const error = new Error('Error al obtener horarios disponibles de la semana');

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockRejectedValue(error);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener horarios disponibles de la semana',
      });
    });

    it('debe responder 500 ante error de conexión', async () => {
      // Arrange
      const req = createMockRequest({}, { idMedico: '1' });

      const res = createMockResponse();

      const error = new Error('Error de conexión a la base de datos');

      mockedHorarioService.obtenerHorariosDisponiblesSemana.mockRejectedValue(error);

      // Act
      await HorarioController.obtenerHorariosDisponiblesSemana(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de conexión a la base de datos',
      });
    });
  });

  describe('obtenerHorariosDisponiblesPorRango - Casos Normales', () => {
    it('debe obtener horarios por rango de fechas sin filtros', async () => {
      // Arrange
      const req = createMockRequest({}, {
        fechaInicio: '2024-12-01',
        fechaFin: '2024-12-07',
      });

      const res = createMockResponse();

      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            nombre: 'Dr. Juan',
            especialidad: { nombre: 'Cardiología' },
          },
        },
      ];

      mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesPorRango).toHaveBeenCalledWith(
        '2024-12-01',
        '2024-12-07',
        {}
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorarios,
        total: 1,
      });
    });

    it('debe obtener horarios por rango con filtros aplicados', async () => {
      // Arrange
      const req = createMockRequest({}, {
        fechaInicio: '2024-12-01',
        fechaFin: '2024-12-07',
        idMedico: '1',
        modalidad: 'VIRTUAL',
      });

      const res = createMockResponse();

      const mockHorarios = [
        {
          id_horario: 1,
          id_medico: 1,
          fecha: '2024-12-01',
          hora_inicio: '14:00:00',
          hora_fin: '15:00:00',
          modalidad: 'VIRTUAL',
          estado: 'DISPONIBLE',
        },
      ];

      mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesPorRango).toHaveBeenCalledWith(
        '2024-12-01',
        '2024-12-07',
        {
          idMedico: 1,
          modalidad: 'VIRTUAL',
        }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorarios,
        total: 1,
      });
    });
  });

  describe('obtenerHorariosDisponiblesPorRango - Casos Límite', () => {
    it('debe manejar rango de fechas con un solo día', async () => {
      // Arrange
      const req = createMockRequest({}, {
        fechaInicio: '2024-12-01',
        fechaFin: '2024-12-01',
      });

      const res = createMockResponse();

      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
        },
      ];

      mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesPorRango).toHaveBeenCalledWith(
        '2024-12-01',
        '2024-12-01',
        {}
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHorarios,
        total: 1,
      });
    });

    it('debe manejar rango de fechas amplio', async () => {
      // Arrange
      const req = createMockRequest({}, {
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
      });

      const res = createMockResponse();

      const mockHorarios: any[] = [];

      mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockResolvedValue(mockHorarios as any);

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(mockedHorarioService.obtenerHorariosDisponiblesPorRango).toHaveBeenCalledWith(
        '2024-01-01',
        '2024-12-31',
        {}
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        total: 0,
      });
    });
  });

  describe('obtenerHorariosDisponiblesPorRango - Casos de Excepción', () => {
    it('debe responder 400 cuando faltan fechaInicio o fechaFin', async () => {
      // Arrange
      const req = createMockRequest({}, { fechaInicio: '2024-12-01' }); // falta fechaFin

      const res = createMockResponse();

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'fechaInicio y fechaFin son requeridos',
      });
    });

    it('debe responder 400 cuando faltan ambas fechas', async () => {
      // Arrange
      const req = createMockRequest({}, {}); // faltan ambas fechas

      const res = createMockResponse();

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'fechaInicio y fechaFin son requeridos',
      });
    });

    it('debe responder 500 ante error de base de datos', async () => {
      // Arrange
      const req = createMockRequest({}, {
        fechaInicio: '2024-12-01',
        fechaFin: '2024-12-07',
      });

      const res = createMockResponse();

      const error = new Error('Error al obtener horarios disponibles por rango');

      mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockRejectedValue(error);

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener horarios disponibles por rango',
      });
    });

    it('debe responder 500 ante error de conexión en consulta por rango', async () => {
      // Arrange
      const req = createMockRequest({}, {
        fechaInicio: '2024-12-01',
        fechaFin: '2024-12-07',
        idMedico: '1',
      });

      const res = createMockResponse();

      const error = new Error('Error de conexión a la base de datos');

      mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockRejectedValue(error);

      // Act
      await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de conexión a la base de datos',
      });
    });
  
    describe('Casos Límite Adicionales - Controller', () => {
      it('debe manejar request con parámetros null/undefined gracefully', async () => {
        // Arrange
        const req = createMockRequest({}, { idMedico: null, modalidad: undefined });
  
        const res = createMockResponse();
  
        const mockHorarios: any[] = [];
        mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);
  
        // Act
        await HorarioController.obtenerHorariosDisponiblesSemana(req, res);
  
        // Assert
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: [],
          total: 0,
        });
      });
  
      it('debe manejar fechas en formato ISO string extremo', async () => {
        // Arrange
        const req = createMockRequest({}, {
          fechaInicio: '2024-12-31T23:59:59.999Z',
          fechaFin: '2025-01-01T00:00:00.000Z'
        });
  
        const res = createMockResponse();
  
        const mockHorarios: any[] = [];
        mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockResolvedValue(mockHorarios as any);
  
        // Act
        await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);
  
        // Assert
        expect(mockedHorarioService.obtenerHorariosDisponiblesPorRango).toHaveBeenCalledWith(
          '2024-12-31T23:59:59.999Z',
          '2025-01-01T00:00:00.000Z',
          {}
        );
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: [],
          total: 0,
        });
      });
  
      it('debe manejar modalidades en diferentes casos', async () => {
        // Arrange
        const req = createMockRequest({}, { modalidad: 'virtual' }); // lowercase
  
        const res = createMockResponse();
  
        const mockHorarios: any[] = [];
        mockedHorarioService.obtenerHorariosDisponiblesSemana.mockResolvedValue(mockHorarios as any);
  
        // Act
        await HorarioController.obtenerHorariosDisponiblesSemana(req, res);
  
        // Assert
        expect(mockedHorarioService.obtenerHorariosDisponiblesSemana).toHaveBeenCalledWith({
          modalidad: 'virtual' as any, // Se pasa como está, el service debe manejar la validación
        });
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: [],
          total: 0,
        });
      });
  
      it('debe manejar userId muy alto en token', async () => {
        // Arrange
        const req = createMockRequest(
          {
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
          },
          {},
          { id: 999999999 }
        );
  
        const res = createMockResponse();
  
        const mockHorario = {
          id_horario: 1,
          id_medico: 999999999,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
        } as any;
  
        mockedHorarioService.crearHorario.mockResolvedValue(mockHorario as any);
  
        // Act
        await HorarioController.crearHorario(req, res);
  
        // Assert
        expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(999999999, {
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        });
        expect(res.status).toHaveBeenCalledWith(201);
      });
  
      it('debe manejar múltiples parámetros de query complejos', async () => {
        // Arrange
        const req = createMockRequest({}, {
          idMedico: '1',
          estado: 'DISPONIBLE',
          modalidad: 'PRESENCIAL',
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31'
        });
  
        const res = createMockResponse();
  
        const mockHorarios = [
          {
            id_horario: 1,
            id_medico: 1,
            fecha: '2024-06-15',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
            estado: 'DISPONIBLE',
          },
        ];
  
        mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockResolvedValue(mockHorarios as any);
  
        // Act
        await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);
  
        // Assert
        expect(mockedHorarioService.obtenerHorariosDisponiblesPorRango).toHaveBeenCalledWith(
          '2024-01-01',
          '2024-12-31',
          {
            idMedico: 1,
            estado: 'DISPONIBLE',
            modalidad: 'PRESENCIAL',
          }
        );
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockHorarios,
          total: 1,
        });
      });
  
      it('debe manejar request body con campos extra', async () => {
        // Arrange
        const req = createMockRequest(
          {
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
            titulo: 'Consulta',
            descripcion: 'Descripción extra',
            campoExtra: 'valor_innecesario',
            numeroExtra: 12345,
          },
          {},
          { id: 1 }
        );
  
        const res = createMockResponse();
  
        const mockHorario = {
          id_horario: 1,
          id_medico: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
        } as any;
  
        mockedHorarioService.crearHorario.mockResolvedValue(mockHorario as any);
  
        // Act
        await HorarioController.crearHorario(req, res);
  
        // Assert
        expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(1, {
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        });
        expect(res.status).toHaveBeenCalledWith(201);
      });
  
      it('debe manejar request sin user en token gracefully', async () => {
        // Arrange
        const req = createMockRequest(
          {
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
          },
          {},
          {} // user vacío
        );
  
        const res = createMockResponse();
  
        // El service debería recibir undefined como ID
        const error = new Error('ID de médico requerido');
        mockedHorarioService.crearHorario.mockRejectedValue(error);
  
        // Act
        await HorarioController.crearHorario(req, res);
  
        // Assert
        expect(mockedHorarioService.crearHorario).toHaveBeenCalledWith(undefined, {
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        });
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  
    describe('Casos de Excepción Adicionales - Controller', () => {
      it('debe manejar error inesperado del service', async () => {
        // Arrange
        const req = createMockRequest(
          {
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
          },
          {},
          { id: 1 }
        );
  
        const res = createMockResponse();
  
        const unexpectedError = new Error('Error interno inesperado del sistema');
        mockedHorarioService.crearHorario.mockRejectedValue(unexpectedError);
  
        // Act
        await HorarioController.crearHorario(req, res);
  
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Error interno inesperado del sistema',
        });
      });
  
      it('debe manejar timeout de service', async () => {
        // Arrange
        const req = createMockRequest({}, {});
  
        const res = createMockResponse();
  
        const timeoutError = new Error('Request timeout');
        mockedHorarioService.obtenerHorariosDisponiblesSemana.mockRejectedValue(timeoutError);
  
        // Act
        await HorarioController.obtenerHorariosDisponiblesSemana(req, res);
  
        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Request timeout',
        });
      });
  
      it('debe manejar fechas inválidas en rango', async () => {
        // Arrange
        const req = createMockRequest({}, {
          fechaInicio: 'fecha-invalida',
          fechaFin: 'otra-fecha-invalida'
        });
  
        const res = createMockResponse();
  
        const validationError = new Error('Formato de fecha inválido');
        mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockRejectedValue(validationError);
  
        // Act
        await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);
  
        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Formato de fecha inválido',
        });
      });
  
      it('debe manejar error de memoria en consultas grandes', async () => {
        // Arrange
        const req = createMockRequest({}, {
          fechaInicio: '2020-01-01',
          fechaFin: '2030-12-31'
        });
  
        const res = createMockResponse();
  
        const memoryError = new Error('Memoria insuficiente para procesar la consulta');
        mockedHorarioService.obtenerHorariosDisponiblesPorRango.mockRejectedValue(memoryError);
  
        // Act
        await HorarioController.obtenerHorariosDisponiblesPorRango(req, res);
  
        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Memoria insuficiente para procesar la consulta',
        });
      });
  
      it('debe manejar error de autenticación en token', async () => {
        // Arrange
        const req = createMockRequest(
          {
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
          },
          {},
          null // user null
        );
  
        const res = createMockResponse();
  
        // Act
        await HorarioController.crearHorario(req, res);
  
        // Assert - Debería manejar el caso donde user es null
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: expect.any(String),
        });
      });
    });
  });
});