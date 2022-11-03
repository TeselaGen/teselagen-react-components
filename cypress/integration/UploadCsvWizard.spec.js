const { catchDownload } = require("../support/cypressTestFunctions");

describe("EditableCellTable.spec", () => {
  it(`wizard should let a "perfect" file through without any additional steps`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.uploadFile(".tg-dropzone", "testUploadWizard_perfect.csv", "text/csv");
    cy.contains(`testUploadWizard_perfect.csv`);
  });
  it(`invalid data should trigger the wizard`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.uploadFile(
      ".tg-dropzone",
      "testUploadWizard_invalidData.csv",
      "text/csv",
      true
    );
    cy.contains(
      `Some of the data doesn't look quite right. Do these header mappings look correct?`
    );
    cy.contains(".bp3-dialog", `zonk`); //the data from the file should be previewed
    cy.contains(".bp3-dialog", `DEscription`); //the matched headers should show up
    cy.contains(".bp3-dialog", `description`); //the expected headers should show up
    cy.contains("Review and Edit Data").click();
    cy.get(`[data-tip="Please enter a value here"]`);
    cy.get(`.hasCellError:last [data-test="tgCell_name"]`);
    cy.get(`button:contains(Add File).bp3-disabled`);
    cy.contains(`Cancel`).click();
  });
  it(`manual entry should work`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.contains("or manually enter data").click();
    cy.contains(`Does this data look correct? Edit it as needed.`);

    //there should be a checkbox in the isRegex boolean column
    cy.get(`[data-test="Is Regex"] .bp3-checkbox`);

    //should be able to edit and then drag to continue that edit further down
    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_name"]:first`
    ).dblclick({ force: true });
    cy.focused().type("a{enter}");
    cy.dragBetween(`.cellDragHandle`, `button:contains(Add 10 Rows)`);

    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_sequence"]:first`
    ).dblclick({ force: true });
    cy.focused().type("g{enter}");
    cy.dragBetween(`.cellDragHandle`, `button:contains(Add 10 Rows)`);

    cy.contains("Add File").click();
    cy.contains("File Added");
    cy.contains(`manual_data_entry.csv`).click();
    catchDownload(`name,description,sequence,isRegex,matchType,type
a,,g,false,dna,misc_feature
a,,g,false,dna,misc_feature
a,,g,false,dna,misc_feature
a,,g,false,dna,misc_feature
a,,g,false,dna,misc_feature`);
  });
});
