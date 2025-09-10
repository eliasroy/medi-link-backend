import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface UsuarioAttributes {
  id_usuario: number;
  nombre: string;
  paterno: string;
  materno: string;
  email: string;
  telefono?: number;
  password: string;
  rol: "MEDICO" | "PACIENTE";
  estado?: string;
  fecha_registro: Date;
  fecha_actualizacion: Date;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, "id_usuario" | "fecha_registro" | "fecha_actualizacion"> {}

export class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes {
  public id_usuario!: number;
  public nombre!: string;
  public paterno!: string;
  public materno!: string;
  public email!: string;
  public telefono?: number;
  public password!: string;
  public rol!: "MEDICO" | "PACIENTE";
  public estado?: string;
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;
}

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paterno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    materno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("MEDICO", "PACIENTE"),
      defaultValue: "PACIENTE",
    },
    estado: {
      type: DataTypes.STRING,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "usuario",
    timestamps: false,
  }
);
