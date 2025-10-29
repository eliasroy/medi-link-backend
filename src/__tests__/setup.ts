// Configuración global para los tests
import dotenv from 'dotenv';

// Cargar variables de entorno para testing
dotenv.config({ path: '.env.test' });

// Configurar variables de entorno por defecto para testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.NODE_ENV = 'test';
