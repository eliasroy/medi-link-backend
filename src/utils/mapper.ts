import { Usuario } from "../model/usuario.model";
import { UsuarioDTO } from "../dtos/usuario.dto";

export const usuarioToDTO = (usuario: Usuario): UsuarioDTO => ({
  id: usuario.id_usuario,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
});
