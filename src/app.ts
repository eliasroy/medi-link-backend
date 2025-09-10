import express from "express";
import dotenv from "dotenv";
import { conectarDB, sequelize } from "./config/database";
import authRouter from "./router/authRouter";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/auth", authRouter);

(async () => {
  await conectarDB();
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
  });
})();