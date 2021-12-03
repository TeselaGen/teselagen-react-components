describe("upload", () => {
  it(`Uploader component should be able to upload`, () => {
    cy.visit("#/Uploader");

    cy.uploadFile(
      ".tg-dropzone",
      "createReactionMapTest.csv",
      "text/csv",
      true
    );
    cy.get(".tg-upload-file-list-item").should("exist");
  });
  it(`Uploader component should be able to be disabled`, () => {
    cy.visit("#/Uploader");
    cy.get(".tg-dropzone-disabled").should("not.exist");
    cy.tgToggle("disabled");
    cy.get(".tg-dropzone-disabled");
  });

  it(`FileUploadField component should be able to upload`, () => {
    cy.visit("#/FormComponents");
    cy.uploadFile(
      ".fileUploadZoink.tg-dropzone",
      "createReactionMapTest.csv",
      "text/csv",
      true
    );

    cy.get(
      ".bp3-form-group:has(.fileUploadZoink.tg-dropzone) .tg-upload-file-list-item"
    ).should("exist");
  });
  it(`FileUploadField component should not be able to upload if disabled`, () => {
    cy.visit("#/FormComponents");
    cy.tgToggle("disableFileUploadField");
    cy.get(".fileUploadZoink.tg-dropzone-disabled");
    cy.uploadFile(
      ".fileUploadZoink.tg-dropzone",
      "createReactionMapTest.csv",
      "text/csv",
      true
    );
    cy.get(
      ".bp3-form-group:has(.fileUploadZoink.tg-dropzone) .tg-upload-file-list-item"
    ).should("not.exist");
  });
});
