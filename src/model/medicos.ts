import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class VistaMedicos extends Model {}

VistaMedicos.init(
  {
    id_medico: { type: DataTypes.BIGINT, primaryKey: true },
    nombre: DataTypes.STRING,
    paterno: DataTypes.STRING,
    materno: DataTypes.STRING,
    nro_colegiatura: DataTypes.STRING,
    id_especialidad: DataTypes.BIGINT,
    especialidad: DataTypes.STRING,
    especialidad_descripcion: DataTypes.TEXT,
    anios_experiencia: DataTypes.INTEGER,
    calificacion_promedio: DataTypes.DECIMAL(3, 2),
  },
  {
    sequelize,
    tableName: "vista_medicos", // 👈 el nombre de la vista
    timestamps: false,
  }
);
