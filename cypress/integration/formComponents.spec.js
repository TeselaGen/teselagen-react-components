describe("formComponents", () => {
  beforeEach(() => {
    cy.visit("#/FormComponents");
  });
  it(`ReactSelectField works for single select`, () => {
    cy.get(".tg-test-react-select-field .tg-select")
      .click()
      .as("inputWrapper")
      .contains("Kyle Craft")
      .click();
    cy.get("@inputWrapper").find(`input[value="Kyle Craft"]`);
    cy.get("@inputWrapper")
      .find(".bp3-icon-cross")
      .click();
    cy.get("@inputWrapper")
      .find(`input[value="Kyle Craft"]`)
      .should("not.exist");
  });
  it(`ReactSelectField multi can add a tag and remove it by hitting the single remove button and not have the 
  menu pop up again`, () => {
    cy.get(".tg-test-react-select-field-multi .tg-select")
      .click()
      .as("inputWrapper")
      .contains("Kyle Craft")
      .click();
    cy.get("@inputWrapper").contains(".bp3-tag", "Kyle Craft");
    cy.get("@inputWrapper")
      .find(".tg-select-option")
      .should("exist");
    cy.get("@inputWrapper")
      .find(".bp3-icon-caret-up")
      .click();
    cy.get("@inputWrapper")
      .find(".tg-select-option")
      .should("not.exist");
    cy.get("@inputWrapper")
      .contains(".bp3-tag", "Kyle Craft")
      .should("exist")
      .find(".bp3-icon-small-cross")
      .click();
    //the select-options should not pop up again after clearing a tag
    cy.get("@inputWrapper")
      .find(".tg-select-option")
      .should("not.exist");
  });
  it(`ReactSelectField multi can add a tag and remove it by hitting the bulk remove button`, () => {
    cy.get(".tg-test-react-select-field-multi .tg-select")
      .click()
      .as("inputWrapper")
      .contains("Kyle Craft")
      .click();
    cy.get("@inputWrapper").contains(".bp3-tag", "Kyle Craft");
    cy.get("@inputWrapper")
      .find(".bp3-icon-cross")
      .click();
    cy.get("@inputWrapper")
      .contains(".bp3-tag", "Kyle Craft")
      .should("not.exist");
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
