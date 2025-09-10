import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MedicoAttributes {
  id_medico: number;
  id_usuario: number;
  nro_colegiatura: string;
  anios_experiencia?: number;
  calificacion_promedio?: number;
  fecha_registro: Date;
  fecha_actualizacion: Date;
}

interface MedicoCreationAttributes extends Optional<MedicoAttributes, "id_medico" | "calificacion_promedio" | "fecha_registro" | "fecha_actualizacion"> {}

export class Medico extends Model<MedicoAttributes, MedicoCreationAttributes>
  implements MedicoAttributes {
  public id_medico!: number;
  public id_usuario!: number;
  public nro_colegiatura!: string;
  public anios_experiencia?: number;
  public calificacion_promedio?: number;
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;
}

Medico.init(
  {
    id_medico: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    nro_colegiatura: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anios_experiencia: DataTypes.INTEGER,
    calificacion_promedio: DataTypes.DECIMAL(3, 2),
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "medico", timestamps: false }
);
