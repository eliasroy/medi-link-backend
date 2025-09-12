import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface EspecialidadAttributes {
  id_especialidad: number;
  nombre: string;
}

interface EspecialidadCreationAttributes extends Optional<EspecialidadAttributes, "id_especialidad"> {}

export class Especialidad extends Model<EspecialidadAttributes, EspecialidadCreationAttributes>
  implements EspecialidadAttributes {
  public id_especialidad!: number;
  public nombre!: string;
}

Especialidad.init(
  {
    id_especialidad: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: "especialidadades", timestamps: false }
);
