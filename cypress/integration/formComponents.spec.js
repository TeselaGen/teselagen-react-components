describe("formComponents", () => {
  beforeEach(() => {
    cy.visit("#/FormComponents");
  });
  it(`isRequired can be passed to any field to make it required!`, () => {
    cy.contains(".bp3-button", "Submit Form").click();
    cy.contains(".tg-test-text-area-field", "This field is required.");
  });
  it(`TextAreaField can be edited like normal`, () => {
    cy.get(".tg-test-text-area-field textarea").type("test text");
  });

  it(`TextAreaField should have an option "clickToEdit" to not be immediately editable
  - edit disabled before
  - click edit allows edit
  - click cancel cancels edit and discards edits 
  - cmd + enter enters 
  - clicking okay enters
  `, () => {
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").should(
      "be.disabled"
    );

    cy.get(".tg-test-text-area-field-with-click-to-edit button")
      .contains("Edit")
      .click();
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").type(
      "test text"
    );
    cy.get(".tg-test-text-area-field-with-click-to-edit button")
      .contains("Ok")
      .click();
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").contains(
      "test text"
    );
    cy.get(".tg-test-text-area-field-with-click-to-edit button")
      .contains("Edit")
      .click();
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").type("123");
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").contains(
      "test text123"
    );
    cy.get(".tg-test-text-area-field-with-click-to-edit button")
      .contains("Cancel")
      .click();
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").contains(
      "test text"
    );
    cy.get(".tg-test-text-area-field-with-click-to-edit button")
      .contains("Edit")
      .click();
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").type("33");
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").type(
      "{cmd}{enter}"
    );
    cy.get(".tg-test-text-area-field-with-click-to-edit button").contains(
      "Edit"
    );
    cy.get(".tg-test-text-area-field-with-click-to-edit textarea").contains(
      "test text33"
    );
  });
});
