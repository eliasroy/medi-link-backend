import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const conectarDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Conectado a MySQL");
    return connection;
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error);
    process.exit(1);
  }
};
