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
