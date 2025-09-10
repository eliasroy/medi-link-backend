import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,     // medilink
  process.env.DB_USER as string,     // root
  process.env.DB_PASSWORD as string, // root
  {
    host: process.env.DB_HOST as string, // localhost
    port: Number(process.env.DB_PORT), // 3306
    dialect: "mysql",
    logging: true, // opcional, oculta logs de SQL
  }
);

export const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Conexión a MySQL establecida");
  } catch (error) {
    console.error(" Error de conexión:", error);
    process.exit(1);
  }
};
