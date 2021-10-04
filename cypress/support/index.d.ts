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

    /**
     * This function will drag an element from the source to the destination
     * @param dragSelector
     * @param dropSelector
     */
    dragBetween(dragSelector, dropSelector): void;
  }
}
