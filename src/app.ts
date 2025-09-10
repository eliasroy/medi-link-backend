import express from "express";
import { conectarDB } from "./config/database";
const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});