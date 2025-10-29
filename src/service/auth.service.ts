import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Usuario } from "../model/usuario.model";
import { usuarioToDTO } from "../utils/mapper";
import { Medico } from "../model/medico.model";
import { Paciente } from "../model/paciente.model";

export const login = async (email: string, password: string) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) throw new Error("Usuario no encontrado");

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) throw new Error("Contraseña incorrecta");
  if (!process.env.JWT_SECRET) {
    throw new Error(" JWT_SECRET no está definido en .env");
  }
  const medico = await Medico.findOne({ where: { id_usuario:usuario.id_usuario } });
  const paciente = await Paciente.findOne({ where: { id_usuario:usuario.id_usuario } });
  let idUser: number | null = null;
  if (medico) {
    idUser = Number(medico.id_medico);
  } else if (paciente) {
    idUser = Number(paciente.id_paciente);
  }
  if (idUser === null) {
    throw new Error("El usuario no tiene perfil de MÉDICO o PACIENTE");
  }

  const token = jwt.sign(
    { id: idUser, rol: usuario.rol },
    process.env.JWT_SECRET as string,
    { expiresIn: "11h" }
  );
  return {
    mensaje: "Login exitoso",
    token,
    idUser,
    usuario: usuarioToDTO(usuario,idUser),
  };
};
