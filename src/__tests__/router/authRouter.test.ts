import { Router } from 'express';
import request from 'supertest';
import express from 'express';
import authRouter from '../../router/authRouter';

// Mock the controllers
jest.mock('../../controller/authController', () => ({
  login: jest.fn(),
}));

jest.mock('../../controller/passwordChangeController', () => ({
  changePasswordByEmail: jest.fn(),
}));

import { login } from '../../controller/authController';
import { changePasswordByEmail } from '../../controller/passwordChangeController';

const mockedLogin = login as jest.MockedFunction<any>;
const mockedChangePasswordByEmail = changePasswordByEmail as jest.MockedFunction<any>;

describe('authRouter', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
    jest.clearAllMocks();
  });

  describe('POST /auth/login - Normal Cases', () => {
    it('should handle successful login', async () => {
      const mockResponse = { token: 'jwt-token', user: { id: 1, email: 'test@example.com' } };
      mockedLogin.mockImplementation(async (req: any, res: any) => {
        res.json(mockResponse);
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /auth/login - Limit Cases', () => {
    it('should handle empty email', async () => {
      mockedLogin.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ error: 'Email is required' });
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: '', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email is required' });
    });

    it('should handle empty password', async () => {
      mockedLogin.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ error: 'Password is required' });
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Password is required' });
    });

    it('should handle invalid email format', async () => {
      mockedLogin.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ error: 'Invalid email format' });
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'invalid-email', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid email format' });
    });
  });

  describe('POST /auth/login - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedLogin.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });

    it('should handle database connection error', async () => {
      mockedLogin.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ error: 'Database connection failed' });
      });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database connection failed' });
    });
  });

  describe('POST /auth/change-password - Normal Cases', () => {
    it('should handle successful password change', async () => {
      const mockResponse = { message: 'Password changed successfully' };
      mockedChangePasswordByEmail.mockImplementation(async (req: any, res: any) => {
        res.json(mockResponse);
      });

      const response = await request(app)
        .post('/auth/change-password')
        .send({ email: 'test@example.com', newPassword: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(mockedChangePasswordByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /auth/change-password - Limit Cases', () => {
    it('should handle empty email', async () => {
      mockedChangePasswordByEmail.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ error: 'Email is required' });
      });

      const response = await request(app)
        .post('/auth/change-password')
        .send({ email: '', newPassword: 'newpassword123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email is required' });
    });

    it('should handle empty new password', async () => {
      mockedChangePasswordByEmail.mockImplementation(async (req: any, res: any) => {
        res.status(400).json({ error: 'New password is required' });
      });

      const response = await request(app)
        .post('/auth/change-password')
        .send({ email: 'test@example.com', newPassword: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'New password is required' });
    });
  });

  describe('POST /auth/change-password - Exception Cases', () => {
    it('should handle server error', async () => {
      mockedChangePasswordByEmail.mockImplementation(async (req: any, res: any) => {
        res.status(500).json({ error: 'Internal server error' });
      });

      const response = await request(app)
        .post('/auth/change-password')
        .send({ email: 'test@example.com', newPassword: 'newpassword123' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });

    it('should handle email not found', async () => {
      mockedChangePasswordByEmail.mockImplementation(async (req: any, res: any) => {
        res.status(404).json({ error: 'Email not found' });
      });

      const response = await request(app)
        .post('/auth/change-password')
        .send({ email: 'nonexistent@example.com', newPassword: 'newpassword123' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Email not found' });
    });
  });
});