const { FilamentClean } = require("../dataFunctions/filamentClean");

describe("filamentClean", function () {
  it("should have default values", () => {
    const spools = FilamentClean.getSpools();
    const profiles = FilamentClean.getProfiles();
    const stats = FilamentClean.getStatistics();
    const selectedFilamentList = FilamentClean.getSelected();
    const dropDownList = FilamentClean.getDropDown();

    expect(spools).toHaveLength(0);
    expect(profiles).toHaveLength(0);
    expect(stats).toHaveLength(0);
    expect(selectedFilamentList).toHaveLength(0);
    expect(dropDownList).toMatchObject({
      normalDropDown: [],
      historyDropDown: []
    });
  });
});
