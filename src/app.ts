import express from "express";
import dotenv from "dotenv";
import { conectarDB, sequelize } from "./config/database";
import authRouter from "./router/authRouter";
import usuarioRouter from "./router/usuario.routes";
import medicoRoutes from "./router/medico.routes";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/listarMedicos", medicoRoutes);

(async () => {
  await conectarDB();
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
  });
})();