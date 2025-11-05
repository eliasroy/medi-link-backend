// Mock de las dependencias
jest.mock('../../../service/CitaService', () => ({
  crearCitaConHorario: jest.fn(),
  obtenerCitasPorPaciente: jest.fn(),
  obtenerCitasPorMedico: jest.fn(),
  eliminarCita: jest.fn(),
}));

// Importar después de los mocks
import CitaController from '../../../controller/CitaController';
import CitaService from '../../../service/CitaService';

// Crear mocks manualmente para los métodos del servicio
let mockCrearCitaConHorario: jest.MockedFunction<any>;
let mockObtenerCitasPorPaciente: jest.MockedFunction<any>;
let mockObtenerCitasPorMedico: jest.MockedFunction<any>;
let mockEliminarCita: jest.MockedFunction<any>;

// Asignar referencias después de los mocks
beforeAll(() => {
  const citaService = require('../../../service/CitaService');
  mockCrearCitaConHorario = citaService.crearCitaConHorario;
  mockObtenerCitasPorPaciente = citaService.obtenerCitasPorPaciente;
  mockObtenerCitasPorMedico = citaService.obtenerCitasPorMedico;
  mockEliminarCita = citaService.eliminarCita;
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

describe('CitaController - Tests Completos', () => {

  describe('crearCita - Casos Normales', () => {
    it('debería crear cita exitosamente usando horario existente', async () => {
      // Arrange
      const req = {
        body: {
          idHorario: 1,
          idMedico: 1,
          titulo: 'Consulta General',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockCita = {
        id_cita: 1,
        id_paciente: 1,
        id_horario: 1,
        fecha_cita: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
        estado: 'PENDIENTE',
      };

      mockCrearCitaConHorario.mockResolvedValue(mockCita);

      // Act
      await CitaController.crearCita(req, res);

      // Assert
      expect(mockCrearCitaConHorario).toHaveBeenCalledWith(1, {
        idHorario: 1,
        idMedico: 1,
        titulo: 'Consulta General',
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCita });
    });

    it('debería crear cita exitosamente creando nuevo horario', async () => {
      // Arrange
      const req = {
        body: {
          idMedico: 2,
          titulo: 'Consulta Especializada',
          fecha: '2024-12-02',
          hora_inicio: '14:00:00',
          hora_fin: '15:00:00',
          modalidad: 'VIRTUAL',
        },
        user: { id: 2 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockCita = {
        id_cita: 2,
        id_paciente: 2,
        id_horario: 2,
        fecha_cita: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
        estado: 'PENDIENTE',
      };

      mockCrearCitaConHorario.mockResolvedValue(mockCita);

      // Act
      await CitaController.crearCita(req, res);

      // Assert
      expect(mockCrearCitaConHorario).toHaveBeenCalledWith(2, {
        idMedico: 2,
        titulo: 'Consulta Especializada',
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockCita });
    });
  });

  describe('crearCita - Casos Límite', () => {
    it('debería manejar error cuando horario no está disponible', async () => {
      // Arrange
      const req = {
        body: {
          idHorario: 1,
          idMedico: 1,
          titulo: 'Consulta No Disponible',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('El horario seleccionado no está disponible');
      mockCrearCitaConHorario.mockRejectedValue(error);

      // Act
      await CitaController.crearCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'El horario seleccionado no está disponible' });
    });

    it('debería manejar error de conflicto de horario', async () => {
      // Arrange
      const req = {
        body: {
          idMedico: 2,
          titulo: 'Consulta Conflicto',
          fecha: '2024-12-02',
          hora_inicio: '14:00:00',
          hora_fin: '15:00:00',
          modalidad: 'VIRTUAL',
        },
        user: { id: 2 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Ya existe un horario en esa fecha y hora');
      mockCrearCitaConHorario.mockRejectedValue(error);

      // Act
      await CitaController.crearCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Ya existe un horario en esa fecha y hora' });
    });

    it('debería manejar error cuando ya existe cita activa', async () => {
      // Arrange
      const req = {
        body: {
          idHorario: 1,
          idMedico: 1,
          titulo: 'Cita Duplicada',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Ya existe una cita activa para ese horario');
      mockCrearCitaConHorario.mockRejectedValue(error);

      // Act
      await CitaController.crearCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Ya existe una cita activa para ese horario' });
    });
  });

  describe('crearCita - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        body: {
          idHorario: 1,
          idMedico: 1,
          titulo: 'Error Interno',
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error interno del servidor');
      mockCrearCitaConHorario.mockRejectedValue(error);

      // Act
      await CitaController.crearCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('obtenerCitasPorPaciente - Casos Normales', () => {
    it('debería obtener citas del paciente exitosamente', async () => {
      // Arrange
      const req = {
        params: { idPaciente: '1' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockCitas = [
        {
          id_cita: 1,
          estado: 'PENDIENTE',
          modalidad: 'PRESENCIAL',
          horario: {
            titulo: 'Consulta General',
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            medico: {
              usuario: {
                nombre: 'Dr. Juan',
                paterno: 'Pérez',
                materno: 'García',
              },
            },
          },
          consulta: {
            calificacion: 5,
            estado: 'FINALIZADA',
          },
        },
      ];

      mockObtenerCitasPorPaciente.mockResolvedValue(mockCitas);

      // Act
      await CitaController.obtenerCitasPorPaciente(req, res);

      // Assert
      expect(mockObtenerCitasPorPaciente).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCitas,
        count: 1
      });
    });

    it('debería retornar array vacío cuando paciente no tiene citas', async () => {
      // Arrange
      const req = {
        params: { idPaciente: '999' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockCitas: any[] = [];

      mockObtenerCitasPorPaciente.mockResolvedValue(mockCitas);

      // Act
      await CitaController.obtenerCitasPorPaciente(req, res);

      // Assert
      expect(mockObtenerCitasPorPaciente).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        count: 0
      });
    });
  });

  describe('obtenerCitasPorPaciente - Casos Límite', () => {
    it('debería manejar error cuando idPaciente no es un número válido', async () => {
      // Arrange
      const req = {
        params: { idPaciente: 'invalid' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      // Act
      await CitaController.obtenerCitasPorPaciente(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "ID de paciente inválido"
      });
    });

    it('debería manejar error cuando idPaciente es NaN', async () => {
      // Arrange
      const req = {
        params: { idPaciente: 'abc' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      // Act
      await CitaController.obtenerCitasPorPaciente(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "ID de paciente inválido"
      });
    });
  });

  describe('obtenerCitasPorPaciente - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        params: { idPaciente: '1' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error de conexión a la base de datos');
      mockObtenerCitasPorPaciente.mockRejectedValue(error);

      // Act
      await CitaController.obtenerCitasPorPaciente(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de conexión a la base de datos'
      });
    });
  });

  describe('obtenerCitasPorMedico - Casos Normales', () => {
    it('debería obtener citas del médico exitosamente', async () => {
      // Arrange
      const req = {
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockCitas = [
        {
          id_cita: 1,
          id_paciente: 1,
          estado: 'CONFIRMADA',
          modalidad: 'PRESENCIAL',
          horario: {
            titulo: 'Consulta General',
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            medico: {
              usuario: {
                nombre: 'Dr. Juan',
                paterno: 'Pérez',
                materno: 'García',
              },
            },
          },
          paciente: {
            usuario: {
              nombre: 'María',
              paterno: 'López',
              materno: 'Rodríguez',
            },
          },
          consulta: {
            calificacion: 4,
            estado: 'FINALIZADA',
          },
        },
      ];

      mockObtenerCitasPorMedico.mockResolvedValue(mockCitas);

      // Act
      await CitaController.obtenerCitasPorMedico(req, res);

      // Assert
      expect(mockObtenerCitasPorMedico).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCitas,
        count: 1
      });
    });
  });

  describe('obtenerCitasPorMedico - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error de conexión a la base de datos');
      mockObtenerCitasPorMedico.mockRejectedValue(error);

      // Act
      await CitaController.obtenerCitasPorMedico(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error de conexión a la base de datos'
      });
    });
  });

  describe('eliminarCita - Casos Normales', () => {
    it('debería eliminar cita exitosamente', async () => {
      // Arrange
      const req = {
        params: { idCita: '1' },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockResult = {
        id_cita: 1,
        estado: 'CANCELADA',
      };

      mockEliminarCita.mockResolvedValue(mockResult);

      // Act
      await CitaController.eliminarCita(req, res);

      // Assert
      expect(mockEliminarCita).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockResult });
    });
  });

  describe('eliminarCita - Casos Límite', () => {
    it('debería manejar error cuando idCita no es un número válido', async () => {
      // Arrange
      const req = {
        params: { idCita: 'invalid' },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      // Act
      await CitaController.eliminarCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "ID de cita inválido" });
    });

    it('debería manejar error cuando cita no existe', async () => {
      // Arrange
      const req = {
        params: { idCita: '999' },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Cita no encontrada');
      mockEliminarCita.mockRejectedValue(error);

      // Act
      await CitaController.eliminarCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Cita no encontrada' });
    });

    it('debería manejar error cuando cita pertenece a otro paciente', async () => {
      // Arrange
      const req = {
        params: { idCita: '1' },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('No puedes eliminar una cita que no te pertenece');
      mockEliminarCita.mockRejectedValue(error);

      // Act
      await CitaController.eliminarCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No puedes eliminar una cita que no te pertenece' });
    });
  });

  describe('eliminarCita - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        params: { idCita: '1' },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error interno del servidor');
      mockEliminarCita.mockRejectedValue(error);

      // Act
      await CitaController.eliminarCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error interno del servidor' });
    });
  });
});