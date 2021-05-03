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
  it(`creatable won't allow for making duplicates`, () => {
    cy.tgToggle("creatable");
    cy.get(".tg-select input").type("tHEr");
    cy.contains(".tg-select-option", "There");
    cy.contains(".bp3-menu-item", `Create "tHEr"`);
    cy.get(".tg-select input").type("e");
    cy.contains(".tg-select-option", "There");
    cy.contains(".bp3-menu-item", `Create "tHEr"`).should("not.exist");
  });
  it(`creatable multi select won't allow for making duplicates`, () => {
    cy.tgToggle("creatable");
    cy.tgToggle("multi");
    cy.get(".tg-select input").type("hey");
    cy.contains(".tg-select-option", "hey");
    cy.contains(".bp3-menu-item", `Create "hey"`).should("not.exist");
    cy.get(".tg-select input").type("a");
    cy.contains(".bp3-menu-item", `Create "heya"`).should("exist");
  });
});
