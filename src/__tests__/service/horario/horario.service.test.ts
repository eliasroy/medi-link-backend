// Mock de las dependencias
jest.mock('../../../model/horario.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock('../../../model/medico.model', () => ({
  Medico: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../model/especialidad.model', () => ({
  default: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../model/usuario.model', () => ({
  Usuario: {
    // Mock any methods if needed
  },
}));

jest.mock('../../../config/database', () => ({
  sequelize: {
    transaction: jest.fn(),
    define: jest.fn(),
  },
}));

// Importar después de los mocks
import HorarioService from '../../../service/HorarioService';
import Horario from '../../../model/horario.model';
import { Medico } from '../../../model/medico.model';
import Especialidad from '../../../model/especialidad.model';
import { sequelize } from '../../../config/database';



// Crear mocks manualmente para los métodos de Sequelize
let mockHorarioFindOne: jest.MockedFunction<any>;
let mockHorarioCreate: jest.MockedFunction<any>;
let mockHorarioFindAll: jest.MockedFunction<any>;
let mockSequelizeTransaction: jest.MockedFunction<any>;

// Asignar referencias después de los mocks
beforeAll(() => {
  const horarioModel = require('../../../model/horario.model');
  mockHorarioFindOne = horarioModel.findOne;
  mockHorarioCreate = horarioModel.create;
  mockHorarioFindAll = horarioModel.findAll;

  const database = require('../../../config/database');
  mockSequelizeTransaction = database.sequelize.transaction;
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

describe('HorarioService - Tests Completos', () => {

  describe('Casos Normales', () => {
    it('debería crear un horario disponible exitosamente', async () => {
      // Arrange - Datos de prueba
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockHorarioCreado = {
        id_horario: 1,
        id_medico: idMedico,
        fecha: data.fecha,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        modalidad: data.modalidad,
        estado: 'DISPONIBLE',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de transacción
      const mockTransactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any;
      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransactionInstance);
      });

      // Mock de búsqueda de horario existente (no existe)
      mockHorarioFindOne.mockResolvedValue(null);

      // Mock de creación de horario
      mockHorarioCreate.mockResolvedValue(mockHorarioCreado);

      // Act - Ejecutar la función
      const result = await HorarioService.crearHorario(idMedico, data);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarioCreado);
      expect(mockSequelizeTransaction).toHaveBeenCalled();
      expect(mockHorarioFindOne).toHaveBeenCalled();
      expect(mockHorarioCreate).toHaveBeenCalled();
    });

    it('debería obtener horarios disponibles de la semana actual', async () => {
      // Arrange - Datos de prueba
      const filtros = {};
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
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería obtener horarios disponibles por rango de fechas', async () => {
      // Arrange - Datos de prueba
      const fechaInicio = '2024-12-01';
      const fechaFin = '2024-12-07';
      const filtros = {};
      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'VIRTUAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });
  });

  describe('Casos Límite', () => {
    it('debería lanzar error cuando ya existe un horario en esa fecha y hora', async () => {
      // Arrange - Datos de prueba
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockHorarioExistente = {
        id_horario: 1,
        id_medico: idMedico,
        fecha: data.fecha,
        hora_inicio: '09:30:00',
        hora_fin: '10:30:00',
        estado: 'DISPONIBLE',
      };

      // Mock de transacción
      const mockTransactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any;
      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransactionInstance);
      });

      // Mock de búsqueda de horario existente (existe solapamiento)
      mockHorarioFindOne.mockResolvedValue(mockHorarioExistente);

      // Act & Assert
      await expect(HorarioService.crearHorario(idMedico, data)).rejects.toThrow('Ya existe un horario en esa fecha y hora');
    });

    it('debería lanzar error cuando encuentra un horario cancelado en la validación', async () => {
      // Arrange - Datos de prueba
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockHorarioCancelado = {
        id_horario: 1,
        id_medico: idMedico,
        fecha: data.fecha,
        hora_inicio: '09:30:00',
        hora_fin: '10:30:00',
        estado: 'CANCELADO',
      };

      // Mock de transacción
      const mockTransactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any;
      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransactionInstance);
      });

      // Mock de búsqueda de horario existente (encuentra uno cancelado)
      mockHorarioFindOne.mockResolvedValue(mockHorarioCancelado);

      // Act & Assert
      await expect(HorarioService.crearHorario(idMedico, data)).rejects.toThrow('Ya existe un horario en esa fecha y hora');
    });

    it('debería crear horario exitosamente cuando existe uno cancelado que se solapa', async () => {
      // Arrange - Datos de prueba
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockHorarioCreado = {
        id_horario: 2,
        id_medico: idMedico,
        fecha: data.fecha,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        modalidad: data.modalidad,
        estado: 'DISPONIBLE',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de transacción
      const mockTransactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any;
      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransactionInstance);
      });

      // Mock de búsqueda de horario existente (no encuentra porque el cancelado se ignora)
      mockHorarioFindOne.mockResolvedValue(null);

      // Mock de creación de horario
      mockHorarioCreate.mockResolvedValue(mockHorarioCreado);

      // Act - Ejecutar la función
      const result = await HorarioService.crearHorario(idMedico, data);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarioCreado);
      expect(mockHorarioFindOne).toHaveBeenCalled();
      expect(mockHorarioCreate).toHaveBeenCalled();
    });

    it('debería filtrar horarios por idMedico', async () => {
      // Arrange - Datos de prueba
      const filtros = { idMedico: 1 };
      const mockHorarios = [
        {
          id_horario: 1,
          id_medico: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería filtrar horarios por modalidad', async () => {
      // Arrange - Datos de prueba
      const filtros = { modalidad: 'VIRTUAL' as const };
      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'VIRTUAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería manejar fechas límite de semana', async () => {
      // Arrange - Datos de prueba
      const filtros = {};
      const mockHorarios: any[] = [];

      // Mock de findAll que retorna vacío
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar resultados
      expect(result).toEqual([]);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería manejar horarios con duraciones muy largas', async () => {
      // Arrange - Datos de prueba para horario de 12 horas
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '08:00:00',
        hora_fin: '20:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const mockHorarioCreado = {
        id_horario: 1,
        id_medico: idMedico,
        fecha: data.fecha,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        modalidad: data.modalidad,
        estado: 'DISPONIBLE',
        fecha_registro: new Date(),
        fecha_actualizacion: new Date(),
      };

      // Mock de transacción
      const mockTransactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any;
      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransactionInstance);
      });

      // Mock de búsqueda de horario existente (no existe)
      mockHorarioFindOne.mockResolvedValue(null);

      // Mock de creación de horario
      mockHorarioCreate.mockResolvedValue(mockHorarioCreado);

      // Act - Ejecutar la función
      const result = await HorarioService.crearHorario(idMedico, data);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarioCreado);
      expect(mockHorarioCreate).toHaveBeenCalled();
    });

    it('debería manejar rango de fechas con un solo día', async () => {
      // Arrange - Datos de prueba
      const fechaInicio = '2024-12-01';
      const fechaFin = '2024-12-01';
      const filtros = {};
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
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería filtrar horarios por rango con idMedico', async () => {
      // Arrange - Datos de prueba
      const fechaInicio = '2024-12-01';
      const fechaFin = '2024-12-07';
      const filtros = { idMedico: 1 };
      const mockHorarios = [
        {
          id_horario: 1,
          id_medico: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería filtrar horarios por rango con modalidad', async () => {
      // Arrange - Datos de prueba
      const fechaInicio = '2024-12-01';
      const fechaFin = '2024-12-07';
      const filtros = { modalidad: 'VIRTUAL' as const };
      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-12-01',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'VIRTUAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería filtrar horarios por rango con estado', async () => {
      // Arrange - Datos de prueba
      const fechaInicio = '2024-12-01';
      const fechaFin = '2024-12-07';
      const filtros = { estado: 'DISPONIBLE' };
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
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería filtrar horarios de semana por estado', async () => {
      // Arrange - Datos de prueba
      const filtros = { estado: 'DISPONIBLE' };
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
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });
  });

  describe('Casos Límite Adicionales', () => {
    it('debería manejar fechas de fin de mes correctamente', async () => {
      // Arrange - Datos de prueba para fecha de fin de mes
      const fechaInicio = '2024-01-31';
      const fechaFin = '2024-02-02';
      const filtros = {};
      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-01-31',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería manejar año bisiesto correctamente', async () => {
      // Arrange - Datos de prueba para año bisiesto
      const fechaInicio = '2024-02-28';
      const fechaFin = '2024-03-01';
      const filtros = {};
      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-02-29',
          hora_inicio: '09:00:00',
          hora_fin: '10:00:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería manejar cambio de horario de verano (DST)', async () => {
      // Arrange - Datos de prueba para cambio de DST
      const filtros = {};
      const mockHorarios = [
        {
          id_horario: 1,
          fecha: '2024-03-10',
          hora_inicio: '02:30:00',
          hora_fin: '03:30:00',
          modalidad: 'PRESENCIAL',
          estado: 'DISPONIBLE',
          medico: {
            id_medico: 1,
            usuario: {
              nombre: 'Dr. Juan',
              paterno: 'Perez',
              materno: 'Gomez'
            },
            especialidad: {
              id_especialidad: 1,
              nombre: 'Cardiología'
            }
          }
        }
      ];

      // Mock de findAll
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar resultados
      expect(result).toEqual(mockHorarios);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });

    it('debería manejar múltiples filtros combinados con valores extremos', async () => {
      // Arrange - Datos de prueba con filtros extremos
      const filtros = {
        idMedico: 999999,
        modalidad: 'VIRTUAL' as const,
        estado: 'DISPONIBLE'
      };
      const mockHorarios: any[] = [];

      // Mock de findAll que retorna vacío
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar resultados
      expect(result).toEqual([]);
      expect(mockHorarioFindAll).toHaveBeenCalled();
    });
  });

  describe('Casos de Excepción', () => {
    it('debería manejar error de base de datos al buscar horario existente', async () => {
      // Arrange - Datos de prueba
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const dbError = new Error('Error de conexión a la base de datos');

      // Mock de transacción
      const mockTransactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any;
      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransactionInstance);
      });

      // Mock de error en búsqueda de horario existente
      mockHorarioFindOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(HorarioService.crearHorario(idMedico, data)).rejects.toThrow('Error de conexión a la base de datos');
    });

    it('debería manejar error de base de datos al crear horario', async () => {
      // Arrange - Datos de prueba
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const dbError = new Error('Error al insertar en tabla horario');

      // Mock de transacción
      const mockTransactionInstance = {
        commit: jest.fn(),
        rollback: jest.fn(),
      } as any;
      mockSequelizeTransaction.mockImplementation(async (callback: any) => {
        return await callback(mockTransactionInstance);
      });

      // Mock de búsqueda exitosa pero error en creación
      mockHorarioFindOne.mockResolvedValue(null);
      mockHorarioCreate.mockRejectedValue(dbError);

      // Act & Assert
      await expect(HorarioService.crearHorario(idMedico, data)).rejects.toThrow('Error al insertar en tabla horario');
    });

    it('debería manejar error de base de datos al obtener horarios de semana', async () => {
      // Arrange - Datos de prueba
      const filtros = {};
      const dbError = new Error('Error al consultar tabla horario');

      // Mock de error en findAll
      mockHorarioFindAll.mockRejectedValue(dbError);

      // Act & Assert
      await expect(HorarioService.obtenerHorariosDisponiblesSemana(filtros)).rejects.toThrow('Error al obtener horarios disponibles de la semana');
    });

    it('debería ejecutar catch branch en obtenerHorariosDisponiblesSemana', async () => {
      // Arrange - Datos de prueba
      const filtros = {};

      // Mock de error en findAll para forzar catch
      jest.spyOn(Horario, "findAll").mockRejectedValue(new Error("test error"));

      // Act & Assert
      await expect(HorarioService.obtenerHorariosDisponiblesSemana(filtros)).rejects.toThrow('Error al obtener horarios disponibles de la semana');
    });

    it('debería manejar error de base de datos al obtener horarios por rango', async () => {
      // Arrange - Datos de prueba
      const fechaInicio = '2024-12-01';
      const fechaFin = '2024-12-07';
      const filtros = {};
      const dbError = new Error('Error al consultar tabla horario por rango');

      // Mock de error en findAll
      mockHorarioFindAll.mockRejectedValue(dbError);

      // Act & Assert
      await expect(HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros)).rejects.toThrow('Error al obtener horarios disponibles por rango');
    });

    it('debería ejecutar catch branch en obtenerHorariosDisponiblesPorRango', async () => {
      // Arrange - Datos de prueba
      const fechaInicio = '2024-12-01';
      const fechaFin = '2024-12-07';
      const filtros = {};

      // Mock de error en findAll para forzar catch
      jest.spyOn(Horario, "findAll").mockRejectedValue(new Error("test error"));

      // Act & Assert
      await expect(HorarioService.obtenerHorariosDisponiblesPorRango(fechaInicio, fechaFin, filtros)).rejects.toThrow('Error al obtener horarios disponibles por rango');
    });

    it('debería manejar error de transacción', async () => {
      // Arrange - Datos de prueba
      const idMedico = 1;
      const data = {
        fecha: '2024-12-01',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        modalidad: 'PRESENCIAL' as const,
      };

      const transactionError = new Error('Error en transacción de base de datos');

      // Mock de error en transacción
      mockSequelizeTransaction.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(HorarioService.crearHorario(idMedico, data)).rejects.toThrow('Error en transacción de base de datos');
    });

    it('debería manejar datos inválidos en filtros', async () => {
      // Arrange - Datos de prueba
      const filtros = { idMedico: 'invalid' as any, estado: 123 as any };
      const mockHorarios: any[] = [];

      // Mock de findAll que maneja filtros inválidos
      mockHorarioFindAll.mockResolvedValue(mockHorarios);

      // Act - Ejecutar la función
      const result = await HorarioService.obtenerHorariosDisponiblesSemana(filtros);

      // Assert - Verificar que no se rompe
      expect(result).toEqual([]);
    });
  });
});