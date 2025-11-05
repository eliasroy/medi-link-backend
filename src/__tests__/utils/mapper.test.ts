import { usuarioToDTO } from '../../utils/mapper';
import { Usuario } from '../../model/usuario.model';

// Mock the Usuario model
jest.mock('../../model/usuario.model', () => ({
  Usuario: class MockUsuario {},
}));

// Mock the UsuarioDTO
jest.mock('../../dtos/usuario.dto', () => ({
  UsuarioDTO: class MockUsuarioDTO {},
}));

describe('Mapper Utils', () => {
  describe('usuarioToDTO - Normal Cases', () => {
    it('should map Usuario to UsuarioDTO correctly', () => {
      const usuario = {
        nombre: 'Juan',
        email: 'juan@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const idUser = 1;

      const result = usuarioToDTO(usuario, idUser);

      expect(result).toEqual({
        id: 1,
        nombre: 'Juan',
        email: 'juan@example.com',
        rol: 'PACIENTE',
      });
    });

    it('should handle different user roles', () => {
      const medicoUsuario = {
        nombre: 'Dr. María',
        email: 'maria@hospital.com',
        rol: 'MEDICO' as const,
      } as Usuario;

      const result = usuarioToDTO(medicoUsuario, 2);

      expect(result).toEqual({
        id: 2,
        nombre: 'Dr. María',
        email: 'maria@hospital.com',
        rol: 'MEDICO',
      });
    });

    it('should handle different ID values', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 999);

      expect(result).toEqual({
        id: 999,
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE',
      });
    });
  });

  describe('usuarioToDTO - Limit Cases', () => {
    it('should handle empty strings', () => {
      const usuario = {
        nombre: '',
        email: '',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result).toEqual({
        id: 1,
        nombre: '',
        email: '',
        rol: 'PACIENTE',
      });
    });

    it('should handle very long strings', () => {
      const longName = 'a'.repeat(255);
      const longEmail = 'a'.repeat(245) + '@example.com';

      const usuario = {
        nombre: longName,
        email: longEmail,
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.nombre).toBe(longName);
      expect(result.email).toBe(longEmail);
    });

    it('should handle special characters in names', () => {
      const usuario = {
        nombre: 'José María Ñoñez',
        email: 'jose.maria@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.nombre).toBe('José María Ñoñez');
      expect(result.email).toBe('jose.maria@example.com');
    });

    it('should handle minimum ID value', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.id).toBe(1);
    });

    it('should handle large ID values', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 999999);

      expect(result.id).toBe(999999);
    });
  });

  describe('usuarioToDTO - Exception Cases', () => {
    it('should handle null values gracefully', () => {
      const usuario = {
        nombre: null as any,
        email: null as any,
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.nombre).toBeNull();
      expect(result.email).toBeNull();
      expect(result.rol).toBe('PACIENTE');
    });

    it('should handle undefined values', () => {
      const usuario = {
        nombre: undefined as any,
        email: undefined as any,
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.nombre).toBeUndefined();
      expect(result.email).toBeUndefined();
      expect(result.rol).toBe('PACIENTE');
    });

    it('should handle invalid rol values', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'INVALIDO' as any,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.rol).toBe('INVALIDO');
    });

    it('should handle negative ID values', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, -1);

      expect(result.id).toBe(-1);
    });

    it('should handle zero ID value', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 0);

      expect(result.id).toBe(0);
    });

    it('should handle non-numeric ID values', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 'invalid' as any);

      expect(result.id).toBe('invalid');
    });
  });

  describe('usuarioToDTO - Data Integrity', () => {
    it('should not modify original usuario object', () => {
      const originalUsuario = {
        nombre: 'Original',
        email: 'original@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const usuarioCopy = { ...originalUsuario };

      usuarioToDTO(originalUsuario, 1);

      expect(originalUsuario).toEqual(usuarioCopy);
    });

    it('should return a new object each time', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result1 = usuarioToDTO(usuario, 1);
      const result2 = usuarioToDTO(usuario, 1);

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });

    it('should preserve data types', () => {
      const usuario = {
        nombre: 'Test',
        email: 'test@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(typeof result.id).toBe('number');
      expect(typeof result.nombre).toBe('string');
      expect(typeof result.email).toBe('string');
      expect(typeof result.rol).toBe('string');
    });
  });

  describe('usuarioToDTO - Edge Cases', () => {
    it('should handle email with subdomains', () => {
      const usuario = {
        nombre: 'Test',
        email: 'user@sub.domain.example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.email).toBe('user@sub.domain.example.com');
    });

    it('should handle email with plus addressing', () => {
      const usuario = {
        nombre: 'Test',
        email: 'user+tag@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.email).toBe('user+tag@example.com');
    });

    it('should handle names with numbers', () => {
      const usuario = {
        nombre: 'User123',
        email: 'user123@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.nombre).toBe('User123');
    });

    it('should handle very short names', () => {
      const usuario = {
        nombre: 'A',
        email: 'a@example.com',
        rol: 'PACIENTE' as const,
      } as Usuario;

      const result = usuarioToDTO(usuario, 1);

      expect(result.nombre).toBe('A');
    });
  });
});