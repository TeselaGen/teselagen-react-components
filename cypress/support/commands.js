// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const { isString } = require("lodash");

Cypress.Commands.add("tgToggle", (type, onOrOff = true) => {
  /* eslint-disable no-unexpected-multiline*/

  return cy
    .get(`[data-test="${type}"]`)
    [onOrOff ? "check" : "uncheck"]({ force: true });
  /* eslint-enable no-unexpected-multiline*/
});

Cypress.Commands.add("dragBetween", (dragSelector, dropSelector) => {
  const getOrWrap = selector =>
    isString(selector)
      ? cy.get(selector).then(el => {
          return el.first();
        })
      : cy.wrap(selector);

  getOrWrap(dragSelector)
    .trigger("mousedown")
    .trigger("mousemove", 10, 10, { force: true });
  getOrWrap(dropSelector)
    .trigger("mousemove", { force: true })
    .trigger("mouseup", { force: true });
});

Cypress.Commands.add(
  "uploadFile",
  (selector, fileUrl, type = "", noFileList) => {
    return cy
      .fixture(fileUrl, "base64")
      .then(fixture => {
        if (type === "application/json") {
          return new Blob([JSON.stringify(fixture, null, 2)], {
            type: "application/json"
          });
        } else {
          return Cypress.Blob.base64StringToBlob(fixture);
        }
      })
      .then(blob => {
        return dropFile({ blob, selector, fileUrl, type, noFileList });
      });
  }
);

function dropFile({
  file,
  blob,
  selector,
  fileUrl,
  filename,
  type,
  noFileList
}) {
  return cy
    .window()
    .then(win => {
      //papaparse was doing an instanceOf window.File check that was failing so we needed
      //https://github.com/cypress-io/cypress/issues/170#issuecomment-411289023
      let name = filename;
      if (!name) {
        const nameSegments = fileUrl.split("/");
        name = nameSegments[nameSegments.length - 1];
      }
      let testFile;
      if (file) {
        testFile = file;
      } else {
        testFile = new win.File([blob], name, { type });
      }
      const event = { dataTransfer: { files: [testFile], types: ["Files"] } };
      // return subject
      return cy.get(selector).trigger("drop", event);
    })
    .then(() => {
      if (!noFileList) {
        cy.get(
          `.bp3-form-group:has(${selector}) .tg-upload-file-list-item`
        ).should("exist");
        cy.get(".tg-spin").should("not.exist");
      }
    });
}
