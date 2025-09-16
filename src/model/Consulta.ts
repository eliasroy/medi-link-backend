
import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database";
import Cita from "./cita.model";

class Consulta extends Model {
  public id_consulta!: number;
  public id_cita!: number;
  public motivo!: string;
  public diagnostico?: string;
  public pathArchivo?: string;
  public tratamiento?: string;
  public observaciones?: string;
  public calificacion?: number;
  public estado!: "INICIADO" | "EN_REVISION" | "DIAGNOSTICADA" | "FINALIZADA";
  public fecha_registro!: Date;
  public fecha_actualizacion!: Date;
}

Consulta.init(
  {
    id_consulta: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    id_cita: { type: DataTypes.BIGINT, allowNull: false },
    motivo: { type: DataTypes.TEXT, allowNull: true },
    diagnostico: { type: DataTypes.TEXT },
    pathArchivo: { type: DataTypes.TEXT },
    tratamiento: { type: DataTypes.TEXT },
    observaciones: { type: DataTypes.TEXT },
    calificacion: { type: DataTypes.INTEGER },
    estado: {
      type: DataTypes.ENUM("INICIADO", "EN_REVISION", "DIAGNOSTICADA", "FINALIZADA"),
      defaultValue: "INICIADO",
    },
    fecha_registro: { type: DataTypes.DATE, allowNull: false },
    fecha_actualizacion: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: "consultas", timestamps: false }
);

Consulta.belongsTo(Cita, { foreignKey: "id_cita" });

export default Consulta;
