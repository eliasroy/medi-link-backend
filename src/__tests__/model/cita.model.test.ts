describe("Cita Model", () => {
  it("should load without errors", () => {
    const Cita = require("../../model/cita.model").default;
    expect(Cita).toBeDefined();
  });

  it("should extend Sequelize.Model", () => {
    const Cita = require("../../model/cita.model").default;
    expect(Object.getPrototypeOf(Cita.prototype).constructor.name).toBe("Model");
  });
});