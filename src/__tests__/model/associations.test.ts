describe("Associations Setup", () => {
  it("should load associations file without throwing", () => {
    expect(() => require("../../model/associations")).not.toThrow();
  });
});