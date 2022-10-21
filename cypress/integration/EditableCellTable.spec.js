describe("EditableCellTable.spec", () => {
  it(`should be able to edit text inputs correctly`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(
      `[data-tip="Must include the letter 'a'"] [data-test="tgCell_name"]:first`
    ).should("contain", "tom"); //should lowercase "Tom"
    cy.get(`[data-test="tgCell_name"]:first`).click();
    cy.get(".cellDragHandle").should("exist");
    cy.get(`[data-test="tgCell_name"]:first`).dblclick();
    cy.get(".cellDragHandle").should("not.exist");
    cy.focused().type("_zonk{enter}");
    cy.get(
      `[data-tip="Must include the letter 'a'"] [data-test="tgCell_name"]:first`
    ).should("contain", "tom_zonk");
    cy.get(".cellDragHandle").should("exist");
  });

  it(`should be able to edit dropdown inputs correctly`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(
      `[data-tip="Please choose one of the accepted values"] [data-test="tgCell_type"]:first`
    ).should("contain", "fail"); //should lowercase "Tom"
    cy.get(`[data-test="tgCell_type"]:first`).dblclick();
    cy.focused().type("old{enter}");
    cy.get(`[data-test="tgCell_type"]:first`).should("contain", "old");
  });

  it(`should be able to edit numeric inputs correctly`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(
      `[data-tip="Must be a number"] [data-test="tgCell_howMany"]:first`
    ).should("contain", "NaN"); //should lowercase "Tom"
    cy.get(`[data-test="tgCell_howMany"]:first`).dblclick();
    cy.focused().type("11{enter}");
    cy.get(`[data-test="tgCell_howMany"]:first`).should("contain", "12"); //should have 12 post format
    cy.get(
      `[data-tip="Must be a number"] [data-test="tgCell_howMany"]:first`
    ).should("not.exist");
  });
});
