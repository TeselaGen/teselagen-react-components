describe("MenuBar", () => {
  beforeEach(() => {
    cy.visit("#/MenuBar");
  });
  it(`menubar can be opened/closed via hotkey by default!`, () => {
    cy.get("body").type("{meta}/");
    cy.focused().type("c");
    cy.get(".tg-menu-search-suggestions").should("exist");
    cy.focused().type("{meta}/");
    cy.get(".tg-menu-search-suggestions").should("not.exist");
  });
  it(`menubar can be searched!`, () => {
    //
    cy.contains(".bp3-button-text", "Help").click();

    // sub menus should appear as disabled if they are!
    cy.focused().type("disabled");
    cy.contains(
      ".tg-menu-search-suggestions .bp3-menu-item.bp3-disabled",
      "I'm disabled"
    ).should("exist");
    // sub menus should be accessible on hover!
    cy.focused().type("{selectall}other");
    cy.contains(".tg-menu-search-suggestions .bp3-menu-item", "Other").trigger(
      "mouseover"
    );
    cy.contains(".bp3-menu-item", "XXXXX").click();

    cy.contains(".bp3-button-text", "Help").click();

    // it should only show the first 10 items by default
    cy.focused().type("c");
    cy.focused().as("mainInput");

    cy.get(".tg-menu-search-suggestions .bp3-menu-item").should(
      "have.length",
      10
    );

    //it should be able to type into a suggestion that is has an input as part of it
    cy.focused().type("{selectall}React");
    cy.contains(".tg-menu-search-suggestions .bp3-menu-item", "Long React")
      .find("input")
      .type("ha");

    cy.get("@mainInput").focus();

    //it should be able to click the
    cy.focused().type("{selectall}Don't Dismiss");
    cy.contains(".bp3-menu-item", "Don't Dismiss").click();
    cy.contains(".bp3-toast", "This menu's not going away any time soon");
    cy.get("@mainInput").focus();

    cy.focused().type("{selectall}React");
    cy.contains(".bp3-menu-item", "ReactText 9").click();
    cy.contains(".bp3-toast", "Fired ReactText!");

    //it can get the File > ReactText path correctly
    cy.contains(".bp3-button-text", "Help").click();
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
