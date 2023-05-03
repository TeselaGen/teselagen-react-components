import React from "react";
import { Provider } from "react-redux";
import { Button } from "@blueprintjs/core";
import store from "../store";
import { FileUploadField } from "../../../src";
import DemoWrapper from "../DemoWrapper";
import { parseCsvOrExcelFile } from "../../../src/utils/parserUtils";
import { reduxForm } from "redux-form";
import { useToggle } from "../useToggle";

const simpleValidateAgainst = {
  fields: [{ path: "name" }, { path: "description" }, { path: "sequence" }]
};
const validateAgainstSchema = {
  helpInstructions:
    "This template file is used to add rows to the sequence table.",
  allowAdditionalOnEnd: "ext-", // allow additional fields that start with "ext-" at the end of the csv
  allowAdditionalOnEndDescription:
    "This will add extended properties to the uploaded sequence",
  fields: [
    {
      isRequired: true,
      isUnique: true, //tnw - we need to make sure this actually gets enforced
      path: "name",
      description: "The Sequence Name",
      example: "pj5_0001"
    },
    { path: "description", example: "Example description of a sequence" },
    {
      isRequired: true,
      path: "sequence",
      example: "gtgctttca",
      description: "The dna sequence base pairs"
    },
    {
      path: "isRegex",
      type: "boolean",
      description: "Whether the sequence is a regex",
      defaultValue: false
    },
    {
      path: "matchType",
      type: "dropdown",
      description: "Whether the sequence is a dna or protein sequence",
      values: ["dna", "protein"],
      defaultValue: "dna"
    },
    {
      path: "type",
      type: "dropdown",
      values: ["misc_feature", "CDS", "rbs"],
      defaultValue: "misc_feature"
    }
  ]
};

export default function UploadCsvWizardDemo() {
  return (
    <Provider store={store}>
      <div className="form-components">
        <Inner></Inner>
      </div>
    </Provider>
  );
}

const Inner = reduxForm({ form: "UploadCsvWizardDemo" })(({ handleSubmit }) => {
  const [simpleSchema, simpleSchemaComp] = useToggle({
    type: "simpleSchemaButton",
    label: "Simple Schema"
  });
  return (
    <DemoWrapper>
      <h6>FileUploadField with file limit</h6>

      {simpleSchemaComp}
      <FileUploadField
        label="CSV upload with wizard"
        onFieldSubmit={function(fileList) {
          console.info("do something with the finished file list:", fileList);
        }}
        isRequired
        className={"fileUploadLimitAndType"}
        accept={[
          {
            type: [".csv", ".xlsx"],
            validateAgainstSchema: simpleSchema
              ? simpleValidateAgainst
              : validateAgainstSchema,
            exampleFile: "/manual_data_entry (3).csv"
          }
        ]}
        name={"exampleFile"}
        fileLimit={1}
      />
      <Button
        intent="success"
        text="Submit Form"
        onClick={handleSubmit(async function(values) {
          const { data } = await parseCsvOrExcelFile(values.exampleFile, {
            validateAgainstSchema,
            csvParserOptions: {
              lowerCaseHeaders: true
            }
          });
        })}
      />
    </DemoWrapper>
  );
});
