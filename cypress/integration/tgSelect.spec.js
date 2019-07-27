describe("tgSelect", () => {
  beforeEach(() => {
    cy.visit("#/TgSelect");
  });
  it(`It can search for a custom label`, () => {
    cy.get(".tg-select input").type("i'm some{enter}");
    cy.contains(".tg-select-value", "hey I'm some");
  });
});
