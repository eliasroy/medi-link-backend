import bcrypt from "bcrypt";
import { Usuario } from "../model/usuario.model";
import { Paciente } from "../model/paciente.model";
import { Medico } from "../model/medico.model";

interface RegistroPaciente {
  nombre: string;
  paterno: string;
  materno: string;
  email: string;
  telefono?: number;
  password: string;
  fecha_nacimiento?: Date;
  sexo?: "M" | "F" | "X";
  direccion?: string;
}

interface RegistroMedico {
  nombre: string;
  paterno: string;
  materno: string;
  email: string;
  telefono?: number;
  password: string;
  nro_colegiatura: string;
  anios_experiencia?: number;
}

export const registrarPaciente = async (data: RegistroPaciente) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const usuario = await Usuario.create({
    nombre: data.nombre,
    paterno: data.paterno,
    materno: data.materno,
    email: data.email,
    telefono: data.telefono,
    password: hashedPassword,
    rol: "PACIENTE",
  });

  const paciente = await Paciente.create({
    id_usuario: usuario.id_usuario,
    fecha_nacimiento: data.fecha_nacimiento,
    sexo: data.sexo,
    direccion: data.direccion,
  });

  return { usuario, paciente };
};

export const registrarMedico = async (data: RegistroMedico) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const usuario = await Usuario.create({
    nombre: data.nombre,
    paterno: data.paterno,
    materno: data.materno,
    email: data.email,
    telefono: data.telefono,
    password: hashedPassword,
    rol: "MEDICO",
  });

  const medico = await Medico.create({
    id_usuario: usuario.id_usuario,
    nro_colegiatura: data.nro_colegiatura,
    anios_experiencia: data.anios_experiencia,
  });

  return { usuario, medico };
};
