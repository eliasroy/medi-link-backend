describe("Consulta Model", () => {
  it("should load without errors", () => {
    const Consulta = require("../../model/Consulta").default;
    expect(Consulta).toBeDefined();
  });

  it("should extend Sequelize.Model", () => {
    const Consulta = require("../../model/Consulta").default;
    expect(Object.getPrototypeOf(Consulta.prototype).constructor.name).toBe("Model");
  });
});