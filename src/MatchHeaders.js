import React from "react";
import { Callout, Card, Intent } from "@blueprintjs/core";
import immer from "immer";
import { flatMap } from "lodash";
import { ReactSelectField } from "./FormComponents";
import showConfirmationDialog from "./showConfirmationDialog";
import { startCase } from "lodash";
import { typeToCommonType } from "./UploadCsvWizard";

export function MatchHeaders({
  onMultiFileUploadSubmit, csvValidationIssue, searchResults, matchedHeaders, userSchema, flippedMatchedHeaders, reduxFormEntities, changeForm, datatableFormName, setFilesWIssues, filesWIssues, fileIndex
}) {
  return (
    <div style={{ maxWidth: 500 }}>
      {!onMultiFileUploadSubmit && (
        <Callout style={{ width: "fit-content" }} intent="warning">
          {csvValidationIssue}
        </Callout>
      )}
      <br></br>

      {searchResults.map(({ path, displayName, type }, i) => {
        const userMatchedHeader = matchedHeaders[path];
        const opts = flatMap(userSchema.fields, ({ path: pathInner }) => {
          if (pathInner !== userMatchedHeader &&
            flippedMatchedHeaders[pathInner]) {
            return [];
          }
          return {
            value: pathInner,
            label: pathInner
          };
        }).sort((a, b) => {
          const ra = searchResults[i].matches
            .map(m => m.item.path)
            .indexOf(a.value);
          const rb = searchResults[i].matches
            .map(m => m.item.path)
            .indexOf(b.value);
          if (!ra)
            return -1;
          if (!rb)
            return 1;
          return rb - ra;
        });
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
                        data-tip={`Column Type: ${typeToCommonType[type || "string"] || type}`}
                      >
                        {displayName || startCase(path)}
                      </span>
                    </div>
                  </td>
                  <td style={{ width: 200 }}>
                    <ReactSelectField
                      noMarginBottom
                      tooltipError
                      beforeOnChange={async () => {
                        if (reduxFormEntities && reduxFormEntities.isDirty) {
                          //when the column mapping changes, update the column in reduxFormEntities (if reduxFormEntities exists)
                          const doAction = await showConfirmationDialog({
                            text: "Are you sure you want to edit the columm mapping? This will clear any changes you've already made to the table data",
                            intent: Intent.DANGER,
                            confirmButtonText: "Yes",
                            cancelButtonText: "No"
                            // canEscapeKeyCancel: true //this is false by default
                          });
                          if (doAction) {
                            changeForm(
                              datatableFormName,
                              "reduxFormEntities",
                              null
                            );
                          } else {
                            return { stopEarly: true };
                          }
                        } else if (reduxFormEntities) {
                          changeForm(
                            datatableFormName,
                            "reduxFormEntities",
                            null
                          );
                        }
                      }}
                      onChange={async (val) => {
                        setFilesWIssues(
                          immer(filesWIssues, files => {
                            files.forEach((f, i) => {
                              const isCurrentFile = fileIndex === i;
                              // const isValAlreadyBeingUsed = some(
                              //   f.matchedHeaders,
                              //   (v, k) => {
                              //     //if any of the matched headers are already using that val, don't change this one
                              //     return val && v === val && k !== path;
                              //   }
                              // );
                              // const valForCurrentFile =
                              //   files[fileIndex].matchedHeaders[path];
                              // const v = f.matchedHeaders[path]; // the current value of the matched header for the file
                              if (
                                // !isValAlreadyBeingUsed && //this should never be the case for the current file
                                isCurrentFile
                                //   || //if this is the current file, set the file to the new value
                                // !v //if the current value is empty, set the file to the new value
                                // ||
                                // v === valForCurrentFile //if the file in question has the same value as the current file being changed, set the file to the new value
                              ) {
                                f.matchedHeaders[path] = val;
                              }
                            });
                          })
                        );
                      }}
                      name={path}
                      // isRequired={!allowEmpty && defaultValue === undefined}
                      defaultValue={userMatchedHeader}
                      options={opts}
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
