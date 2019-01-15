describe("formComponents", () => {
  beforeEach(() => {
    cy.visit("#/DataTable");
  });
  it.only(`it can copy a single row, selected rows, or cells to the clipboard`, () => {
    cy.get(`[data-test="tgCell_type.special"]`).first().trigger("contextmenu")
    cy.contains("Copy Selected Rows to Clipboard").click()

    //TODOCOPY: add tests for the 3 cases, 
    //  - copying a single row (selected or not) 
    // - copying multiple selected rows 
    // - copying a single cell 
    // make sure certain columns that shouldn't be copyable are not copied (different than copyable columns that are simply empty)
    cy.contains("Copy Selected Rows to Clipboard").click()

  });
  it(`it can click the tg filter menu and type some stuff`, () => {
    cy.get(`[data-test="Hunger Level"]`)
      .find(".tg-filter-menu-button")
      .click({ force: true });
    cy.get(".bp3-popover input").type("hello");
    cy.get(".bp3-popover")
      .contains("Filter")
      .click();
    //the clear filter button should show up and we can click it
    cy.get(".data-table-clear-filters").click();
    //the clear filter button should no longer be there!
    cy.get(".data-table-clear-filters").should("not.exist");
  });
  it(`it can select a cell via a data-test attribute`, () => {
    cy.get(`[data-test="tgCell_type.special"]`)
      .eq(3) //get the third cell just for kicks
      .should("be.visible");
  });
});
