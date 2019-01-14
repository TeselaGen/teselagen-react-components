describe("formComponents", () => {
  beforeEach(() => {
    cy.visit("#/DataTable");
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
      .eq(3)
      .should("be.visible");
  });
});
