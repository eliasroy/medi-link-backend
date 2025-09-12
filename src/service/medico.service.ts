import { VistaMedicos } from "../model/medicos";
export class MedicoService {
  static async listarMedicosOrdenados() {
    return await VistaMedicos.findAll({
        order: [["calificacion_promedio", "DESC"]],
    });
  }
}
