import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../model/usuario.model";
import { usuarioToDTO } from "../utils/mapper";

export const login = async (email: string, password: string) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) throw new Error("Usuario no encontrado");

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) throw new Error("Contraseña incorrecta");

  const token = jwt.sign(
    { id: usuario.id_usuario, rol: usuario.rol },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {
    mensaje: "Login exitoso",
    token,
    usuario: usuarioToDTO(usuario),
  };
};
