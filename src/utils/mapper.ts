import { Usuario } from "../model/usuario.model";
import { UsuarioDTO } from "../dtos/usuario.dto";

export const usuarioToDTO = (usuario: Usuario,idUser:number): UsuarioDTO => ({
  id: idUser,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
});
