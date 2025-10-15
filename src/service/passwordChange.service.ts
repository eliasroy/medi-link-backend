import bcrypt from "bcrypt";
import { Usuario } from "../model/usuario.model";

// Cambiar contraseña por email
export const changePasswordByEmail = async (email: string, newPassword: string): Promise<{ mensaje: string }> => {
  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      throw new Error("Usuario no encontrado con ese email");
    }

    // Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña en la base de datos
    await usuario.update({
      password: hashedPassword,
      fecha_actualizacion: new Date()
    });

    return {
      mensaje: "Contraseña actualizada exitosamente"
    };

  } catch (error: any) {
    throw new Error(`Error al actualizar contraseña: ${error.message}`);
  }
};
