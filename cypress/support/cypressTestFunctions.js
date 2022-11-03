/**
 * catch downloaded file and toastr message
 *
 * should be called after the download/export button was clicked
 */

import { isFunction } from "lodash";

// NOTE: this function only work when the 'src-shared/utils/downloadTest.js'
// file is used to download the file in the app.
export function catchDownload(contentOrFn, withDialog = true) {
  if (withDialog) {
    cy.get(
      ".bp3-toast.bp3-toast-enter-done:contains(mock file downloaded) .bp3-icon-cross"
    ).click();
  }
  cy.window().then(win => {
    cy.waitUntil(() => win.Cypress.cypressTestFile).then(() => {
      if (!contentOrFn) return;
      if (isFunction(contentOrFn)) {
        return contentOrFn(win.Cypress.cypressTestFile);
      }
      const content = contentOrFn;
      //tnr get filestring another way here
      const fileString = win.Cypress.cypressTestFile.toString();
      let hasMatch = false;
      // compare every substring in the file to find matching content.
      for (
        let start = 0;
        start + content.length <= fileString.length;
        start++
      ) {
        const end = start + content.length;
        const potentialMatch = fileString.substring(start, end);
        if (potentialMatch === content) {
          hasMatch = true;
          break;
        }
      }
      if (!hasMatch) {
        // eslint-disable-next-line no-debugger
        debugger;
        //Manually throw an error message
        console.info(
          "win.Cypress.cypressTestFile:",
          win.Cypress.cypressTestFile
        );
        throw new Error(
          `\nTest failed:\nExported/downloaded file's content does not match as expected.\n
          Expected to find: ${content}`
        );
      }
    });
  });
}
