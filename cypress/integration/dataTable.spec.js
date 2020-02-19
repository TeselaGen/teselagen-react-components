describe("formComponents", () => {
  beforeEach(() => {
    cy.visit("#/DataTable");
  });
  //TODO THIS IS BREAKING!
  it.skip(`it can select entities across pages`, () => {
    cy.contains("0 Selected");
    //select first entity
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .click();
    cy.contains("1 Selected");

    //go to next page
    cy.get(".data-table-footer .paging-arrow-right").click();
    //select another entity
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .click();
    cy.contains("2 Selected");
  });
  it('should be "normal" (normal===tg-compact-table) by default and have 3 modes, compact===tg-extra-compact-table, normal=tg-compact-table, comfortable=NOTHING_HERE ', () => {
    cy.get(".data-table-container.tg-compact-table");
    cy.get(".tg-table-display-options").click();
    cy.get(".tg-table-display-density select").should("have.value", "compact");
    cy.get(".tg-table-display-density select").select("extraCompact");
    cy.get(".data-table-container.tg-extra-compact-table");
    cy.get(".tg-table-display-options").click();
    cy.get(".tg-table-display-density select").should(
      "have.value",
      "extraCompact"
    );
    cy.get(".tg-table-display-density select").select("normal");
    cy.get(".data-table-container.tg-extra-compact-table").should("not.exist");
  });
  it(`it can copy a single row, selected rows, or cells to the clipboard`, () => {
    //  - copying a single row (selected or not)
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .trigger("contextmenu");
    cy.contains("Copy Row to Clipboard").click({ force: true }); //the force true prevents cypress from unecessarily scrolling when clicking the context menu
    cy.contains("Row Copied");
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .click();
    // - copying a single cell
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .trigger("contextmenu");
    cy.contains("Copy Cell to Clipboard").click({ force: true }); //the force true prevents cypress from unecessarily scrolling when clicking the context menu
    cy.contains("Cell copied");
    // - copying multiple selected rows
    cy.get(`[data-test="tgCell_type.special"]`)
      .eq(1)
      .click();
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .trigger("contextmenu");
    cy.contains("Copy Selected Rows to Clipboard").click({ force: true }); //the force true prevents cypress from unecessarily scrolling when clicking the context menu
    cy.contains("Selected rows copied");
  });
  it(`doesn't break when selecting items across pages and copying`, () => {
    //we have to toggle off the url connected option for right now because it is breaking multi page selection
    cy.tgToggle("urlConnected", false);
    cy.get(".data-table-footer .paging-arrow-right").click();
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .click();
    cy.get(`[data-test="tgCell_type.special"]`)
      .eq(2)
      .click();
    cy.contains("2 Selected");

    cy.get(".data-table-footer .paging-arrow-left").click();
    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .click();
    cy.contains("3 Selected");

    cy.get(`[data-test="tgCell_type.special"]`)
      .first()
      .trigger("contextmenu");
    cy.contains("Copy Selected Rows to Clipboard").click({ force: true }); //the force true prevents cypress from unecessarily scrolling when clicking the context menu
    cy.contains("Selected rows copied");
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
