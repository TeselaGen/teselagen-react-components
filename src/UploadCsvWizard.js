import React, { useState } from "react";
import { reduxForm, change, formValueSelector, destroy } from "redux-form";
import { Callout, Icon, Intent, Tab, Tabs } from "@blueprintjs/core";
import immer from "immer";

import "./UploadCsvWizard.css";

import { forEach, isArray } from "lodash";
import { compose } from "recompose";
import SimpleStepViz from "./SimpleStepViz";
import { nanoid } from "nanoid";
import { tgFormValueSelector } from "./utils/tgFormValues";
import { some } from "lodash";
import { times } from "lodash";
import DialogFooter from "./DialogFooter";
import DataTable from "./DataTable";
import wrapDialog from "./wrapDialog";
import { omit } from "lodash";
import { connect } from "react-redux";
import getIdOrCodeOrIndex from "./DataTable/utils/getIdOrCodeOrIndex";
import { MatchHeaders } from "./MatchHeaders";

const getInitialSteps = csvValidationIssue => [
  { text: "Set Headers", active: csvValidationIssue },
  { text: "Review Data", active: !csvValidationIssue }
];

const UploadCsvWizardDialog = compose(
  wrapDialog({
    canEscapeKeyClose: false,
    style: { width: "fit-content" }
  }),
  reduxForm({
    form: "UploadCsvWizardDialog"
  }),
  connect(
    (state, props) => {
      if (props.filesWIssues.length > 0) {
        const reduxFormEntitiesArray = [];
        const finishedFiles = props.filesWIssues.map((f, i) => {
          const {
            reduxFormEntities,
            reduxFormCellValidation
          } = formValueSelector(`editableCellTable-${i}`)(
            state,
            "reduxFormEntities",
            "reduxFormCellValidation"
          );
          reduxFormEntitiesArray.push(reduxFormEntities);
          const { entsToUse, validationToUse } = removeCleanRows(
            reduxFormEntities,
            reduxFormCellValidation
          );
          return (
            entsToUse &&
            entsToUse.length &&
            !some(validationToUse, v => v) &&
            entsToUse
          );
        });
        return {
          reduxFormEntitiesArray,
          finishedFiles
        };
      }
    },
    { changeForm: change, destroyForms: destroy }
  )
)(function UploadCsvWizardDialogOuter({
  validateAgainstSchema,
  reduxFormEntitiesArray,
  filesWIssues: _filesWIssues,
  finishedFiles,
  onUploadWizardFinish,
  doAllFilesHaveSameHeaders,
  destroyForms,
  csvValidationIssue,
  searchResults,
  matchedHeaders,
  userSchema,
  flippedMatchedHeaders,
  changeForm
}) {
  // will unmount state hook
  React.useEffect(() => {
    return () => {
      destroyForms(
        "editableCellTable",
        ...times(_filesWIssues.length, i => `editableCellTable-${i}`)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [hasSubmittedOuter, setSubmittedOuter] = useState();
  const [steps, setSteps] = useState(getInitialSteps(true));

  const [focusedTab, setFocusedTab] = useState(0);
  const [filesWIssues, setFilesWIssues] = useState(
    _filesWIssues.map(f => ({ ...f, file: { ...f.file } })) //do this little trick to stop immer from preventing the file from being modified
  );
  if (filesWIssues.length > 1) {
    const tabs = (
      <>
        <Callout style={{ marginBottom: 10, flexGrow: 0 }} intent="warning">
          {/* <div>
            It looks like some of the headers/data in your uploaded files have
            issues.
          </div> */}
          <div>
            Please look over each of the following files and correct any issues.
          </div>
        </Callout>
        <Tabs
          // renderActiveTabPanelOnly
          selectedTabId={focusedTab}
          onChange={i => {
            setFocusedTab(i);
          }}
          vertical
        >
          {filesWIssues.map((f, i) => {
            const isGood = finishedFiles[i];

            const isThisTheLastBadFile = finishedFiles.every((ff, j) => {
              if (i === j) {
                return true;
              } else {
                return !!ff;
              }
            });
            return (
              <Tab
                key={i}
                id={i}
                title={
                  <div>
                    <Icon
                      intent={isGood ? "success" : "warning"}
                      icon={isGood ? "tick-circle" : "warning-sign"}
                    ></Icon>{" "}
                    {f.file.name}
                  </div>
                }
                panel={
                  <UploadCsvWizardDialogInner
                    {...{
                      isThisTheLastBadFile,
                      onBackClick:
                        doAllFilesHaveSameHeaders &&
                        (() => {
                          setSubmittedOuter(false);
                          setSteps(getInitialSteps(true));
                        }),
                      onMultiFileUploadSubmit: () => {
                        let nextUnfinishedFile;
                        //find the next unfinished file
                        for (
                          let j = (i + 1) % finishedFiles.length;
                          j < finishedFiles.length;
                          j++
                        ) {
                          if (j === i) {
                            break;
                          } else if (!finishedFiles[j]) {
                            nextUnfinishedFile = j;
                            break;
                          } else if (j === finishedFiles.length - 1) {
                            j = -1;
                          }
                        }

                        if (nextUnfinishedFile !== undefined) {
                          setFocusedTab(nextUnfinishedFile);
                        } else {
                          //we are done
                          onUploadWizardFinish({
                            res: finishedFiles.map(ents => {
                              return maybeStripIdFromEntities(
                                ents,
                                f.validateAgainstSchema
                              );
                            })
                          });
                        }
                      },
                      validateAgainstSchema,
                      reduxFormEntitiesArray,
                      filesWIssues,
                      finishedFiles,
                      onUploadWizardFinish,
                      doAllFilesHaveSameHeaders,
                      destroyForms,
                      setFilesWIssues,
                      csvValidationIssue,
                      searchResults,
                      matchedHeaders,
                      userSchema,
                      flippedMatchedHeaders,
                      // reduxFormEntities,
                      changeForm,
                      fileIndex: i,
                      form: `correctCSVHeadersForm-${i}`,
                      datatableFormName: `editableCellTable-${i}`,
                      ...f,
                      ...(doAllFilesHaveSameHeaders && {
                        csvValidationIssue: false
                      })
                    }}
                  />
                }
              ></Tab>
            );
          })}
        </Tabs>
      </>
    );
    let comp = tabs;

    if (doAllFilesHaveSameHeaders) {
      comp = (
        <>
          {doAllFilesHaveSameHeaders && (
            <SimpleStepViz
              style={{ marginTop: 8 }}
              steps={steps}
            ></SimpleStepViz>
          )}

          {!hasSubmittedOuter && (
            <MatchHeaders
              {...{
                doAllFilesHaveSameHeaders,
                datatableFormNames: filesWIssues.map((f, i) => {
                  return `editableCellTable-${i}`;
                }),
                reduxFormEntitiesArray,
                // onMultiFileUploadSubmit,
                csvValidationIssue,
                searchResults,
                matchedHeaders,
                userSchema,
                flippedMatchedHeaders,
                // reduxFormEntities,
                changeForm,
                setFilesWIssues,
                filesWIssues,
                fileIndex: 0,
                ...filesWIssues[0]
              }}
            ></MatchHeaders>
          )}
          {hasSubmittedOuter && tabs}
          {!hasSubmittedOuter && (
            <DialogFooter
              style={{ marginTop: 20 }}
              onClick={() => {
                setSubmittedOuter(true);
                setSteps(getInitialSteps(false));
              }}
              text="Review and Edit Data"
            ></DialogFooter>
          )}
        </>
      );
    }
    return (
      <div
        style={{
          padding: 10
        }}
      >
        {comp}
      </div>
    );
  } else {
    return (
      <UploadCsvWizardDialogInner
        form="correctCSVHeadersForm"
        {...{
          validateAgainstSchema,
          userSchema,
          searchResults,
          onUploadWizardFinish,
          csvValidationIssue,
          matchedHeaders,
          //fromRedux:
          changeForm,
          setFilesWIssues,
          // doAllFilesHaveSameHeaders,
          filesWIssues,
          flippedMatchedHeaders,
          // reduxFormEntities,
          // datatableFormNames
          fileIndex: 0,
          ...filesWIssues[0]
        }}
      />
    );
  }
});

const UploadCsvWizardDialogInner = compose(
  reduxForm(),
  connect((state, props) => {
    return formValueSelector(props.datatableFormName || "editableCellTable")(
      state,
      "reduxFormEntities",
      "reduxFormCellValidation"
    );
  })
)(function UploadCsvWizardDialogInner({
  validateAgainstSchema,
  userSchema,
  searchResults,
  onUploadWizardFinish,
  csvValidationIssue,
  matchedHeaders,
  //fromRedux:
  handleSubmit,
  fileIndex,
  reduxFormEntities,
  onBackClick,
  reduxFormCellValidation,
  changeForm,
  setFilesWIssues,
  doAllFilesHaveSameHeaders,
  filesWIssues,
  datatableFormName = "editableCellTable",
  onMultiFileUploadSubmit,
  isThisTheLastBadFile
}) {
  const [hasSubmitted, setSubmitted] = useState(!csvValidationIssue);
  const [steps, setSteps] = useState(getInitialSteps(csvValidationIssue));

  let inner;
  if (hasSubmitted) {
    inner = (
      <PreviewCsvData
        {...{
          datatableFormName,
          showDoesDataLookCorrectMsg: true,
          initialEntities: reduxFormEntities || null,
          matchedHeaders,
          validateAgainstSchema,
          userSchema
        }}
      ></PreviewCsvData>
    );
  } else {
    inner = (
      <MatchHeaders
        {...{
          onMultiFileUploadSubmit,
          csvValidationIssue,
          searchResults,
          matchedHeaders,
          userSchema,
          reduxFormEntitiesArray: [reduxFormEntities],
          changeForm,
          datatableFormName,
          setFilesWIssues,
          filesWIssues,
          fileIndex
        }}
      ></MatchHeaders>
    );
  }
  const { entsToUse, validationToUse } = removeCleanRows(
    reduxFormEntities,
    reduxFormCellValidation
  );

  return (
    <div>
      {!doAllFilesHaveSameHeaders && (
        <SimpleStepViz style={{ marginTop: 8 }} steps={steps}></SimpleStepViz>
      )}
      <div className="bp3-dialog-body">{inner}</div>
      <DialogFooter
        text={
          !hasSubmitted
            ? "Review and Edit Data"
            : onMultiFileUploadSubmit
            ? isThisTheLastBadFile
              ? "Finalize Files"
              : "Next File"
            : "Add File"
        }
        disabled={
          hasSubmitted && (!entsToUse?.length || some(validationToUse, v => v))
        }
        intent={
          hasSubmitted && onMultiFileUploadSubmit && isThisTheLastBadFile
            ? Intent.SUCCESS
            : Intent.PRIMARY
        }
        noCancel={onMultiFileUploadSubmit}
        {...(hasSubmitted && {
          onBackClick:
            onBackClick ||
            (() => {
              setSteps(
                immer(steps, draft => {
                  draft[0].active = true;
                  draft[0].completed = false;
                  draft[1].active = false;
                })
              );
              setSubmitted(false);
            })
        })}
        onClick={handleSubmit(function() {
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
            const payload = maybeStripIdFromEntities(
              entsToUse,
              validateAgainstSchema
            );
            onMultiFileUploadSubmit
              ? onMultiFileUploadSubmit()
              : onUploadWizardFinish({ res: [payload] });
          }
        })}
        style={{ alignSelf: "end" }}
      ></DialogFooter>
    </div>
  );
});

export default UploadCsvWizardDialog;

const exampleData = { userData: times(5).map(() => ({ _isClean: true })) };
export const PreviewCsvData = function({
  matchedHeaders,
  showDoesDataLookCorrectMsg,
  headerMessage,
  datatableFormName,
  // onlyShowRowsWErrors,
  validateAgainstSchema,
  userSchema = exampleData,
  initialEntities
}) {
  const useExampleData = userSchema === exampleData;
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   // simulate layout change outside of React lifecycle
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 400);
  // }, []);

  // const forceUpdate = useForceUpdate();

  const data =
    userSchema.userData &&
    userSchema.userData.length &&
    userSchema.userData.map((row, i1) => {
      const toRet = {
        _isClean: row._isClean
      };
      validateAgainstSchema.fields.forEach(
        ({ path, defaultValue, example }) => {
          const matchingKey = matchedHeaders?.[path];
          if (!matchingKey) {
            toRet[path] = defaultValue === undefined ? defaultValue : "";
          } else {
            toRet[path] = row[matchingKey];
          }
          if (toRet[path] === undefined || toRet[path] === "") {
            if (defaultValue) {
              toRet[path] = defaultValue;
            } else {
              const exampleToUse = isArray(example) //this means that the row was not added by a user
                ? example[i1]
                : i1 === 0 && example;
              if (useExampleData && exampleToUse) {
                toRet[path] = exampleToUse;
                delete toRet._isClean;
              } else {
                toRet[path] = "";
              }
            }
          }
        }
      );

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
        {/* {validateAgainstSchema.allowAdditionalOnEnd && (
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
        )} */}
      </div>
      <DataTable
        maxWidth={800}
        maxHeight={500}
        destroyOnUnmount={false}
        doNotValidateUntouchedRows
        formName={datatableFormName || "editableCellTable"}
        isSimple
        isCellEditable
        entities={(initialEntities ? initialEntities : data) || []}
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
            datatableFormName: "simpleInsertEditableTable"
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

export const typeToCommonType = {
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
  let toRet;
  if (validateAgainstSchema?.fields?.some(({ path }) => path === "id")) {
    toRet = ents;
  } else {
    // if the schema we're validating against itself didn't have an id field,
    // we don't want to include it in the returned entities
    toRet = ents?.map(e => omit(e, ["id"]));
  }
  return toRet?.map(e => omit(e, ["_isClean"]));
}

//create your forceUpdate hook
// function useForceUpdate() {
//   const [, setValue] = useState(0); // integer state
//   return () => setValue(value => value + 1); // update state to force render
//   // A function that increment 👆🏻 the previous state like here
//   // is better than directly setting `setValue(value + 1)`
// }
