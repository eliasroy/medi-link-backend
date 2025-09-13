import express from "express";
import dotenv from "dotenv";
import { conectarDB, sequelize } from "./config/database";
import authRouter from "./router/authRouter";
import usuarioRouter from "./router/usuario.routes";
import medicoRoutes from "./router/medico.routes";
import citaRoutes from "./router/citaRoutes";
import horarioRoutes from "./router/horarioRoutes";
import consultaRoutes from "./router/consultaRoutes";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/listarMedicos", medicoRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/consultas", consultaRoutes);

(async () => {
  await conectarDB();
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
  });
})();
app.use((req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
});
