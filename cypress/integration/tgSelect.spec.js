describe("tgSelect", () => {
  beforeEach(() => {
    cy.visit("#/TgSelect");
  });
  it(`isTagSelect will only allow a single tag option to be selected at a time`, () => {
    cy.tgToggle("isTagSelect");
    cy.get(".tg-select input").type("my friend{enter}");
    cy.contains(".bp3-tag-input-values", "my: friend");

    cy.get(".tg-select input").type("my accomplice{enter}");
    cy.contains(".bp3-tag-input-values", "my: friend").should("not.exist");
    cy.contains(".bp3-tag-input-values", "my: accomplice").should("exist");
  });
  it(`It can search for a custom label`, () => {
    cy.get(".tg-select input").type("i'm some{enter}");
    cy.contains(".tg-select-value", "hey I'm some");
  });
});
