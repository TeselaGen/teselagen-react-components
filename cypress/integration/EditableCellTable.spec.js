describe("EditableCellTable.spec", () => {
  it(`should be able to edit correctly`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`[data-test="tgCell_name"]:first`).dblclick();
    cy.focused().type("{selectall}zonk{enter}");
    cy.get(
      `[data-tip="Must include the letter 'a'"] [data-test="tgCell_name"]:first`
    ).should("contain", "zonk");
    // cy.get(`[data-test="tgCell_name"]:first`).should("contain", "zonk");
  });
});
