// models/Especialidad.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class Especialidad extends Model {
  public id_especialidad!: number;
  public nombre!: string;
  public descripcion!: string | null;
}

Especialidad.init(
  {
    id_especialidad: { 
      type: DataTypes.BIGINT, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nombre: { 
      type: DataTypes.STRING(100), 
      allowNull: false, 
      unique: true 
    },
    descripcion: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
  },
  { 
    sequelize, 
    modelName: "especialidades", 
    timestamps: false 
  }
);

export default Especialidad;