import Fuse from "fuse.js";

import React, { useRef, useState } from "react";
import { reduxForm } from "redux-form";
import { Callout, Card } from "@blueprintjs/core";
import immer from "immer";

import "./UploadCsvWizard.css";

import { forEach, map } from "lodash";
import { flatMap } from "lodash";
import { max } from "lodash";
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

const getSchema = data => ({
  fields: map(data[0], (val, path) => {
    return { path, type: "string" };
  }),
  userData: map(data, d => {
    if (!d.id) {
      return {
        ...d,
        id: nanoid()
      };
    }
    return d;
  })
});

function tryToMatchFields(userSchema, officialSchema) {
  const options = {
    includeScore: true,
    keys: ["path", "displayName"]
  };
  let hasIssues = false;
  officialSchema.forEach(h => {
    let hasMatch = false;
    userSchema.forEach(uh => {
      if (uh.path.toLowerCase() === h.path.toLowerCase()) {
        hasMatch = true;
      }
    });
    if (!hasMatch) hasIssues = true;
  });
  if (!hasIssues) {
    return { hasIssues };
  }

  const fuse = new Fuse(userSchema, options);

  officialSchema.forEach(h => {
    const result = fuse.search(h.path);
    h.matches = result;
  });
  return { searchResults: officialSchema, hasIssues: true };
}

const UploadHelper = compose(
  reduxForm({
    form: "correctCSVHeadersForm"
  }),
  wrapDialog({ title: "Upload Helper", style: { width: "fit-content" } }),
  tgFormValueSelector(
    "editableCellTable",
    "reduxFormEntities",
    "reduxFormCellValidation"
  )
)(
  ({
    incomingData,
    validateAgainstSchema,
    handleSubmit,
    onlyShowRowsWErrors,
    // reduxFormEntities,
    reduxFormCellValidation
  }) => {
    const [hasSubmitted, setSubmitted] = useState();
    const [steps, setSteps] = useState([
      { text: "Set Headers", active: true },
      { text: "Review Data", active: false }
    ]);

    const _userSchema = useRef(() => {
      return getSchema(incomingData);
    });
    const userSchema = _userSchema.current;

    const _searchResults = useRef(() => {
      const res = tryToMatchFields(
        userSchema.fields,
        validateAgainstSchema.fields
      );
      return res.searchResults;
    });
    const searchResults = _searchResults;

    const incomingHeadersToScores = {};
    searchResults.forEach(r => {
      r.matches.forEach(match => {
        incomingHeadersToScores[match.item.path] =
          incomingHeadersToScores[match.item.path] || [];
        incomingHeadersToScores[match.item.path].push(match.score);
      });
    });
    searchResults.forEach(r => {
      for (const match of r.matches) {
        if (!incomingHeadersToScores[match.item.path]) continue;
        const maxScore = max(incomingHeadersToScores[match.item.path]);
        if (maxScore === match.score) {
          r.topMatch = match.item.path;
          r.matches.forEach(match => {
            if (!incomingHeadersToScores[match.item.path]) return;
            const arr = incomingHeadersToScores[match.item.path];
            arr.splice(arr.indexOf(match.score), 1);
          });
          delete incomingHeadersToScores[match.item.path];
          break;
        }
      }
    });
    const initialMatchedHeaders = {};
    searchResults.forEach((r, i) => {
      if (r.topMatch) {
        initialMatchedHeaders[i] = r.topMatch;
      }
    });

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
            It looks like some of the headers in your uploaded file do not match
            the expected headers. Please look over and correct any issues with
            the mappings below.
          </Callout>
          <br></br>
          {searchResults.map(({ path, allowEmpty, defaultValue }, i) => {
            return (
              <Card style={{ padding: 2 }} key={i}>
                <table>
                  <tr
                    style={{
                      display: "flex",
                      minHeight: 50,
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* <td style={{ marginRight: 10 }}>
                {String.fromCharCode(i + 65)}
              </td> */}
                    <td
                      style={{
                        width: 200,
                        display: "flex"
                      }}
                    >
                      <div
                        style={{ paddingTop: 2, marginLeft: 15, fontSize: 15 }}
                      >
                        {path}
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
                        isRequired={!allowEmpty && defaultValue === undefined}
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
                    <div
                      style={{
                        marginLeft: 20,
                        fontSize: 10 /* color: Colors.RED1 */
                      }}
                    >
                      {!allowEmpty &&
                        defaultValue === undefined &&
                        "(Required)"}
                    </div>
                  </tr>
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
          text="Next"
          disabled={hasSubmitted && some(reduxFormCellValidation, v => v)}
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

export default UploadHelper;

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
        onlyShowRowsWErrors={onlyShowRowsWErrors}
        isCellEditable
        entities={data || []}
        schema={validateAgainstSchema}
      ></DataTable>
    </div>
  );
});

export const SimpleInsertData = wrapDialog({
  title: "Insert Data",
  style: { width: "fit-content" }
})(function SimpleInsertData({ ...r }) {
  return (
    <>
      <div className="bp3-dialog-body">
        <PreviewCsvData {...r}></PreviewCsvData>
      </div>
      <DialogFooter text="Add File"></DialogFooter>
    </>
  );
});
