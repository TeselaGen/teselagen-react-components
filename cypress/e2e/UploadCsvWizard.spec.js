const path = require("path");

describe("EditableCellTable.spec", () => {
  it(`wizard should let a "perfect" file through without any additional steps`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.uploadFile(".tg-dropzone", "testUploadWizard_perfect.csv", "text/csv");
    cy.contains(`testUploadWizard_perfect.csv`);
  });
  it(`messed up headers should trigger the wizard`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.contains("or manually enter data").click();
    cy.get(`.rt-td [data-test="tgCell_description"]`)
      .eq(1)
      .click({ force: true });
    cy.focused().type("description{enter}");

    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_name"]:first`
    ).dblclick({ force: true });
    cy.focused().type("a{enter}");
    cy.contains(`.bp3-dialog button`, "Cancel").click();
    cy.uploadFile(
      ".tg-dropzone",
      "testUploadWizard_messedUpHeaders.csv",
      "text/csv",
      true
    );
    cy.contains(
      `It looks like some of the headers in your uploaded file do not match the expected headers. Please look over and correct any issues with the mappings below.`
    );
    cy.contains(".bp3-dialog", `zonk`).should("not.exist"); //the data from the file should be previewed
    cy.get(".bp3-dialog tr:contains(prescription):contains(description)"); //the matched headers should show up
    cy.get(".bp3-dialog tr:contains(name):contains(tame)"); //the matched headers should show up
    cy.get(".bp3-dialog tr:contains(matchType):contains(type2)"); //the matched headers should show up
    cy.get(".bp3-dialog tr:contains(isRegex):contains(typo)").should(
      "not.exist"
    );

    cy.get(`.tg-test-is-regex`).click();
    cy.contains("typo").click({ force: true });
    cy.contains(".bp3-dialog", `zonk`).should("exist"); //the data from the file should be previewed

    cy.contains("Review and Edit Data").click();

    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_name"]:first`
    ).dblclick({ force: true });
    cy.focused().type("a{enter}");
    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_sequence"]:first`
    ).dblclick({ force: true });
    cy.focused().type("g{enter}");
    cy.dragBetween(`.cellDragHandle`, `button:contains(Add 10 Rows)`);
    cy.contains("Add File").click();
    cy.contains(`testUploadWizard_messedUpHeaders_updated.csv`);
    cy.contains(`Added Fixed Up File`);
  });
  it(`isUnique should trigger validation error on file upload`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.tgToggle("enforceNameUnique");
    cy.uploadFile(
      ".tg-dropzone",
      "testUploadWizard_invalidDataNonUnique.csv",
      "text/csv",
      true
    );

    cy.contains(
      `Some of the data doesn't look quite right. Do these header mappings look correct?`
    );
    cy.contains("Review and Edit Data").click();
    cy.get(`[data-tip="This value must be unique"]`);
    cy.get(`.hasCellError:last [data-test="tgCell_name"]`);
    cy.get(`button:contains(Add File).bp3-disabled`);
    cy.contains(`Cancel`).click();
    cy.contains(`File Upload Aborted`);
    cy.get(`.bp3-dialog`).should("not.exist");
  });
  it(`isUnique should work as a validation rule on the table for editing, pasting, undo/redo`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.tgToggle("enforceNameUnique");
    cy.contains("or manually enter data").click();
    cy.get(`[data-test="tgCell_name"]`)
      .eq(4)
      .click({ force: true });
    cy.focused().paste(`pj5_0002	new	cloudy	6	dna
    pj5_0003	new	HOT	6	dna
    pj5_0004	old	rainy	4	dna
    pj5_0004	old	snowy	4	dna`);
    cy.get(`[data-tip="This value must be unique"]`);
    cy.get(`button:contains(Add File).bp3-disabled`);
    cy.get(`.hasCellError:last [data-test="tgCell_name"]`)
      .click({ force: true })
      .type("haha{enter}");
    cy.get(`button:contains(Add File).bp3-disabled`).should("not.exist");
    const IS_LINUX =
      window.navigator.platform.toLowerCase().search("linux") > -1;
    const undoCmd = IS_LINUX ? `{alt}z` : "{meta}z";
    const redoCmd = IS_LINUX ? `{alt}{shift}z` : "{meta}{shift}z";
    cy.get(".data-table-container").type(undoCmd);
    cy.get(`button:contains(Add File).bp3-disabled`);
    cy.focused().type(redoCmd);
    cy.get(`button:contains(Add File).bp3-disabled`).should("not.exist");
  });

  it(`going back and forth between the pages should not clear the data that has been changed unless the column was switched`, () => {
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
    cy.contains("Review and Edit Data").click();
    cy.contains("Back").click();
    cy.get(`.tg-test-sequence .bp3-icon-cross`).click();
    //the data isn't dirty so we shouldn't get a warning about clearing data when changing the column mapping
    cy.contains("Review and Edit Data").click();

    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_name"]:first`
    ).dblclick({ force: true });
    cy.focused().type("asdf{enter}");
    cy.contains("Back").click();

    //the data is dirty so we SHOULD get a warning about clearing data when changing the column mapping
    cy.get(`.tg-test-name .bp3-icon-cross`).click();
    cy.contains(
      `Are you sure you want to edit the columm mapping? This will clear any changes you've already made on the subsequent page.`
    );
    cy.get(`.bp3-button:contains(No)`).click();

    cy.contains("Review and Edit Data").click();
    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_name"]:first`
    ).should("not.exist");
    cy.contains("Back").click();
    //the data is dirty so we SHOULD get a warning about clearing data when changing the column mapping
    cy.get(`.tg-test-name .bp3-icon-cross`).click();
    cy.contains(
      `Are you sure you want to edit the columm mapping? This will clear any changes you've already made on the subsequent page.`
    );
    cy.get(`.bp3-button:contains(Yes)`).click();
    cy.contains("Review and Edit Data").click();
    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_name"]:first`
    ).should("exist");
  });
  it(`invalid data on upload should trigger the wizard`, () => {
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
    cy.contains(`File Upload Aborted`);
    cy.get(`.bp3-dialog`).should("not.exist");
  });
  it(`manual entry should work, additional untouched (_isClean) rows should be omitted`, () => {
    cy.visit("#/UploadCsvWizard");
    cy.contains("or manually enter data").click();
    cy.contains(
      `Input your data here. Hover table headers for additional instructions`
    );
    cy.get(`.rt-td [data-test="tgCell_description"]`)
      .eq(1)
      .click({ force: true });
    cy.focused().type("description{enter}");

    //there should be a checkbox in the isRegex boolean column
    cy.get(`[data-test="Is Regex"] .bp3-checkbox`);

    //should be able to edit and then drag to continue that edit further down
    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_name"]:first`
    ).dblclick({ force: true });
    cy.focused().type("a{enter}");
    cy.get(
      `.hasCellError[data-tip="Please enter a value here"] [data-test="tgCell_sequence"]:first`
    ).dblclick({ force: true });
    cy.focused().type("g{enter}");

    cy.contains(".bp3-button", "Add File").click();
    cy.contains("File Added");
    cy.contains(`manual_data_entry.csv`).click();

    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.readFile(path.join(downloadsFolder, "manual_data_entry.csv")).should(
      "eq",
      `name,description,sequence,isRegex,matchType,type\r\npj5_0001,Example description of a sequence,gtgctttca,false,dna,misc_feature\r\na,description,g,false,,`
    );
  });
});
