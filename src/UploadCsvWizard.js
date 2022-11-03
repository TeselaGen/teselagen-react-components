import React, { useState } from "react";
import { reduxForm } from "redux-form";
import { Callout, Card } from "@blueprintjs/core";
import immer from "immer";

import "./UploadCsvWizard.css";

import { forEach } from "lodash";
import { flatMap } from "lodash";
import { compose } from "recompose";
import SimpleStepViz from "./SimpleStepViz";
import { nanoid } from "nanoid";
import tgFormValues, { tgFormValueSelector } from "./utils/tgFormValues";
import { some } from "lodash";
import { times } from "lodash";
import { ReactSelectField, SwitchField } from "./FormComponents";
import DialogFooter from "./DialogFooter";
import DataTable from "./DataTable";
import wrapDialog from "./wrapDialog";
import { omit } from "lodash";

const UploadCsvWizardDialog = compose(
  reduxForm({
    form: "correctCSVHeadersForm"
  }),
  wrapDialog({
    canEscapeKeyClose: false,
    title: "Upload Helper",
    style: { width: "fit-content" }
  }),
  tgFormValueSelector(
    "editableCellTable",
    "reduxFormEntities",
    "reduxFormCellValidation"
  )
)(
  ({
    validateAgainstSchema,
    initialMatchedHeaders,
    userSchema,
    searchResults,
    onUploadWizardFinish,
    csvValidationIssue,
    //fromRedux:
    handleSubmit,
    onlyShowRowsWErrors,
    reduxFormEntities,
    reduxFormCellValidation
  }) => {
    const [hasSubmitted, setSubmitted] = useState();
    const [steps, setSteps] = useState([
      { text: "Set Headers", active: true },
      { text: "Review Data", active: false }
    ]);

    const flippedMatchedHeaders = {};

    const [matchedHeaders, setMatchedHeaders] = React.useState(
      initialMatchedHeaders
    );
    forEach(matchedHeaders, (v, k) => {
      if (v) flippedMatchedHeaders[v] = k;
    });
    let inner;
    if (hasSubmitted) {
      inner = (
        <PreviewCsvData
          {...{
            matchedHeaders,
            onlyShowRowsWErrors,
            validateAgainstSchema,
            userSchema
          }}
        ></PreviewCsvData>
      );
    } else {
      inner = (
        <div style={{ maxWidth: 500 }}>
          <Callout style={{ width: "fit-content" }} intent="warning">
            {csvValidationIssue}
          </Callout>
          <br></br>

          {searchResults.map(({ path, type }, i) => {
            const userMatchedHeader = matchedHeaders[i];
            return (
              <Card style={{ padding: 2 }} key={i}>
                <table>
                  <tbody>
                    <tr
                      style={{
                        display: "flex",
                        minHeight: 50,
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <td
                        style={{
                          width: 200,
                          display: "flex"
                        }}
                      >
                        <div
                          style={{
                            paddingTop: 2,
                            marginLeft: 15,
                            fontSize: 15
                          }}
                        >
                          <span
                            data-tip={`Column Type: ${typeToCommonType[
                              type || "string"
                            ] || type}`}
                          >
                            {path}
                          </span>
                          {/*  <div
                            style={{ opacity: 0.5, marginTop: 3, fontSize: 8 }}
                          >
                            
                          </div> */}
                        </div>
                      </td>
                      <td style={{ width: 200 }}>
                        <ReactSelectField
                          noMarginBottom
                          tooltipError
                          onChange={val => {
                            setMatchedHeaders({ ...matchedHeaders, [i]: val });
                          }}
                          name={path}
                          // isRequired={!allowEmpty && defaultValue === undefined}
                          defaultValue={matchedHeaders[i]}
                          options={flatMap(userSchema.fields, ({ path }) => {
                            if (
                              path !== matchedHeaders[i] &&
                              flippedMatchedHeaders[path]
                            ) {
                              return [];
                            }
                            return {
                              value: path,
                              label: path
                            };
                          }).sort((a, b) => {
                            const ra = searchResults[i].matches
                              .map(m => m.item.path)
                              .indexOf(a.value);
                            const rb = searchResults[i].matches
                              .map(m => m.item.path)
                              .indexOf(b.value);
                            if (!ra) return -1;
                            if (!rb) return 1;
                            return rb - ra;
                          })}
                        ></ReactSelectField>
                      </td>
                      <td
                        style={{
                          marginTop: 10,
                          marginBottom: 10,
                          marginLeft: 20,
                          fontSize: 10 /* color: Colors.RED1 */
                        }}
                      >
                        {userMatchedHeader &&
                          [
                            { [userMatchedHeader]: "Preview:" },
                            ...userSchema.userData?.slice(0, 3)
                            // { [userMatchedHeader]: "..." }
                          ].map((row, i) => {
                            return (
                              <div
                                style={{
                                  ...(i === 0 && { fontWeight: "bold" }),
                                  maxWidth: 70,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                                key={i}
                              >
                                {row?.[userMatchedHeader]}
                              </div>
                            );
                          })}
                        {/* {!allowEmpty &&
                        defaultValue === undefined &&
                        "(Required)"} */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            );
          })}
        </div>
      );
    }

    return (
      <div style={{ width: "fit-content" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SimpleStepViz style={{ marginTop: 8 }} steps={steps}></SimpleStepViz>
        </div>
        <div className="bp3-dialog-body">{inner}</div>
        <DialogFooter
          text={!hasSubmitted ? "Review and Edit Data" : "Add File"}
          disabled={
            hasSubmitted &&
            (!reduxFormEntities?.length ||
              some(reduxFormCellValidation, v => v))
          }
          {...(hasSubmitted && {
            onBackClick: () => {
              setSteps(
                immer(steps, draft => {
                  draft[0].active = true;
                  draft[0].completed = false;
                  draft[1].active = false;
                })
              );
              setSubmitted(false);
            }
          })}
          onClick={handleSubmit(async function() {
            if (!hasSubmitted) {
              //step 1 submit
              setSteps(
                immer(steps, draft => {
                  draft[0].active = false;
                  draft[0].completed = true;
                  draft[1].active = true;
                })
              );
              setSubmitted(true);
            } else {
              //step 2 submit
              onUploadWizardFinish({
                newEntities: maybeStripIdFromEntities(
                  reduxFormEntities,
                  validateAgainstSchema
                )
              });
              // console.log(`reduxFormEntities`, reduxFormEntities);
              // console.log(`reduxFormCellValidation`, reduxFormCellValidation);
            }
          })}
          style={{ alignSelf: "end" }}
        ></DialogFooter>
      </div>
    );
  }
);

export default UploadCsvWizardDialog;

export const PreviewCsvData = tgFormValues("onlyShowRowsWErrors")(function({
  matchedHeaders,
  headerMessage,
  onlyShowRowsWErrors,
  validateAgainstSchema,
  userSchema = { userData: times(5) }
}) {
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   // simulate layout change outside of React lifecycle
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 400);
  // }, []);

  const data =
    userSchema.userData &&
    userSchema.userData.length &&
    userSchema.userData.map(row => {
      const toRet = {};
      validateAgainstSchema.fields.forEach(({ path, defaultValue }, i) => {
        const matchingKey = matchedHeaders?.[i];

        if (!matchingKey) {
          toRet[path] = defaultValue === undefined ? defaultValue : "";
        } else {
          toRet[path] = row[matchingKey];
        }
        if (toRet[path] === undefined || toRet[path] === "") {
          toRet[path] = defaultValue || "";
        }
      });
      if (row.id === undefined) {
        toRet.id = nanoid();
      } else {
        toRet.id = row.id;
      }
      return toRet;
    });

  return (
    <div style={{}}>
      <h5>
        {headerMessage || "Does this data look correct? Edit it as needed."}
      </h5>
      <SwitchField
        name="onlyShowRowsWErrors"
        inlineLabel={true}
        label="Only Show Rows With Errors"
      />
      <DataTable
        maxWidth={800}
        maxHeight={500}
        formName="editableCellTable"
        isSimple
        noAddMoreRowsButton={onlyShowRowsWErrors}
        onlyShowRowsWErrors={onlyShowRowsWErrors}
        isCellEditable
        entities={data || []}
        schema={validateAgainstSchema}
      ></DataTable>
    </div>
  );
});

export const SimpleInsertDataDialog = compose(
  wrapDialog({
    canEscapeKeyClose: false,
    title: "Insert Data",
    style: { width: "fit-content" }
  }),
  tgFormValueSelector(
    "editableCellTable",
    "reduxFormEntities",
    "reduxFormCellValidation"
  )
)(function SimpleInsertDataDialog({
  onSimpleInsertDialogFinish,
  reduxFormEntities,
  reduxFormCellValidation,
  validateAgainstSchema,
  ...r
}) {
  return (
    <>
      <div className="bp3-dialog-body">
        <PreviewCsvData {...{ ...r, validateAgainstSchema }}></PreviewCsvData>
      </div>
      <DialogFooter
        onClick={() => {
          onSimpleInsertDialogFinish({
            newEntities: maybeStripIdFromEntities(
              reduxFormEntities,
              validateAgainstSchema
            )
          });
        }}
        disabled={
          !reduxFormEntities?.length || some(reduxFormCellValidation, e => e)
        }
        text="Add File"
      ></DialogFooter>
    </>
  );
});

const typeToCommonType = {
  string: "Text",
  number: "Number",
  boolean: "True/False",
  dropdown: "Select One"
};
function maybeStripIdFromEntities(ents, validateAgainstSchema) {
  if (validateAgainstSchema?.fields?.some(({ path }) => path === "id")) {
    return ents;
  } else {
    // if the schema we're validating against itself didn't have an id field,
    // we don't want to include it in the returned entities
    return ents?.map(e => omit(e, ["id"]));
  }
}
