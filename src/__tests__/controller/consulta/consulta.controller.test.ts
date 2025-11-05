// Mock de las dependencias
jest.mock('../../../service/ConsultaService', () => ({
  iniciarConsulta: jest.fn(),
  actualizarConsulta: jest.fn(),
  calificarConsulta: jest.fn(),
  obtenerConsultaPorIdCita: jest.fn(),
}));

// Importar después de los mocks
import ConsultaController from '../../../controller/ConsultaController';
import ConsultaService from '../../../service/ConsultaService';

// Crear mocks manualmente para los métodos del servicio
let mockIniciarConsulta: jest.MockedFunction<any>;
let mockActualizarConsulta: jest.MockedFunction<any>;
let mockCalificarConsulta: jest.MockedFunction<any>;
let mockObtenerConsultaPorIdCita: jest.MockedFunction<any>;

// Asignar referencias después de los mocks
beforeAll(() => {
  const consultaService = require('../../../service/ConsultaService');
  mockIniciarConsulta = consultaService.iniciarConsulta;
  mockActualizarConsulta = consultaService.actualizarConsulta;
  mockCalificarConsulta = consultaService.calificarConsulta;
  mockObtenerConsultaPorIdCita = consultaService.obtenerConsultaPorIdCita;
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

describe('ConsultaController - Tests Completos', () => {

  describe('iniciarConsulta - Casos Normales', () => {
    it('debería iniciar consulta exitosamente', async () => {
      // Arrange
      const req = {
        body: {
          id_cita: 1,
          motivo: 'Consulta de rutina',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 1,
        id_cita: 1,
        motivo: 'Consulta de rutina',
        estado: 'INICIADO',
      };

      mockIniciarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.iniciarConsulta(req, res);

      // Assert
      expect(mockIniciarConsulta).toHaveBeenCalledWith(1, 'Consulta de rutina', 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });

    it('debería iniciar consulta con motivo vacío', async () => {
      // Arrange
      const req = {
        body: {
          id_cita: 2,
          motivo: '',
        },
        user: { id: 2 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 2,
        id_cita: 2,
        motivo: '',
        estado: 'INICIADO',
      };

      mockIniciarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.iniciarConsulta(req, res);

      // Assert
      expect(mockIniciarConsulta).toHaveBeenCalledWith(2, '', 2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });
  });

  describe('iniciarConsulta - Casos Límite', () => {
    it('debería manejar error de validación de cita', async () => {
      // Arrange
      const req = {
        body: {
          id_cita: 1,
          motivo: 'Consulta inválida',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Cita no encontrada');
      mockIniciarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.iniciarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Cita no encontrada' });
    });

    it('debería manejar error de consulta ya iniciada', async () => {
      // Arrange
      const req = {
        body: {
          id_cita: 1,
          motivo: 'Consulta duplicada',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('La consulta para esta cita ya fue iniciada');
      mockIniciarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.iniciarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'La consulta para esta cita ya fue iniciada' });
    });
  });

  describe('iniciarConsulta - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        body: {
          id_cita: 1,
          motivo: 'Error interno',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error interno del servidor');
      mockIniciarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.iniciarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('actualizarConsulta - Casos Normales', () => {
    it('debería actualizar consulta exitosamente', async () => {
      // Arrange
      const req = {
        params: { id_consulta: '1' },
        body: {
          diagnostico: 'Diagnóstico inicial',
          tratamiento: 'Tratamiento recomendado',
          estado: 'EN_REVISION',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 1,
        diagnostico: 'Diagnóstico inicial',
        tratamiento: 'Tratamiento recomendado',
        estado: 'EN_REVISION',
      };

      mockActualizarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.actualizarConsulta(req, res);

      // Assert
      expect(mockActualizarConsulta).toHaveBeenCalledWith(1, 1, {
        diagnostico: 'Diagnóstico inicial',
        tratamiento: 'Tratamiento recomendado',
        estado: 'EN_REVISION',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });

    it('debería actualizar consulta con todos los campos opcionales', async () => {
      // Arrange
      const req = {
        params: { id_consulta: '2' },
        body: {
          diagnostico: 'Diagnóstico completo',
          pathArchivo: '/path/to/file.pdf',
          tratamiento: 'Tratamiento detallado',
          observaciones: 'Observaciones adicionales',
          calificacion: 8,
          estado: 'FINALIZADA',
        },
        user: { id: 2 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 2,
        diagnostico: 'Diagnóstico completo',
        pathArchivo: '/path/to/file.pdf',
        tratamiento: 'Tratamiento detallado',
        observaciones: 'Observaciones adicionales',
        calificacion: 8,
        estado: 'FINALIZADA',
      };

      mockActualizarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.actualizarConsulta(req, res);

      // Assert
      expect(mockActualizarConsulta).toHaveBeenCalledWith(2, 2, {
        diagnostico: 'Diagnóstico completo',
        pathArchivo: '/path/to/file.pdf',
        tratamiento: 'Tratamiento detallado',
        observaciones: 'Observaciones adicionales',
        calificacion: 8,
        estado: 'FINALIZADA',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });

    it('debería actualizar consulta con campos opcionales faltantes', async () => {
      // Arrange
      const req = {
        params: { id_consulta: '3' },
        body: {
          estado: 'DIAGNOSTICADA',
        },
        user: { id: 3 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 3,
        estado: 'DIAGNOSTICADA',
      };

      mockActualizarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.actualizarConsulta(req, res);

      // Assert
      expect(mockActualizarConsulta).toHaveBeenCalledWith(3, 3, {
        estado: 'DIAGNOSTICADA',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });
  });

  describe('actualizarConsulta - Casos Límite', () => {
    it('debería manejar error cuando consulta no existe', async () => {
      // Arrange
      const req = {
        params: { id_consulta: '999' },
        body: {
          estado: 'EN_REVISION',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Consulta no encontrada');
      mockActualizarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.actualizarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Consulta no encontrada' });
    });

    it('debería manejar error cuando consulta ya está finalizada', async () => {
      // Arrange
      const req = {
        params: { id_consulta: '1' },
        body: {
          diagnostico: 'Nuevo diagnóstico',
          estado: 'EN_REVISION',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('La consulta ya está finalizada y no puede actualizarse');
      mockActualizarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.actualizarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'La consulta ya está finalizada y no puede actualizarse' });
    });

    it('debería manejar error de estado inválido', async () => {
      // Arrange
      const req = {
        params: { id_consulta: '1' },
        body: {
          estado: 'INVALIDO',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Estado inválido para consulta presencial');
      mockActualizarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.actualizarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Estado inválido para consulta presencial' });
    });
  });

  describe('actualizarConsulta - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        params: { id_consulta: '1' },
        body: {
          estado: 'EN_REVISION',
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error interno del servidor');
      mockActualizarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.actualizarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('calificarConsulta - Casos Normales', () => {
    it('debería calificar consulta exitosamente', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 1,
          calificacion: 9,
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 1,
        calificacion: 9,
        estado: 'FINALIZADA',
      };

      mockCalificarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(mockCalificarConsulta).toHaveBeenCalledWith(1, 1, 9);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });

    it('debería calificar consulta con calificación mínima', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 2,
          calificacion: 1,
        },
        user: { id: 2 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 2,
        calificacion: 1,
        estado: 'FINALIZADA',
      };

      mockCalificarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(mockCalificarConsulta).toHaveBeenCalledWith(2, 2, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });

    it('debería calificar consulta con calificación máxima', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 3,
          calificacion: 10,
        },
        user: { id: 3 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 3,
        calificacion: 10,
        estado: 'FINALIZADA',
      };

      mockCalificarConsulta.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(mockCalificarConsulta).toHaveBeenCalledWith(3, 3, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });
  });

  describe('calificarConsulta - Casos Límite', () => {
    it('debería manejar error de calificación fuera de rango (menor a 1)', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 1,
          calificacion: 0,
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('La calificación debe ser un número entre 1 y 10');
      mockCalificarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'La calificación debe ser un número entre 1 y 10' });
    });

    it('debería manejar error de calificación fuera de rango (mayor a 10)', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 1,
          calificacion: 11,
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('La calificación debe ser un número entre 1 y 10');
      mockCalificarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'La calificación debe ser un número entre 1 y 10' });
    });

    it('debería manejar error cuando consulta no existe', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 999,
          calificacion: 8,
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Consulta no encontrada');
      mockCalificarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Consulta no encontrada' });
    });

    it('debería manejar error cuando consulta no está finalizada', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 1,
          calificacion: 8,
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Solo se pueden calificar consultas finalizadas');
      mockCalificarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Solo se pueden calificar consultas finalizadas' });
    });

    it('debería manejar error cuando consulta ya fue calificada', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 1,
          calificacion: 8,
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('La consulta ya fue calificada');
      mockCalificarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'La consulta ya fue calificada' });
    });
  });

  describe('calificarConsulta - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        body: {
          id_consulta: 1,
          calificacion: 8,
        },
        user: { id: 1 },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error interno del servidor');
      mockCalificarConsulta.mockRejectedValue(error);

      // Act
      await ConsultaController.calificarConsulta(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error interno del servidor' });
    });
  });

  describe('obtenerConsultaPorIdCita - Casos Normales', () => {
    it('debería obtener consulta por id de cita exitosamente', async () => {
      // Arrange
      const req = {
        params: { idCita: '1' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockConsulta = {
        id_consulta: 1,
        id_cita: 1,
        motivo: 'Consulta de rutina',
        estado: 'INICIADO',
        Cita: {
          id_cita: 1,
          id_paciente: 1,
          id_horario: 1,
          modalidad: 'PRESENCIAL',
          estado: 'CONFIRMADA',
        },
      };

      mockObtenerConsultaPorIdCita.mockResolvedValue(mockConsulta);

      // Act
      await ConsultaController.obtenerConsultaPorIdCita(req, res);

      // Assert
      expect(mockObtenerConsultaPorIdCita).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockConsulta });
    });
  });

  describe('obtenerConsultaPorIdCita - Casos Límite', () => {
    it('debería manejar error cuando idCita no es un número válido', async () => {
      // Arrange
      const req = {
        params: { idCita: 'invalid' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      // Act
      await ConsultaController.obtenerConsultaPorIdCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'ID de cita inválido' });
    });

    it('debería manejar error cuando idCita es NaN', async () => {
      // Arrange
      const req = {
        params: { idCita: 'abc' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      // Act
      await ConsultaController.obtenerConsultaPorIdCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'ID de cita inválido' });
    });

    it('debería manejar error cuando no existe consulta para la cita', async () => {
      // Arrange
      const req = {
        params: { idCita: '999' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Consulta no encontrada para la cita proporcionada');
      mockObtenerConsultaPorIdCita.mockRejectedValue(error);

      // Act
      await ConsultaController.obtenerConsultaPorIdCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Consulta no encontrada para la cita proporcionada' });
    });
  });

  describe('obtenerConsultaPorIdCita - Casos de Excepción', () => {
    it('debería manejar error interno del servidor', async () => {
      // Arrange
      const req = {
        params: { idCita: '1' },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const error = new Error('Error interno del servidor');
      mockObtenerConsultaPorIdCita.mockRejectedValue(error);

      // Act
      await ConsultaController.obtenerConsultaPorIdCita(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error interno del servidor' });
    });
  });
});