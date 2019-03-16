describe("MenuBar", () => {
  beforeEach(() => {
    cy.visit("#/MenuBar");
  });
  it(`menubar can be searched!`, () => {
    cy.contains(".bp3-button-text", "Help").click();
    cy.focused().type("hel");
    cy.contains("File > ReactText");
    cy.focused().type("{selectall}cmd");
    cy.contains("Cmd Submenu");
    cy.contains("File > ReactText");

    cy.focused().type("{selectall}React{enter}");
    cy.contains("Fired ReactText!");
  });
});
