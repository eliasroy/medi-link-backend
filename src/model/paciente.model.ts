import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface PacienteAttributes {
  id_paciente: number;
  id_usuario: number;
  fecha_nacimiento?: Date;
  sexo?: "M" | "F" | "X";
  direccion?: string;
  fecha_registro: Date;
  fecha_actualizacion: Date;
}

interface PacienteCreationAttributes extends Optional<PacienteAttributes, "id_paciente" | "fecha_registro" | "fecha_actualizacion"> {}

export class Paciente extends Model<PacienteAttributes, PacienteCreationAttributes>
  implements PacienteAttributes {
  public id_paciente!: number;
  public id_usuario!: number;
  public fecha_nacimiento?: Date;
  public sexo?: "M" | "F" | "X";
  public direccion?: string;
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;
}

Paciente.init(
  {
    id_paciente: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    fecha_nacimiento: DataTypes.DATE,
    sexo: DataTypes.ENUM("M", "F", "X"),
    direccion: DataTypes.STRING,
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "paciente", timestamps: false }
);
