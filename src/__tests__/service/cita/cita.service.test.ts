// Mock de las dependencias
jest.mock('../../../model/cita.model', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../../../model/horario.model', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../../../model/medico.model', () => ({
  Medico: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../model/usuario.model', () => ({
  Usuario: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../model/paciente.model', () => ({
  Paciente: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../model/Consulta', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock('../../../config/database', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

// Importar después de los mocks
import CitaService from '../../../service/CitaService';
import Cita from '../../../model/cita.model';
import Horario from '../../../model/horario.model';
import { Medico } from '../../../model/medico.model';
import { Usuario } from '../../../model/usuario.model';
import { Paciente } from '../../../model/paciente.model';
import Consulta from '../../../model/Consulta';
import { sequelize } from '../../../config/database';

// Crear mocks manualmente para los métodos de Sequelize
let mockCitaFindOne: jest.MockedFunction<any>;
let mockCitaFindByPk: jest.MockedFunction<any>;
let mockCitaFindAll: jest.MockedFunction<any>;
let mockCitaCreate: jest.MockedFunction<any>;
let mockCitaUpdate: jest.MockedFunction<any>;
let mockHorarioFindOne: jest.MockedFunction<any>;
let mockHorarioFindByPk: jest.MockedFunction<any>;
let mockHorarioCreate: jest.MockedFunction<any>;
let mockHorarioUpdate: jest.MockedFunction<any>;
let mockConsultaFindOne: jest.MockedFunction<any>;
let mockConsultaFindAll: jest.MockedFunction<any>;
let mockSequelizeTransaction: jest.MockedFunction<any>;

// Asignar referencias después de los mocks
beforeAll(() => {
  const citaModel = require('../../../model/cita.model');
  mockCitaFindOne = citaModel.findOne;
  mockCitaFindByPk = citaModel.findByPk;
  mockCitaFindAll = citaModel.findAll;
  mockCitaCreate = citaModel.create;
  mockCitaUpdate = citaModel.update;

  const horarioModel = require('../../../model/horario.model');
  mockHorarioFindOne = horarioModel.findOne;
  mockHorarioFindByPk = horarioModel.findByPk;
  mockHorarioCreate = horarioModel.create;
  mockHorarioUpdate = horarioModel.update;

  const consultaModel = require('../../../model/Consulta');
  mockConsultaFindOne = consultaModel.findOne;
  mockConsultaFindAll = consultaModel.findAll;

  const database = require('../../../config/database');
  mockSequelizeTransaction = database.sequelize.transaction;
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

describe('CitaService - Tests Completos', () => {

  describe('crearCitaConHorario - Casos Normales', () => {
    it('debería crear cita exitosamente usando horario existente disponible', async () => {
      // Arrange
      const idPaciente = 1;
      const data = {
        idHorario: 1,
        idMedico: 1,
        titulo: 'Consulta General',
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: 1,
        titulo: 'Consulta General',
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
        estado: 'DISPONIBLE',
        update: jest.fn(),
      };

      const mockCitaCreada = {
        id_cita: 1,
        id_paciente: idPaciente,
        id_horario: 1,
        fecha_cita: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
        estado: 'PENDIENTE',
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

      mockHorarioFindOne.mockResolvedValue(mockHorario);
      mockCitaFindOne.mockResolvedValue(null);
      mockCitaCreate.mockResolvedValue(mockCitaCreada);

      // Act
      const result = await CitaService.crearCitaConHorario(idPaciente, data);

      // Assert
      expect(result).toEqual(mockCitaCreada);
      expect(mockHorarioFindOne).toHaveBeenCalledWith({
        where: { id_horario: 1, estado: 'DISPONIBLE', modalidad: 'PRESENCIAL' },
        transaction: mockTransaction,
      });
      expect(mockHorario.update).toHaveBeenCalledWith(
        { estado: 'OCUPADO', titulo: 'Consulta General' },
        { transaction: mockTransaction }
      );
      expect(mockCitaFindOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id_horario: 1
          }),
          transaction: mockTransaction,
        })
      );
      expect(mockCitaCreate).toHaveBeenCalledWith(
        {
          id_paciente: idPaciente,
          id_horario: 1,
          fecha_cita: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          fecha_registro: expect.any(Date),
          fecha_actualizacion: expect.any(Date),
        },
        { transaction: mockTransaction }
      );
    });

    it('debería crear cita exitosamente creando nuevo horario', async () => {
      // Arrange
      const idPaciente = 2;
      const data = {
        idMedico: 2,
        titulo: 'Consulta Especializada',
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL' as const,
      };

      const mockHorarioCreado = {
        id_horario: 2,
        id_medico: 2,
        titulo: 'Consulta Especializada',
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
        estado: 'OCUPADO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockCitaCreada = {
        id_cita: 2,
        id_paciente: idPaciente,
        id_horario: 2,
        fecha_cita: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
        estado: 'PENDIENTE',
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

      mockHorarioFindOne.mockResolvedValue(null); // No existe horario
      mockHorarioCreate.mockResolvedValue(mockHorarioCreado);
      mockCitaFindOne.mockResolvedValue(null);
      mockCitaCreate.mockResolvedValue(mockCitaCreada);

      // Act
      const result = await CitaService.crearCitaConHorario(idPaciente, data);

      // Assert
      expect(result).toEqual(mockCitaCreada);
      expect(mockHorarioFindOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id_medico: 2,
            fecha: '2024-12-02'
          }),
          transaction: mockTransaction,
        })
      );
      expect(mockHorarioCreate).toHaveBeenCalledWith(
        {
          id_medico: 2,
          titulo: 'Consulta Especializada',
          fecha: '2024-12-02',
          hora_inicio: '14:00:00',
          hora_fin: '15:00:00',
          modalidad: 'VIRTUAL',
          estado: 'OCUPADO',
          fecha_registro: expect.any(Date),
          fecha_actualizacion: expect.any(Date),
        },
        { transaction: mockTransaction }
      );
    });
  });

  describe('crearCitaConHorario - Casos Límite', () => {
    it('debería lanzar error cuando horario seleccionado no está disponible', async () => {
      // Arrange
      const idPaciente = 1;
      const data = {
        idHorario: 1,
        idMedico: 1,
        titulo: 'Consulta General',
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockHorarioFindOne.mockResolvedValue(null); // Horario no disponible

      // Act & Assert
      await expect(CitaService.crearCitaConHorario(idPaciente, data)).rejects.toThrow('El horario seleccionado no está disponible');
    });

    it('debería lanzar error cuando ya existe horario en la misma fecha y hora', async () => {
      // Arrange
      const idPaciente = 2;
      const data = {
        idMedico: 2,
        titulo: 'Consulta Duplicada',
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL' as const,
      };

      const mockHorarioExistente = {
        id_horario: 3,
        id_medico: 2,
        fecha: '2024-12-02',
        hora_inicio: '13:30:00',
        hora_fin: '14:30:00',
        estado: 'OCUPADO',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockHorarioFindOne.mockResolvedValue(mockHorarioExistente); // Conflicto de horario

      // Act & Assert
      await expect(CitaService.crearCitaConHorario(idPaciente, data)).rejects.toThrow('Ya existe un horario en esa fecha y hora');
    });

    it('debería lanzar error cuando ya existe cita activa para el horario', async () => {
      // Arrange
      const idPaciente = 1;
      const data = {
        idHorario: 1,
        idMedico: 1,
        titulo: 'Consulta General',
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockHorario = {
        id_horario: 1,
        id_medico: 1,
        titulo: 'Consulta General',
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL',
        estado: 'DISPONIBLE',
        update: jest.fn(),
      };

      const mockCitaExistente = {
        id_cita: 2,
        id_horario: 1,
        estado: 'PENDIENTE',
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockHorarioFindOne.mockResolvedValue(mockHorario);
      mockCitaFindOne.mockResolvedValue(mockCitaExistente); // Cita activa existente

      // Act & Assert
      await expect(CitaService.crearCitaConHorario(idPaciente, data)).rejects.toThrow('Ya existe una cita activa para ese horario');
    });

    it('debería manejar creación de horario ignorando horarios cancelados', async () => {
      // Arrange
      const idPaciente = 2;
      const data = {
        idMedico: 2,
        titulo: 'Consulta Nueva',
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL' as const,
      };

      const mockHorarioCancelado = {
        id_horario: 3,
        id_medico: 2,
        fecha: '2024-12-02',
        hora_inicio: '13:30:00',
        hora_fin: '14:30:00',
        estado: 'CANCELADO', // Cancelado, debe ser ignorado
      };

      const mockHorarioCreado = {
        id_horario: 4,
        id_medico: 2,
        titulo: 'Consulta Nueva',
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
        estado: 'OCUPADO',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      const mockCitaCreada = {
        id_cita: 3,
        id_paciente: idPaciente,
        id_horario: 4,
        fecha_cita: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL',
        estado: 'PENDIENTE',
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

      mockHorarioFindOne.mockResolvedValue(null); // No hay conflicto (cancelado se ignora)
      mockHorarioCreate.mockResolvedValue(mockHorarioCreado);
      mockCitaFindOne.mockResolvedValue(null);
      mockCitaCreate.mockResolvedValue(mockCitaCreada);

      // Act
      const result = await CitaService.crearCitaConHorario(idPaciente, data);

      // Assert
      expect(result).toEqual(mockCitaCreada);
      expect(mockHorarioCreate).toHaveBeenCalled();
    });
  });

  describe('crearCitaConHorario - Casos de Excepción', () => {
    it('debería manejar error de transacción', async () => {
      // Arrange
      const idPaciente = 1;
      const data = {
        idHorario: 1,
        idMedico: 1,
        titulo: 'Consulta Error',
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const transactionError = new Error('Error en transacción de base de datos');

      mockSequelizeTransaction.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(CitaService.crearCitaConHorario(idPaciente, data)).rejects.toThrow('Error en transacción de base de datos');
    });

    it('debería manejar error al crear horario', async () => {
      // Arrange
      const idPaciente = 2;
      const data = {
        idMedico: 2,
        titulo: 'Consulta Error',
        fecha: '2024-12-02',
        hora_inicio: '14:00:00',
        hora_fin: '15:00:00',
        modalidad: 'VIRTUAL' as const,
      };

      const dbError = new Error('Error al crear horario');

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockHorarioFindOne.mockResolvedValue(null);
      mockHorarioCreate.mockRejectedValue(dbError);

      // Act & Assert
      await expect(CitaService.crearCitaConHorario(idPaciente, data)).rejects.toThrow('Error al crear horario');
    });
  });

  describe('obtenerCitasPorPaciente - Casos Normales', () => {
    it('debería obtener citas del paciente exitosamente', async () => {
      // Arrange
      const idPaciente = 1;

      const mockCitas = [
        {
          id_cita: 1,
          estado: 'PENDIENTE',
          modalidad: 'PRESENCIAL',
          fecha_registro: new Date(),
          fecha_actualizacion: new Date(),
          horario: {
            id_horario: 1,
            titulo: 'Consulta General',
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
            estado: 'OCUPADO',
            medico: {
              id_medico: 1,
              nro_colegiatura: '12345',
              anios_experiencia: 5,
              calificacion_promedio: 4.5,
              usuario: {
                id_usuario: 1,
                nombre: 'Dr. Juan',
                paterno: 'Pérez',
                materno: 'García',
              },
            },
          },
          consulta: {
            id_consulta: 1,
            calificacion: 5,
            estado: 'FINALIZADA',
          },
        },
      ];

      mockCitaFindAll.mockResolvedValue(mockCitas);

      // Act
      const result = await CitaService.obtenerCitasPorPaciente(idPaciente);

      // Assert
      expect(result).toEqual(mockCitas);
      expect(mockCitaFindAll).toHaveBeenCalledWith({
        where: { id_paciente: idPaciente },
        include: expect.any(Array),
        attributes: expect.any(Array),
        order: [['fecha_registro', 'DESC']],
      });
    });

    it('debería retornar array vacío cuando paciente no tiene citas', async () => {
      // Arrange
      const idPaciente = 999;

      mockCitaFindAll.mockResolvedValue([]);

      // Act
      const result = await CitaService.obtenerCitasPorPaciente(idPaciente);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('obtenerCitasPorPaciente - Casos de Excepción', () => {
    it('debería manejar error de base de datos', async () => {
      // Arrange
      const idPaciente = 1;

      const dbError = new Error('Error de conexión a la base de datos');

      mockCitaFindAll.mockRejectedValue(dbError);

      // Act & Assert
      await expect(CitaService.obtenerCitasPorPaciente(idPaciente)).rejects.toThrow('Error al obtener las citas del paciente: Error: Error de conexión a la base de datos');
    });
  });

  describe('obtenerCitasPorMedico - Casos Normales', () => {
    it('debería obtener citas del médico exitosamente', async () => {
      // Arrange
      const idMedico = 1;

      const mockCitas = [
        {
          id_cita: 1,
          id_paciente: 1,
          estado: 'CONFIRMADA',
          modalidad: 'PRESENCIAL',
          fecha_registro: new Date(),
          fecha_actualizacion: new Date(),
          horario: {
            id_horario: 1,
            titulo: 'Consulta General',
            fecha: '2024-12-01',
            hora_inicio: '09:00:00',
            hora_fin: '10:00:00',
            modalidad: 'PRESENCIAL',
            estado: 'OCUPADO',
            medico: {
              id_medico: 1,
              usuario: {
                id_usuario: 1,
                nombre: 'Dr. Juan',
                paterno: 'Pérez',
                materno: 'García',
              },
            },
          },
          paciente: {
            id_paciente: 1,
            usuario: {
              id_usuario: 2,
              nombre: 'María',
              paterno: 'López',
              materno: 'Rodríguez',
            },
          },
          consulta: {
            id_consulta: 1,
            calificacion: 4,
            estado: 'FINALIZADA',
          },
        },
      ];

      mockCitaFindAll.mockResolvedValue(mockCitas);

      // Act
      const result = await CitaService.obtenerCitasPorMedico(idMedico);

      // Assert
      expect(result).toEqual(mockCitas);
      expect(mockCitaFindAll).toHaveBeenCalledWith({
        include: expect.any(Array),
        attributes: expect.any(Array),
        order: [['fecha_registro', 'DESC']],
      });
    });
  });

  describe('obtenerCitasPorMedico - Casos de Excepción', () => {
    it('debería manejar error de base de datos', async () => {
      // Arrange
      const idMedico = 1;

      const dbError = new Error('Error de conexión a la base de datos');

      mockCitaFindAll.mockRejectedValue(dbError);

      // Act & Assert
      await expect(CitaService.obtenerCitasPorMedico(idMedico)).rejects.toThrow('Error al obtener las citas del médico: Error: Error de conexión a la base de datos');
    });
  });

  describe('eliminarCita - Casos Normales', () => {
    it('debería eliminar cita exitosamente y liberar horario', async () => {
      // Arrange
      const idCita = 1;
      const idPaciente = 1;

      const mockCita = {
        id_cita: idCita,
        id_paciente: idPaciente,
        estado: 'PENDIENTE',
        id_horario: 1,
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 1,
        estado: 'OCUPADO',
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act
      const result = await CitaService.eliminarCita(idCita, idPaciente);

      // Assert
      expect(result).toEqual({ id_cita: idCita, estado: 'CANCELADA' });
      expect(mockCita.update).toHaveBeenCalledWith(
        { estado: 'CANCELADA', fecha_actualizacion: expect.any(Date) },
        { transaction: mockTransaction }
      );
      expect(mockHorario.update).toHaveBeenCalledWith(
        { estado: 'DISPONIBLE', fecha_actualizacion: expect.any(Date) },
        { transaction: mockTransaction }
      );
    });

    it('debería eliminar cita sin liberar horario si no estaba ocupado', async () => {
      // Arrange
      const idCita = 2;
      const idPaciente = 2;

      const mockCita = {
        id_cita: idCita,
        id_paciente: idPaciente,
        estado: 'PENDIENTE',
        id_horario: 2,
        update: jest.fn(),
      };

      const mockHorario = {
        id_horario: 2,
        estado: 'DISPONIBLE', // No estaba ocupado
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(mockHorario);

      // Act
      const result = await CitaService.eliminarCita(idCita, idPaciente);

      // Assert
      expect(result).toEqual({ id_cita: idCita, estado: 'CANCELADA' });
      expect(mockCita.update).toHaveBeenCalledWith(
        { estado: 'CANCELADA', fecha_actualizacion: expect.any(Date) },
        { transaction: mockTransaction }
      );
      expect(mockHorario.update).not.toHaveBeenCalled(); // No se libera porque no estaba ocupado
    });
  });

  describe('eliminarCita - Casos Límite', () => {
    it('debería lanzar error cuando cita no existe', async () => {
      // Arrange
      const idCita = 999;
      const idPaciente = 1;

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(CitaService.eliminarCita(idCita, idPaciente)).rejects.toThrow('Cita no encontrada');
    });

    it('debería lanzar error cuando cita pertenece a otro paciente', async () => {
      // Arrange
      const idCita = 1;
      const idPaciente = 1;

      const mockCita = {
        id_cita: idCita,
        id_paciente: 2, // Otro paciente
        estado: 'PENDIENTE',
        id_horario: 1,
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindByPk.mockResolvedValue(mockCita);

      // Act & Assert
      await expect(CitaService.eliminarCita(idCita, idPaciente)).rejects.toThrow('No puedes eliminar una cita que no te pertenece');
    });

    it('debería lanzar error cuando horario asociado no existe', async () => {
      // Arrange
      const idCita = 1;
      const idPaciente = 1;

      const mockCita = {
        id_cita: idCita,
        id_paciente: idPaciente,
        estado: 'PENDIENTE',
        id_horario: 1,
        update: jest.fn(),
      };

      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransaction);
      });

      mockCitaFindByPk.mockResolvedValue(mockCita);
      mockHorarioFindByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(CitaService.eliminarCita(idCita, idPaciente)).rejects.toThrow('Horario asociado a la cita no encontrado');
    });
  });

  describe('eliminarCita - Casos de Excepción', () => {
    it('debería manejar error de transacción', async () => {
      // Arrange
      const idCita = 1;
      const idPaciente = 1;

      const transactionError = new Error('Error en transacción de base de datos');

      mockSequelizeTransaction.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(CitaService.eliminarCita(idCita, idPaciente)).rejects.toThrow('Error en transacción de base de datos');
    });
  });
});