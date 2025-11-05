const mockSequelizeInstance = {
  authenticate: jest.fn(),
  sync: jest.fn()
};

jest.mock('sequelize', () => {
  return {
    Sequelize: jest.fn(() => mockSequelizeInstance)
  };
});

jest.mock('dotenv', () => ({ config: jest.fn() }));

jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

describe('Database Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DB_NAME = 'test_db';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_pass';
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '3306';
  });

  afterEach(() => {
    jest.resetModules();
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
  });

  it('should create Sequelize instance with env vars', () => {
    const { Sequelize } = require('sequelize');
    require('../../config/database');
    expect(Sequelize).toHaveBeenCalledWith(
      'test_db',
      'test_user',
      'test_pass',
      {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        logging: true,
      }
    );
  });

  it('should resolve when authentication succeeds', async () => {
    mockSequelizeInstance.authenticate.mockResolvedValue(undefined);
    const { conectarDB } = require('../../config/database');
    await expect(conectarDB()).resolves.toBeUndefined();
    expect(mockSequelizeInstance.authenticate).toHaveBeenCalled();
  });

  it('should throw when authentication fails', async () => {
    mockSequelizeInstance.authenticate.mockRejectedValue(new Error('Connection failed'));
    const { conectarDB } = require('../../config/database');
    await expect(conectarDB()).rejects.toThrow('process.exit called');
    expect(mockSequelizeInstance.authenticate).toHaveBeenCalled();
  });

  it('should handle invalid error types', async () => {
    mockSequelizeInstance.authenticate.mockRejectedValue('string error');
    const { conectarDB } = require('../../config/database');
    await expect(conectarDB()).rejects.toThrow('process.exit called');
    expect(mockSequelizeInstance.authenticate).toHaveBeenCalled();
  });
});