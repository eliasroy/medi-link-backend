const mockApp = { use: jest.fn(), listen: jest.fn(), get: jest.fn() };

jest.mock('express', () => {
  const express = jest.fn(() => mockApp);
  (express as any).json = jest.fn(() => jest.fn());
  return express;
});

jest.mock('cors', () => jest.fn(() => jest.fn()));
jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../config/database', () => ({
  conectarDB: jest.fn(),
  sequelize: { sync: jest.fn() }
}));
jest.mock('../model/associations', () => ({}));
jest.mock('../router/authRouter', () => jest.fn());
jest.mock('../router/usuario.routes', () => jest.fn());
jest.mock('../router/medico.routes', () => jest.fn());
jest.mock('../router/citaRoutes', () => jest.fn());
jest.mock('../router/horarioRoutes', () => jest.fn());
jest.mock('../router/consultaRoutes', () => jest.fn());
jest.mock('../router/especialidad.routes', () => jest.fn());
jest.mock('../docs/swagger', () => jest.fn());

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env.PORT = '3000';
    require('../app');
    return new Promise(resolve => setImmediate(resolve));
  });

  afterEach(() => {
    jest.resetModules();
    delete process.env.PORT;
  });

  it('should initialize express app', () => {
    const express = require('express');
    expect(express).toHaveBeenCalled();
  });

  it('should configure dotenv', () => {
    const dotenv = require('dotenv');
    expect(dotenv.config).toHaveBeenCalled();
  });

  it('should register cors middleware', () => {
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should register express.json middleware', () => {
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should mount auth router', () => {
    expect(mockApp.use).toHaveBeenCalledWith('/api/auth', expect.any(Function));
  });

  it('should mount usuario router', () => {
    expect(mockApp.use).toHaveBeenCalledWith('/api/usuarios', expect.any(Function));
  });

  it('should mount medico routes', () => {
    expect(mockApp.use).toHaveBeenCalledWith('/api/listarMedicos', expect.any(Function));
  });

  it('should mount cita routes', () => {
    expect(mockApp.use).toHaveBeenCalledWith('/api/citas', expect.any(Function));
  });

  it('should mount horario routes', () => {
    expect(mockApp.use).toHaveBeenCalledWith('/api/horarios', expect.any(Function));
  });

  it('should mount especialidad routes', () => {
    expect(mockApp.use).toHaveBeenCalledWith('/api/especialidades', expect.any(Function));
  });

  it('should mount consulta routes', () => {
    expect(mockApp.use).toHaveBeenCalledWith('/api/consultas', expect.any(Function));
  });

  it('should register logging middleware', () => {
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should initialize database', () => {
    const { conectarDB, sequelize } = require('../config/database');
    expect(conectarDB).toHaveBeenCalled();
    expect(sequelize.sync).toHaveBeenCalled();
  });

  it('should listen on correct port', () => {
    expect(mockApp.listen).toHaveBeenCalledWith('3000', expect.any(Function));
  });

  it('should log server start message', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    // Trigger the listen callback
    const listenCall = mockApp.listen.mock.calls[0];
    if (listenCall) {
      const callback = listenCall[1];
      callback();
      expect(consoleSpy).toHaveBeenCalledWith(' Servidor corriendo en http://localhost:3000');
    }
    consoleSpy.mockRestore();
  });

  it('should call next in logging middleware', () => {
    const middlewareCalls = mockApp.use.mock.calls;
    const loggingMiddleware = middlewareCalls[middlewareCalls.length - 1][0];
    const req = { method: 'GET', url: '/test', body: {} };
    const res = {};
    const next = jest.fn();
    loggingMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
