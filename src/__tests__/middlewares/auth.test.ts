import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken, authorizeRoles } from '../../middlewares/auth';

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const mockedJwtVerify = jwt.verify as jest.MockedFunction<any>;

describe('auth middleware', () => {
  let mockReq: Partial<Request> & { user?: any };
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('verifyToken - Normal Cases', () => {
    it('should call next() when token is valid', () => {
      const validToken = 'valid.jwt.token';
      const decodedUser = { id: 1, email: 'test@example.com', rol: 'PACIENTE' };

      mockReq.headers = {
        authorization: `Bearer ${validToken}`,
      };

      mockedJwtVerify.mockReturnValue(decodedUser);

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockedJwtVerify).toHaveBeenCalledWith(validToken, expect.any(String));
      expect(mockReq.user).toEqual(decodedUser);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should handle token with different user roles', () => {
      const validToken = 'valid.jwt.token';
      const decodedMedico = { id: 2, email: 'medico@example.com', rol: 'MEDICO' };

      mockReq.headers = {
        authorization: `Bearer ${validToken}`,
      };

      mockedJwtVerify.mockReturnValue(decodedMedico);

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(decodedMedico);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyToken - Limit Cases', () => {
    it('should return 401 when authorization header is missing', () => {
      mockReq.headers = {};

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is empty', () => {
      mockReq.headers = {
        authorization: '',
      };

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
    });

    it('should return 401 when authorization header has no Bearer prefix', () => {
      mockReq.headers = {
        authorization: 'invalid-token-format',
      };

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido' });
    });

    it('should return 401 when authorization header has Bearer but no token', () => {
      mockReq.headers = {
        authorization: 'Bearer ',
      };

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido' });
    });

    it('should return 401 when authorization header has only Bearer', () => {
      mockReq.headers = {
        authorization: 'Bearer',
      };

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido' });
    });
  });

  describe('verifyToken - Exception Cases', () => {
    it('should return 403 when token is expired', () => {
      const expiredToken = 'expired.jwt.token';
      const error = new Error('jwt expired');

      mockReq.headers = {
        authorization: `Bearer ${expiredToken}`,
      };

      mockedJwtVerify.mockImplementation(() => {
        throw error;
      });

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado', error });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token is malformed', () => {
      const malformedToken = 'malformed.jwt.token';
      const error = new Error('jwt malformed');

      mockReq.headers = {
        authorization: `Bearer ${malformedToken}`,
      };

      mockedJwtVerify.mockImplementation(() => {
        throw error;
      });

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado', error });
    });

    it('should return 403 when token signature is invalid', () => {
      const invalidToken = 'invalid.jwt.token';
      const error = new Error('invalid signature');

      mockReq.headers = {
        authorization: `Bearer ${invalidToken}`,
      };

      mockedJwtVerify.mockImplementation(() => {
        throw error;
      });

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado', error });
    });

    it('should handle unexpected errors during token verification', () => {
      const token = 'some.jwt.token';
      const error = new Error('Unexpected error');

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      mockedJwtVerify.mockImplementation(() => {
        throw error;
      });

      verifyToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado', error });
    });
  });

  describe('authorizeRoles - Normal Cases', () => {
    it('should call next() when user has required role', () => {
      const middleware = authorizeRoles('PACIENTE');
      mockReq.user = { id: 1, email: 'test@example.com', rol: 'PACIENTE' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should call next() when user has one of multiple required roles', () => {
      const middleware = authorizeRoles('PACIENTE', 'MEDICO');
      mockReq.user = { id: 1, email: 'test@example.com', rol: 'PACIENTE' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should call next() when user has MEDICO role', () => {
      const middleware = authorizeRoles('MEDICO');
      mockReq.user = { id: 2, email: 'medico@example.com', rol: 'MEDICO' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('authorizeRoles - Limit Cases', () => {
    it('should return 401 when user is not authenticated', () => {
      const middleware = authorizeRoles('PACIENTE');
      mockReq.user = undefined;

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user is null', () => {
      const middleware = authorizeRoles('PACIENTE');
      mockReq.user = null;

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado' });
    });

    it('should return 403 when user does not have required role', () => {
      const middleware = authorizeRoles('MEDICO');
      mockReq.user = { id: 1, email: 'paciente@example.com', rol: 'PACIENTE' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No tienes permisos para acceder a este recurso' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user has different role than required', () => {
      const middleware = authorizeRoles('PACIENTE');
      mockReq.user = { id: 2, email: 'medico@example.com', rol: 'MEDICO' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No tienes permisos para acceder a este recurso' });
    });

    it('should return 403 when user role is empty string', () => {
      const middleware = authorizeRoles('PACIENTE');
      mockReq.user = { id: 1, email: 'test@example.com', rol: '' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No tienes permisos para acceder a este recurso' });
    });

    it('should return 403 when user has no role property', () => {
      const middleware = authorizeRoles('PACIENTE');
      mockReq.user = { id: 1, email: 'test@example.com' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No tienes permisos para acceder a este recurso' });
    });
  });

  describe('authorizeRoles - Exception Cases', () => {
    it('should handle multiple roles requirement correctly', () => {
      const middleware = authorizeRoles('ADMIN', 'PACIENTE', 'MEDICO');
      mockReq.user = { id: 1, email: 'paciente@example.com', rol: 'PACIENTE' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should handle empty roles array (should deny access when no roles specified)', () => {
      const middleware = authorizeRoles();
      mockReq.user = { id: 1, email: 'test@example.com', rol: 'PACIENTE' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      // When no roles are specified, includes() with empty array returns false
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No tienes permisos para acceder a este recurso' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle case-sensitive role matching', () => {
      const middleware = authorizeRoles('paciente'); // lowercase
      mockReq.user = { id: 1, email: 'test@example.com', rol: 'PACIENTE' }; // uppercase

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No tienes permisos para acceder a este recurso' });
    });
  });
});