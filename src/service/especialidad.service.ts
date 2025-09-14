import Especialidad from "../model/especialidad.model";

class EspecialidadService {
  // Obtener todas las especialidades
  static async obtenerTodas() {
    try {
      const especialidades = await Especialidad.findAll({
        order: [['nombre', 'ASC']]
      });
      return especialidades;
    } catch (error) {
      throw new Error("Error al obtener especialidades");
    }
  }


 

  

}

export default EspecialidadService;
