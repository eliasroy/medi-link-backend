// Mock de las dependencias
jest.mock('../../../model/Consulta', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../../../model/cita.model', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../../../model/horario.model', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../../../config/database', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

// Importar después de los mocks
import ConsultaService from '../../../service/ConsultaService';
import Consulta from '../../../model/Consulta';
import Cita from '../../../model/cita.model';
import Horario from '../../../model/horario.model';
import { sequelize } from '../../../config/database';

// Crear mocks manualmente para los métodos de Sequelize
let mockConsultaFindOne: jest.MockedFunction<any>;
let mockConsultaFindByPk: jest.MockedFunction<any>;
let mockConsultaCreate: jest.MockedFunction<any>;
let mockConsultaUpdate: jest.MockedFunction<any>;
let mockCitaFindOne: jest.MockedFunction<any>;
let mockCitaFindByPk: jest.MockedFunction<any>;
let mockCitaUpdate: jest.MockedFunction<any>;
let mockHorarioFindOne: jest.MockedFunction<any>;
let mockHorarioFindByPk: jest.MockedFunction<any>;
let mockHorarioUpdate: jest.MockedFunction<any>;
let mockSequelizeTransaction: jest.MockedFunction<any>;

// Asignar referencias después de los mocks
beforeAll(() => {
  const consultaModel = require('../../../model/Consulta');
  mockConsultaFindOne = consultaModel.findOne;
  mockConsultaFindByPk = consultaModel.findByPk;
  mockConsultaCreate = consultaModel.create;
  mockConsultaUpdate = consultaModel.update;

  const citaModel = require('../../../model/cita.model');
  mockCitaFindOne = citaModel.findOne;
  mockCitaFindByPk = citaModel.findByPk;
  mockCitaUpdate = citaModel.update;

  const horarioModel = require('../../../model/horario.model');
  mockHorarioFindOne = horarioModel.findOne;
  mockHorarioFindByPk = horarioModel.findByPk;
  mockHorarioUpdate = horarioModel.update;

  const database = require('../../../config/database');
  mockSequelizeTransaction = database.sequelize.transaction;
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

describe('ConsultaService - Tests Completos', () => {

  describe('iniciarConsulta - Casos Normales', () => {
    it('debería iniciar consulta exitosamente para cita presencial', async () => {
      // Arrange
      const idCita = 1;
      const motivo = 'Consulta de rutina';
      const idMedico = 1;

      const mockCita = {
        id_cita: idCita,
        id_horario: 1,
        estado: 'PENDIENTE',
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockConsultaCreada = {
        id_consulta: 1,
        id_cita: idCita,
        motivo,
        estado: 'INICIADO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(mockCita);
      mockHorarioFindOne.mockResolvedValue(mockHorario);
      mockConsultaFindOne.mockResolvedValue(null);
      mockConsultaCreate.mockResolvedValue(mockConsultaCreada);

      // Act
      const result = await ConsultaService.iniciarConsulta(idCita, motivo, idMedico);

      // Assert
      expect(result).toEqual(mockConsultaCreada);
      expect(mockCitaFindOne).toHaveBeenCalledWith({ where: { id_cita: idCita }, transaction: mockTransaction });
      expect(mockHorarioFindOne).toHaveBeenCalledWith({ where: { id_horario: 1 }, transaction: mockTransaction });
      expect(mockConsultaFindOne).toHaveBeenCalledWith({ where: { id_cita: idCita }, transaction: mockTransaction });
      expect(mockConsultaCreate).toHaveBeenCalledWith(
        {
          id_cita: idCita,
          motivo,
          estado: 'INICIADO',
          fecha_registro: expect.any(Date),
          fecha_actualizacion: expect.any(Date),
        },
        { transaction: mockTransaction }
      );
      expect(mockCita.update).toHaveBeenCalledWith({ estado: 'CONFIRMADA' }, { transaction: mockTransaction });
    });

    it('debería iniciar consulta exitosamente para cita virtual', async () => {
      // Arrange
      const idCita = 2;
      const motivo = 'Consulta virtual de seguimiento';
      const idMedico = 2;

      const mockCita = {
        id_cita: idCita,
        id_horario: 2,
        estado: 'PENDIENTE',
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 2,
        id_medico: idMedico,
        modalidad: 'VIRTUAL',
      };

      const mockConsultaCreada = {
        id_consulta: 2,
        id_cita: idCita,
        motivo,
        estado: 'INICIADO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(mockCita);
      mockHorarioFindOne.mockResolvedValue(mockHorario);
      mockConsultaFindOne.mockResolvedValue(null);
      mockConsultaCreate.mockResolvedValue(mockConsultaCreada);

      // Act
      const result = await ConsultaService.iniciarConsulta(idCita, motivo, idMedico);

      // Assert
      expect(result).toEqual(mockConsultaCreada);
      expect(mockHorarioFindOne).toHaveBeenCalledWith({ where: { id_horario: 2 }, transaction: mockTransaction });
    });
  });

  describe('iniciarConsulta - Casos Límite', () => {
    it('debería lanzar error cuando cita no existe', async () => {
      // Arrange
      const idCita = 999;
      const motivo = 'Consulta inexistente';
      const idMedico = 1;

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(null);

      // Act & Assert
      await expect(ConsultaService.iniciarConsulta(idCita, motivo, idMedico)).rejects.toThrow('Cita no encontrada');
    });

    it('debería lanzar error cuando horario de la cita no existe', async () => {
      // Arrange
      const idCita = 1;
      const motivo = 'Consulta sin horario';
      const idMedico = 1;

      const mockCita = {
        id_cita: idCita,
        id_horario: null,
        estado: 'PENDIENTE',
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(mockCita);

      // Act & Assert
      await expect(ConsultaService.iniciarConsulta(idCita, motivo, idMedico)).rejects.toThrow('Horario de la cita no encontrado');
    });

    it('debería lanzar error cuando horario pertenece a otro médico', async () => {
      // Arrange
      const idCita = 1;
      const motivo = 'Consulta de otro médico';
      const idMedico = 1;

      const mockCita = {
        id_cita: idCita,
        id_horario: 1,
        estado: 'PENDIENTE',
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: 2, // Otro médico
        modalidad: 'PRESENCIAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(mockCita);
      mockHorarioFindOne.mockResolvedValue(mockHorario);

      // Act & Assert
      await expect(ConsultaService.iniciarConsulta(idCita, motivo, idMedico)).rejects.toThrow('No puedes iniciar una consulta que no te pertenece');
    });

    it('debería lanzar error cuando consulta ya fue iniciada', async () => {
      // Arrange
      const idCita = 1;
      const motivo = 'Consulta duplicada';
      const idMedico = 1;

      const mockCita = {
        id_cita: idCita,
        id_horario: 1,
        estado: 'PENDIENTE',
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockConsultaExistente = {
        id_consulta: 1,
        id_cita: idCita,
        estado: 'INICIADO',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(mockCita);
      mockHorarioFindOne.mockResolvedValue(mockHorario);
      mockConsultaFindOne.mockResolvedValue(mockConsultaExistente);

      // Act & Assert
      await expect(ConsultaService.iniciarConsulta(idCita, motivo, idMedico)).rejects.toThrow('La consulta para esta cita ya fue iniciada');
    });

    it('debería manejar motivo vacío', async () => {
      // Arrange
      const idCita = 1;
      const motivo = '';
      const idMedico = 1;

      const mockCita = {
        id_cita: idCita,
        id_horario: 1,
        estado: 'PENDIENTE',
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockConsultaCreada = {
        id_consulta: 1,
        id_cita: idCita,
        motivo,
        estado: 'INICIADO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(mockCita);
      mockHorarioFindOne.mockResolvedValue(mockHorario);
      mockConsultaFindOne.mockResolvedValue(null);
      mockConsultaCreate.mockResolvedValue(mockConsultaCreada);

      // Act
      const result = await ConsultaService.iniciarConsulta(idCita, motivo, idMedico);

      // Assert
      expect(result).toEqual(mockConsultaCreada);
    });
  });

  describe('iniciarConsulta - Casos de Excepción', () => {
    it('debería manejar error de base de datos en búsqueda de cita', async () => {
      // Arrange
      const idCita = 1;
      const motivo = 'Error en DB';
      const idMedico = 1;

      const dbError = new Error('Error de conexión a la base de datos');

      mockSequelizeTransaction.mockRejectedValue(dbError);

      // Act & Assert
      await expect(ConsultaService.iniciarConsulta(idCita, motivo, idMedico)).rejects.toThrow('Error de conexión a la base de datos');
    });

    it('debería manejar error de base de datos en creación de consulta', async () => {
      // Arrange
      const idCita = 1;
      const motivo = 'Error en creación';
      const idMedico = 1;

      const mockCita = {
        id_cita: idCita,
        id_horario: 1,
        estado: 'PENDIENTE',
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const dbError = new Error('Error al insertar consulta');

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindOne.mockResolvedValue(mockCita);
      mockHorarioFindOne.mockResolvedValue(mockHorario);
      mockConsultaFindOne.mockResolvedValue(null);
      mockConsultaCreate.mockRejectedValue(dbError);

      // Act & Assert
      await expect(ConsultaService.iniciarConsulta(idCita, motivo, idMedico)).rejects.toThrow('Error al insertar consulta');
    });
  });

  describe('actualizarConsulta - Casos Normales', () => {
    it('debería actualizar consulta presencial a EN_REVISION exitosamente', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        diagnostico: 'Diagnóstico inicial',
        estado: 'EN_REVISION' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_horario: 1,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act
      const result = await ConsultaService.actualizarConsulta(idConsulta, idMedico, data);

      // Assert
      expect(result).toEqual(mockConsulta);
      expect(mockConsulta.update).toHaveBeenCalledWith(
        {
          ...data,
          fecha_actualizacion: expect.any(Date),
        },
        { transaction: mockTransaction }
      );
    });

    it('debería actualizar consulta virtual a FINALIZADA exitosamente', async () => {
      // Arrange
      const idConsulta = 2;
      const idMedico = 2;
      const data = {
        diagnostico: 'Diagnóstico final',
        tratamiento: 'Tratamiento recomendado',
        estado: 'FINALIZADA' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 2,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 2,
        id_horario: 2,
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 2,
        id_medico: idMedico,
        modalidad: 'VIRTUAL',
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act
      const result = await ConsultaService.actualizarConsulta(idConsulta, idMedico, data);

      // Assert
      expect(result).toEqual(mockConsulta);
      expect(mockHorario.update).toHaveBeenCalledWith({ estado: 'FINALIZADA' }, { transaction: mockTransaction });
      expect(mockCita.update).toHaveBeenCalledWith({ estado: 'ATENDIDA' }, { transaction: mockTransaction });
    });

    it('debería actualizar consulta con todos los campos opcionales', async () => {
      // Arrange
      const idConsulta = 3;
      const idMedico = 3;
      const data = {
        diagnostico: 'Diagnóstico completo',
        pathArchivo: '/path/to/file.pdf',
        tratamiento: 'Tratamiento detallado',
        observaciones: 'Observaciones adicionales',
        calificacion: 8,
        estado: 'DIAGNOSTICADA' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 3,
        estado: 'EN_REVISION',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 3,
        id_horario: 3,
      };

      const mockHorario = {
        id_horario: 3,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act
      const result = await ConsultaService.actualizarConsulta(idConsulta, idMedico, data);

      // Assert
      expect(result).toEqual(mockConsulta);
      expect(mockConsulta.update).toHaveBeenCalledWith(
        {
          ...data,
          fecha_actualizacion: expect.any(Date),
        },
        { transaction: mockTransaction }
      );
    });
  });

  describe('actualizarConsulta - Casos Límite', () => {
    it('debería lanzar error cuando consulta no existe', async () => {
      // Arrange
      const idConsulta = 999;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('Consulta no encontrada');
    });

    it('debería lanzar error cuando consulta ya está finalizada', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        diagnostico: 'Nuevo diagnóstico',
        estado: 'EN_REVISION' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'FINALIZADA',
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('La consulta ya está finalizada y no puede actualizarse');
    });

    it('debería lanzar error cuando cita no existe', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('Cita no encontrada');
    });

    it('debería lanzar error cuando horario no existe', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_horario: 1,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('Horario de la cita no encontrado');
    });

    it('debería lanzar error cuando horario pertenece a otro médico', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_horario: 1,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: 2, // Otro médico
        modalidad: 'PRESENCIAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('No puedes actualizar una consulta que no te pertenece');
    });

    it('debería lanzar error cuando estado inválido para consulta virtual', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const, // Inválido para virtual
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_horario: 1,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'VIRTUAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('Las consultas virtuales solo pueden pasar a FINALIZADA');
    });

    it('debería lanzar error cuando estado inválido para consulta presencial', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'INVALIDO' as any,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_horario: 1,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('Estado inválido para consulta presencial');
    });

    it('debería manejar actualización con campos opcionales faltantes', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const,
        // Sin campos opcionales
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_horario: 1,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act
      const result = await ConsultaService.actualizarConsulta(idConsulta, idMedico, data);

      // Assert
      expect(result).toEqual(mockConsulta);
      expect(mockConsulta.update).toHaveBeenCalledWith(
        {
          estado: 'EN_REVISION',
          fecha_actualizacion: expect.any(Date),
        },
        { transaction: mockTransaction }
      );
    });
  });

  describe('actualizarConsulta - Casos de Excepción', () => {
    it('debería manejar error de transacción', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const,
      };

      const transactionError = new Error('Error en transacción de base de datos');

      mockSequelizeTransaction.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('Error en transacción de base de datos');
    });

    it('debería manejar error en actualización de consulta', async () => {
      // Arrange
      const idConsulta = 1;
      const idMedico = 1;
      const data = {
        estado: 'EN_REVISION' as const,
      };

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'INICIADO',
        update: jest.fn().mockRejectedValue(new Error('Error al actualizar')),
      };

      const mockCita = {
        id_cita: 1,
        id_horario: 1,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: idMedico,
        modalidad: 'PRESENCIAL',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act & Assert
      await expect(ConsultaService.actualizarConsulta(idConsulta, idMedico, data)).rejects.toThrow('Error al actualizar');
    });
  });

  describe('calificarConsulta - Casos Normales', () => {
    it('debería calificar consulta exitosamente', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 9;

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'FINALIZADA',
        calificacion: undefined,
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_paciente: idPaciente,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);

      // Act
      const result = await ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion);

      // Assert
      expect(result).toEqual(mockConsulta);
      expect(mockConsulta.update).toHaveBeenCalledWith(
        { calificacion, fecha_actualizacion: expect.any(Date) },
        { transaction: mockTransaction }
      );
    });

    it('debería calificar consulta con calificación mínima (1)', async () => {
      // Arrange
      const idConsulta = 2;
      const idPaciente = 2;
      const calificacion = 1;

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 2,
        estado: 'FINALIZADA',
        calificacion: undefined,
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 2,
        id_paciente: idPaciente,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);

      // Act
      const result = await ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion);

      // Assert
      expect(result).toEqual(mockConsulta);
    });

    it('debería calificar consulta con calificación máxima (10)', async () => {
      // Arrange
      const idConsulta = 3;
      const idPaciente = 3;
      const calificacion = 10;

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 3,
        estado: 'FINALIZADA',
        calificacion: undefined,
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 3,
        id_paciente: idPaciente,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);

      // Act
      const result = await ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion);

      // Assert
      expect(result).toEqual(mockConsulta);
    });
  });

  describe('calificarConsulta - Casos Límite', () => {
    it('debería lanzar error cuando calificación es menor a 1', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 0;

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('La calificación debe ser un número entre 1 y 10');
    });

    it('debería lanzar error cuando calificación es mayor a 10', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 11;

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('La calificación debe ser un número entre 1 y 10');
    });

    it('debería lanzar error cuando consulta no existe', async () => {
      // Arrange
      const idConsulta = 999;
      const idPaciente = 1;
      const calificacion = 8;

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('Consulta no encontrada');
    });

    it('debería lanzar error cuando consulta no está finalizada', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 8;

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'EN_REVISION', // No finalizada
        calificacion: undefined,
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('Solo se pueden calificar consultas finalizadas');
    });

    it('debería lanzar error cuando cita no existe', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 8;

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'FINALIZADA',
        calificacion: undefined,
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('Cita no encontrada');
    });

    it('debería lanzar error cuando cita pertenece a otro paciente', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 8;

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'FINALIZADA',
        calificacion: undefined,
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_paciente: 2, // Otro paciente
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('No puedes calificar una consulta que no te pertenece');
    });

    it('debería lanzar error cuando consulta ya fue calificada', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 8;

      const mockConsulta = {
        id_consulta: idConsulta,
        id_cita: 1,
        estado: 'FINALIZADA',
        calificacion: 7, // Ya calificada
        update: jest.fn(),
      };

      const mockCita = {
        id_cita: 1,
        id_paciente: idPaciente,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockConsultaFindByPk.mockResolvedValue(mockConsulta);
      mockCitaFindByPk.mockResolvedValue(mockCita);

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('La consulta ya fue calificada');
    });
  });

  describe('calificarConsulta - Casos de Excepción', () => {
    it('debería manejar error de transacción', async () => {
      // Arrange
      const idConsulta = 1;
      const idPaciente = 1;
      const calificacion = 8;

      const transactionError = new Error('Error en transacción de base de datos');

      mockSequelizeTransaction.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(ConsultaService.calificarConsulta(idConsulta, idPaciente, calificacion)).rejects.toThrow('Error en transacción de base de datos');
    });
  });

  describe('obtenerConsultaPorIdCita - Casos Normales', () => {
    it('debería obtener consulta por id de cita exitosamente', async () => {
      // Arrange
      const idCita = 1;

      const mockConsulta = {
        id_consulta: 1,
        id_cita: idCita,
        motivo: 'Consulta de rutina',
        estado: 'INICIADO',
        Cita: {
          id_cita: idCita,
          id_paciente: 1,
          id_horario: 1,
          modalidad: 'PRESENCIAL',
          estado: 'CONFIRMADA',
          fecha_registro: new Date(),
          fecha_actualizacion: new Date(),
        },
      };

      mockConsultaFindOne.mockResolvedValue(mockConsulta);

      // Act
      const result = await ConsultaService.obtenerConsultaPorIdCita(idCita);

      // Assert
      expect(result).toEqual(mockConsulta);
      expect(mockConsultaFindOne).toHaveBeenCalledWith({
        where: { id_cita: idCita },
        include: [
          {
            model: Cita,
            attributes: ['id_cita', 'id_paciente', 'id_horario', 'modalidad', 'estado', 'fecha_registro', 'fecha_actualizacion']
          }
        ]
      });
    });
  });

  describe('obtenerConsultaPorIdCita - Casos Límite', () => {
    it('debería lanzar error cuando no existe consulta para la cita', async () => {
      // Arrange
      const idCita = 999;

      mockConsultaFindOne.mockResolvedValue(null);

      // Act & Assert
      await expect(ConsultaService.obtenerConsultaPorIdCita(idCita)).rejects.toThrow('Consulta no encontrada para la cita proporcionada');
    });
  });

  describe('obtenerConsultaPorIdCita - Casos de Excepción', () => {
    it('debería manejar error de base de datos', async () => {
      // Arrange
      const idCita = 1;

      const dbError = new Error('Error al consultar consulta');

      mockConsultaFindOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(ConsultaService.obtenerConsultaPorIdCita(idCita)).rejects.toThrow('Error al consultar consulta');
    });
  });
});