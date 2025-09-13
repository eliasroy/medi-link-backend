// models/Cita.ts
import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database";
import Horario from "./horario.model";

class Cita extends Model {
  public id_cita!: number;
  public id_paciente!: number;
  public id_horario!: number;
  public estado!: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "ATENDIDA";
  public modalidad!: "PRESENCIAL" | "VIRTUAL";
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;
}

Cita.init(
  {
    id_cita: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    id_paciente: { type: DataTypes.BIGINT, allowNull: false },
    id_horario: { type: DataTypes.BIGINT, allowNull: false },
    estado: { type: DataTypes.ENUM("PENDIENTE", "CONFIRMADA", "CANCELADA", "ATENDIDA"), defaultValue: "PENDIENTE" },
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
  { sequelize, modelName: "cita", timestamps: false }
);

// Relaciones
Cita.belongsTo(Horario, { foreignKey: "id_horario" });

export default Cita;
