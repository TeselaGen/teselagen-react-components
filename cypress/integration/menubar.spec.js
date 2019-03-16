describe("MenuBar", () => {
  beforeEach(() => {
    cy.visit("#/MenuBar");
  });
  it(`menubar can be searched!`, () => {
    //
    cy.contains(".bp3-button-text", "Help").click();
    cy.focused().type("hel");
    cy.contains("File > ReactText");

    //menu items with hideFromMenuSearch should not show up
    cy.focused().type("{selectall}About");
    cy.contains(".bp3-menu-item-label", "Help").should("not.exist");

    //dynamic cmd created submenus should be visible
    cy.focused().type("{selectall}cmd");
    cy.contains("Cmd Submenu");
    cy.contains("File > ReactText");

    //it should be able to find the ReactText menu item which has a jsx text item
    cy.focused().type("{selectall}React{enter}");
    cy.contains("Fired ReactText!");
  });
});
