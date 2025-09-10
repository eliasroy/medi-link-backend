import { faker } from "@faker-js/faker";
import { registrarPaciente, registrarMedico } from "./service/usuario.service";
import { sequelize } from "./config/database";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    // Crear 100 pacientes
    for (let i = 1; i <= 100; i++) {
      await registrarPaciente({
        nombre: faker.person.firstName(),
        paterno: faker.person.lastName(),
        materno: faker.person.lastName(),
        email: `paciente${i}@test.com`,
        telefono: parseInt(faker.phone.number().replace(/\D/g, '').slice(0, 9)),
        password: "123",
        fecha_nacimiento: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        sexo: faker.helpers.arrayElement(["M", "F", "X"]),
        direccion: faker.location.streetAddress(),
      });
    }

    // Crear 50 médicos
    for (let i = 1; i <= 50; i++) {
      await registrarMedico({
        nombre: faker.person.firstName(),
        paterno: faker.person.lastName(),
        materno: faker.person.lastName(),
        email: `medico${i}@test.com`,
        telefono: parseInt(faker.phone.number().replace(/\D/g, '').slice(0, 9)),
        password: "123",
        nro_colegiatura: `CMP${String(i).padStart(4, "0")}`,
        anios_experiencia: faker.number.int({ min: 1, max: 30 }),
      });
    }

    console.log(" Seed completado: 100 pacientes y 50 médicos creados");
    process.exit(0);
  } catch (error) {
    console.error(" Error en seed:", error);
    process.exit(1);
  }
}

seed();
