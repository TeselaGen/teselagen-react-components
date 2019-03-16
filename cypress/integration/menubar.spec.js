describe("MenuBar", () => {
  beforeEach(() => {
    cy.visit("#/MenuBar");
  });
  it(`menubar can be opened via hotkey by default!`, () => {
    cy.get("body").type("{alt}/");
    cy.focused().type("c");
    cy.get(".tg-menu-search-suggestions").should("exist");
  });
  it(`menubar can be searched!`, () => {
    //
    cy.contains(".bp3-button-text", "Help").click();

    // it should only show the first 10 items by default
    cy.focused().type("c");
    cy.get(".tg-menu-search-suggestions .bp3-menu-item").should(
      "have.length",
      10
    );
    cy.focused().as("mainInput");

    //it should be able to type into a suggestion that is has an input as part of it
    cy.focused().type("{selectall}React");
    cy.contains(".tg-menu-search-suggestions .bp3-menu-item", "Long React")
      .find("input")
      .type("ha");
    cy.get("@mainInput").focus();

    //it should be able to click the
    cy.focused().type("{selectall}Don't Dismiss");
    cy.contains(".bp3-menu-item", "Don't Dismiss").click();
    cy.get("@mainInput").focus();

    //it can get the File > ReactText path correctly
    cy.focused().type("{selectall}hel");
    cy.contains(".bp3-menu-item", "File > ReactText");

    //menu items with hideFromMenuSearch should not show up
    cy.focused().type("{selectall}About");
    cy.contains(".bp3-menu-item-label", "Help").should("not.exist");

    //dynamic cmd created submenus should be visible
    cy.focused().type("{selectall}cmd");
    cy.contains(".bp3-menu-item", "Cmd Submenu");
    cy.contains(".bp3-menu-item", "File > ReactText");

    //it should be able to find the ReactText menu item which has a jsx text item
    //activate it, and the main input should be closed
    cy.focused().type("{selectall}React{enter}");
    cy.contains(".bp3-toast", "Fired ReactText!");
    cy.get(".tg-menu-search-suggestions").should("not.exist");
  });
});
