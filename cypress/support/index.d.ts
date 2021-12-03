/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * uploadFile
     * uploads a file to a dropzone uploader
     * @param selector - cypress selector class for drop element
     * @param fileUrl - file url relative to the fixtures folder
     * @param type - file type
     * @param noFileList - whether the upload doesn't have a file list (custom render), this will ignore the checks for file loading
     * @example
     * cy.uploadFile(".tg-dropzone", "tubes.csv", "text/csv")
     */
    uploadFile(
      selector: string,
      fileUrl: string,
      type?: string,
      noFileList?: boolean
    ): void;
    
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
