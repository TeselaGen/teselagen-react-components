/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import downloadjs from "downloadjs";

export function downloadHelper(data, fileName, type) {
  if (window.Cypress) {
    window.Cypress.cypressTestFile = data;
    window.toastr.success("mock file downloaded");
  } else {
    downloadjs(data, fileName, type);
  }
}
