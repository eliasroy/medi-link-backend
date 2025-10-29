import { Request, Response } from 'express';
import * as authService from '../../../service/auth.service';
import { login as loginController } from '../../../controller/authController';

jest.mock('../../../service/auth.service');

const mockedAuthService = authService as jest.Mocked<typeof authService>;

function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}

describe('authController.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Casos comunes
  it('debe responder 200 con el resultado cuando el login es exitoso', async () => {
    const req = { body: { email: 'user@test.com', password: 'secret' } } as Request;
    const res = createMockResponse();

    const fakeResult = { mensaje: 'Login exitoso', token: 't', idUser: 1, usuario: { id: 1, nombre: 'User', email: 'user@test.com', rol: 'PACIENTE' } };
    mockedAuthService.login.mockResolvedValueOnce(fakeResult);

    await loginController(req, res);

    expect(mockedAuthService.login).toHaveBeenCalledWith('user@test.com', 'secret');
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fakeResult);
  });

  // Casos límite
  it('debe responder 400 cuando falta email', async () => {
    const req = { body: { email: '', password: 'secret' } } as Request;
    const res = createMockResponse();

    mockedAuthService.login.mockRejectedValueOnce(new Error('Usuario no encontrado'));

    await loginController(req, res);

    expect(mockedAuthService.login).toHaveBeenCalledWith('', 'secret');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
  });

  it('debe responder 400 cuando la contraseña es incorrecta', async () => {
    const req = { body: { email: 'user@test.com', password: '' } } as Request;
    const res = createMockResponse();

    mockedAuthService.login.mockRejectedValueOnce(new Error('Contraseña incorrecta'));

    await loginController(req, res);

    expect(mockedAuthService.login).toHaveBeenCalledWith('user@test.com', '');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Contraseña incorrecta' });
  });

  it('debe responder 400 cuando el usuario no tiene perfil', async () => {
    const req = { body: { email: 'user@test.com', password: 'secret' } } as Request;
    const res = createMockResponse();

    mockedAuthService.login.mockRejectedValueOnce(new Error('El usuario no tiene perfil de MÉDICO o PACIENTE'));

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'El usuario no tiene perfil de MÉDICO o PACIENTE' });
  });

  // Casos de excepción
  it('debe responder 400 cuando falta JWT_SECRET', async () => {
    const req = { body: { email: 'user@test.com', password: 'secret' } } as Request;
    const res = createMockResponse();

    mockedAuthService.login.mockRejectedValueOnce(new Error(' JWT_SECRET no está definido en .env'));

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ' JWT_SECRET no está definido en .env' });
  });

  it('debe responder 400 ante error inesperado del servicio', async () => {
    const req = { body: { email: 'user@test.com', password: 'secret' } } as Request;
    const res = createMockResponse();

    mockedAuthService.login.mockRejectedValueOnce(new Error('Error de conexión a la base de datos'));

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error de conexión a la base de datos' });
  });
});
