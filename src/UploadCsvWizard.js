import React, { useState } from "react";
import { reduxForm, change } from "redux-form";
import { Button, Callout, Card, Intent } from "@blueprintjs/core";
import immer from "immer";

import "./UploadCsvWizard.css";

import { forEach } from "lodash";
import { flatMap } from "lodash";
import { compose } from "recompose";
import SimpleStepViz from "./SimpleStepViz";
import { nanoid } from "nanoid";
import { tgFormValueSelector } from "./utils/tgFormValues";
import { some } from "lodash";
import { times } from "lodash";
import { ReactSelectField } from "./FormComponents";
import DialogFooter from "./DialogFooter";
import DataTable from "./DataTable";
import wrapDialog from "./wrapDialog";
import { omit } from "lodash";
import showConfirmationDialog from "./showConfirmationDialog";
import { connect } from "react-redux";
import { isString } from "lodash";
import getIdOrCodeOrIndex from "./DataTable/utils/getIdOrCodeOrIndex";

const UploadCsvWizardDialog = compose(
  reduxForm({
    form: "correctCSVHeadersForm"
  }),
  connect(undefined, { changeForm: change }),
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
)(function UploadCsvWizardDialog({
  validateAgainstSchema,
  initialMatchedHeaders,
  userSchema,
  searchResults,
  onUploadWizardFinish,
  csvValidationIssue,
  //fromRedux:
  handleSubmit,
  // onlyShowRowsWErrors,
  reduxFormEntities,
  reduxFormCellValidation,
  changeForm
}) {
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
          showDoesDataLookCorrectMsg: true,
          initialEntities: reduxFormEntities,
          matchedHeaders,
          // onlyShowRowsWErrors,
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
                        beforeOnChange={async () => {
                          if (reduxFormEntities && reduxFormEntities.isDirty) {
                            const doAction = await showConfirmationDialog({
                              text:
                                "Are you sure you want to edit the columm mapping? This will clear any changes you've already made on the subsequent page.",
                              intent: Intent.DANGER, //applied to the right most confirm button
                              confirmButtonText: "Yes",
                              cancelButtonText: "No"
                              // canEscapeKeyCancel: true //this is false by default
                            });
                            if (doAction) {
                              changeForm(
                                "editableCellTable",
                                "reduxFormEntities",
                                null
                              );
                            } else {
                              return { stopEarly: true };
                            }
                          } else if (reduxFormEntities) {
                            changeForm(
                              "editableCellTable",
                              "reduxFormEntities",
                              null
                            );
                          }
                        }}
                        onChange={async val => {
                          //when the column mapping changes, update the column in reduxFormEntities (if reduxFormEntities exists)
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
  const { entsToUse, validationToUse } = removeCleanRows(
    reduxFormEntities,
    reduxFormCellValidation
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SimpleStepViz style={{ marginTop: 8 }} steps={steps}></SimpleStepViz>
      </div>
      <div className="bp3-dialog-body">{inner}</div>
      <DialogFooter
        text={!hasSubmitted ? "Review and Edit Data" : "Add File"}
        disabled={
          hasSubmitted && (!entsToUse?.length || some(validationToUse, v => v))
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
                entsToUse,
                validateAgainstSchema
              )
            });
          }
        })}
        style={{ alignSelf: "end" }}
      ></DialogFooter>
    </div>
  );
});

export default UploadCsvWizardDialog;

export const PreviewCsvData = function({
  formName,
  matchedHeaders,
  showDoesDataLookCorrectMsg,
  headerMessage,
  // onlyShowRowsWErrors,
  validateAgainstSchema,
  userSchema = { userData: times(5) },
  initialEntities
}) {
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   // simulate layout change outside of React lifecycle
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 400);
  // }, []);

  const forceUpdate = useForceUpdate();

  const data =
    userSchema.userData &&
    userSchema.userData.length &&
    userSchema.userData.map((row, i1) => {
      const toRet = {};
      validateAgainstSchema.fields.forEach(
        ({ path, defaultValue, example }, i) => {
          const matchingKey = matchedHeaders?.[i];

          if (!matchingKey) {
            toRet[path] = defaultValue === undefined ? defaultValue : "";
          } else {
            toRet[path] = row[matchingKey];
          }
          if (toRet[path] === undefined || toRet[path] === "") {
            toRet[path] = defaultValue || (i1 === 0 && example) || "";
          }
        }
      );
      if (i1 > 0) {
        toRet._isClean = true;
      }
      if (row.id === undefined) {
        toRet.id = nanoid();
      } else {
        toRet.id = row.id;
      }
      return toRet;
    });

  return (
    <div style={{ minWidth: 400 }}>
      <Callout style={{ marginBottom: 5 }} intent="primary">
        {headerMessage ||
          (showDoesDataLookCorrectMsg
            ? "Does this data look correct? Edit it as needed."
            : "Input your data here. Hover table headers for additional instructions")}
      </Callout>
      {validateAgainstSchema.description && (
        <Callout>{validateAgainstSchema.description}</Callout>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}
      >
        {validateAgainstSchema.allowAdditionalOnEnd && (
          <Button
            icon="plus"
            onClick={() => {
              const path = prompt(
                `Enter the name of the column you would like to add. ${validateAgainstSchema.allowAdditionalOnEndDescription ||
                  ""}`
              );
              if (path) {
                validateAgainstSchema.fields.push({
                  description: "",
                  path: `${
                    isString(validateAgainstSchema.allowAdditionalOnEnd)
                      ? validateAgainstSchema.allowAdditionalOnEnd
                      : ""
                  }${path}`,
                  displayName: `${
                    isString(validateAgainstSchema.allowAdditionalOnEnd)
                      ? validateAgainstSchema.allowAdditionalOnEnd
                      : ""
                  }${path}`,
                  type: "string"
                });
                forceUpdate();
              }
            }}
          >
            Add Column
          </Button>
        )}
      </div>
      <DataTable
        maxWidth={800}
        maxHeight={500}
        initialEntities={initialEntities}
        destroyOnUnmount={false}
        doNotValidateUntouchedRows
        formName={formName || "editableCellTable"}
        isSimple
        isCellEditable
        entities={data || []}
        schema={validateAgainstSchema}
      ></DataTable>
    </div>
  );
};

export const SimpleInsertDataDialog = compose(
  wrapDialog({
    canEscapeKeyClose: false,
    title: "Insert Data",
    style: { width: "fit-content" }
  }),
  tgFormValueSelector(
    "simpleInsertEditableTable",
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
  const { entsToUse, validationToUse } = removeCleanRows(
    reduxFormEntities,
    reduxFormCellValidation
  );

  return (
    <>
      <div className="bp3-dialog-body">
        <PreviewCsvData
          {...{
            ...r,
            validateAgainstSchema,
            formName: "simpleInsertEditableTable"
          }}
        ></PreviewCsvData>
      </div>
      <DialogFooter
        onClick={() => {
          onSimpleInsertDialogFinish({
            newEntities: maybeStripIdFromEntities(
              entsToUse,
              validateAgainstSchema
            )
          });
        }}
        disabled={!entsToUse?.length || some(validationToUse, e => e)}
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
function removeCleanRows(reduxFormEntities, reduxFormCellValidation) {
  const toFilterOut = {};
  const entsToUse = (reduxFormEntities || []).filter(e => {
    if (!e._isClean) return true;
    else {
      toFilterOut[getIdOrCodeOrIndex(e)] = true;
      return false;
    }
  });

  const validationToUse = {};
  forEach(reduxFormCellValidation, (v, k) => {
    const [rowId] = k.split(":");
    if (!toFilterOut[rowId]) {
      validationToUse[k] = v;
    }
  });
  return { entsToUse, validationToUse };
}

function maybeStripIdFromEntities(ents, validateAgainstSchema) {
  if (validateAgainstSchema?.fields?.some(({ path }) => path === "id")) {
    return ents;
  } else {
    // if the schema we're validating against itself didn't have an id field,
    // we don't want to include it in the returned entities
    return ents?.map(e => omit(e, ["id"]));
  }
}

//create your forceUpdate hook
function useForceUpdate() {
  const [, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}
