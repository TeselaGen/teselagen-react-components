describe("upload", () => {
  it(`should be able to upload`, () => {
    cy.visit("#/FormComponents");
    cy.uploadFile(
      ".fileUploadZoink.tg-dropzone",
      "createReactionMapTest.csv",
      "text/csv"
    );
  });
});
