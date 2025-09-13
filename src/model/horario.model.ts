// models/Horario.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Horario extends Model {
  public id_horario!: number;
  public id_medico!: number;
  public titulo!: string;
  public fecha!: Date;
  public hora_inicio!: string;
  public hora_fin!: string;
  public estado!: "DISPONIBLE" | "OCUPADO" | "CANCELADO";
  public modalidad!: "PRESENCIAL" | "VIRTUAL";
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;
}

Horario.init(
  {
    id_horario: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    id_medico: { type: DataTypes.BIGINT, allowNull: false },
    titulo: DataTypes.STRING,
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    hora_inicio: { type: DataTypes.TIME, allowNull: false },
    hora_fin: { type: DataTypes.TIME, allowNull: false },
    estado: { type: DataTypes.ENUM("DISPONIBLE", "OCUPADO", "CANCELADO"), defaultValue: "DISPONIBLE" },
    modalidad: { type: DataTypes.ENUM("PRESENCIAL", "VIRTUAL"), defaultValue: "PRESENCIAL" },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
  },
  { sequelize, modelName: "horarios", timestamps: false }
);

export default Horario;
