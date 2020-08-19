/// <reference types="cypress" />


declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * tgToggle
     * toggle a demo switch
     * @example
     * cy.tgToggle("propertiesOverridesExample")  //defaults to true
     * cy.tgToggle("propertiesOverridesExample", false) 
     * 
     */
    tgToggle(toggleId: string, toggleOnOrOff: boolean): void;
  }
}
