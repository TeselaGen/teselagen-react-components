import Fuse from "fuse.js";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { Button, Callout, Card } from "@blueprintjs/core";
import immer from "immer";

import store from "../store";
import {
  DialogFooter,
  FileUploadField,
  ReactSelectField,
  SwitchField,
  tgFormValues,
  wrapDialog
} from "../../../src";
import DemoWrapper from "../DemoWrapper";
import {
  parseCsvOrExcelFile,
  parseCsvString
} from "../../../src/utils/parserUtils";

import { ReactGrid } from "@silevis/reactgrid";
import "./UploadCsvWizard.css";

import "@silevis/reactgrid/styles.css";
import { forEach, map } from "lodash";
import { flatMap } from "lodash";
import { max } from "lodash";
import { compose } from "recompose";
import SimpleStepViz from "./SimpleStepViz";
import { toString } from "lodash";

const validateAgainstSchema = {
  headers: [
    { header: "name", type: "string" },
    { header: "description", type: "string", allowEmpty: true },
    { header: "sequence", type: "string" },
    {
      header: "isRegex",
      type: "boolean",
      defaultValue: false,
      allowEmpty: true
    },
    {
      header: "matchType",
      type: "dropdown",
      values: ["dna", "protein"],
      defaultValue: "dna",
      allowEmpty: true
    },
    {
      header: "type",
      type: "dropdown",
      values: ["misc_feature", "CDS", "rbs"],
      defaultValue: "misc_feature"
    }
  ],
  exampleData: []
};
const csvStr = `Name,Feature,Type,Color,Match type
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
`;

const { data } = parseCsvString(csvStr, {
  // lowerCaseHeaders: true
});

const getSchema = data => ({
  headers: map(data[0], (val, header) => {
    return { header, type: "string" };
  }),
  exampleData: data
});

const getColumns = validateAgainstSchema =>
  validateAgainstSchema.headers.map(({ header }) => {
    return { columnId: header, width: 150 };
  });

const getRows = ({ validateAgainstSchema, people }) => [
  {
    rowId: "header",
    cells: validateAgainstSchema.headers.map(({ header }) => ({
      type: "header",
      text: header
    }))
  },
  ...people.map((p, i) => {
    const cells = [];
    forEach(p, (val, key) => {
      const schemaForCell = validateAgainstSchema.headers.find(
        ({ header }) => header === key
      );

      if (schemaForCell.type === "boolean") {
        cells.push({
          type: "dropdown",
          values: [
            { label: "true", value: "true" },
            { label: "false", value: "false" }
          ]
        });
      } else if (schemaForCell.type === "dropdown") {
        cells.push({
          type: "dropdown",
          values: schemaForCell.values.map(v => ({ label: v, value: v }))
        });
      } else {
        cells.push({
          type: "text",
          text:
            val ||
            (schemaForCell.defaultValue !== undefined
              ? toString(schemaForCell.defaultValue)
              : "")
        });
      }
    });
    return {
      rowId: i,
      cells
    };
  })
];

const applyChangesToPeople = (changes, prevPeople) => {
  changes.forEach(change => {
    const personIndex = change.rowId;
    const fieldName = change.columnId;
    prevPeople[personIndex][fieldName] = change.newCell.text;
  });
  return [...prevPeople];
};

function tryToMatchHeaders(userSchema, officialSchema) {
  const options = {
    includeScore: true,
    keys: ["header"]
  };
  let hasIssues = false;
  officialSchema.forEach(h => {
    let hasMatch = false;
    userSchema.forEach(uh => {
      if (uh.header.toLowerCase() === h.header.toLowerCase()) {
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
    const result = fuse.search(h.header);
    h.matches = result;
  });
  return { searchResults: officialSchema, hasIssues: true };
}

function FormComponentsDemo({ handleSubmit }) {
  return (
    <Provider store={store}>
      <div className="form-components">
        <DemoWrapper>
          <h6>FileUploadField with file limit</h6>
          <FileUploadField
            label="CSV upload with wizard"
            onFieldSubmit={function(fileList) {
              console.info(
                "do something with the finished file list:",
                fileList
              );
            }}
            className={"fileUploadLimitAndType"}
            accept={[".csv", ".xlsx"]}
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
      </div>
    </Provider>
  );
}
// const validate = values => {
//   const errors = {};
//   return errors;
// };

reduxForm({
  form: "demoForm"
})(FormComponentsDemo);

const userSchema = getSchema(data);
const { /* hasIssues, */ searchResults } = tryToMatchHeaders(
  userSchema.headers,
  validateAgainstSchema.headers
);

const UploadHelper = compose(
  reduxForm({
    form: "correctCSVHeadersForm"
  }),

  wrapDialog({ title: "Upload Helper", style: { width: "fit-content" } })
)(({ handleSubmit, onlyShowRowsWErrors }) => {
  const [hasSubmitted, setSubmitted] = useState(true);
  const [steps, setSteps] = useState([
    { text: "Set Headers", active: true },
    { text: "Review Data", active: false }
  ]);
  const incomingHeadersToScores = {};
  searchResults.forEach(r => {
    r.matches.forEach(match => {
      incomingHeadersToScores[match.item.header] =
        incomingHeadersToScores[match.item.header] || [];
      incomingHeadersToScores[match.item.header].push(match.score);
    });
  });
  searchResults.forEach(r => {
    for (const match of r.matches) {
      if (!incomingHeadersToScores[match.item.header]) continue;
      const maxScore = max(incomingHeadersToScores[match.item.header]);
      if (maxScore === match.score) {
        r.topMatch = match.item.header;
        r.matches.forEach(match => {
          if (!incomingHeadersToScores[match.item.header]) return;
          const arr = incomingHeadersToScores[match.item.header];
          arr.splice(arr.indexOf(match.score), 1);
        });
        delete incomingHeadersToScores[match.item.header];
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
          the expected headers. Please look over and correct any issues with the
          mappings below.
        </Callout>
        <br></br>
        {searchResults.map(({ header, allowEmpty }, i) => {
          return (
            <Card style={{ padding: 2 }} key={i}>
              <table>
                <tr style={{ display: "flex", minHeight: 50 }}>
                  {/* <td style={{ marginRight: 10 }}>
                {String.fromCharCode(i + 65)}
              </td> */}
                  <td
                    style={{
                      width: 200,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <div
                      style={{ paddingTop: 2, paddingLeft: 3, fontSize: 15 }}
                    >
                      {header}
                    </div>
                  </td>
                  <td style={{ width: 200 }}>
                    <ReactSelectField
                      tooltipError
                      onChange={val => {
                        setMatchedHeaders({ ...matchedHeaders, [i]: val });
                      }}
                      name={header}
                      isRequired={!allowEmpty}
                      defaultValue={matchedHeaders[i]}
                      options={flatMap(userSchema.headers, ({ header }) => {
                        if (
                          header !== matchedHeaders[i] &&
                          flippedMatchedHeaders[header]
                        ) {
                          return [];
                        }
                        return {
                          value: header,
                          label: header
                        };
                      }).sort((a, b) => {
                        const ra = searchResults[i].matches
                          .map(m => m.item.header)
                          .indexOf(a.value);
                        const rb = searchResults[i].matches
                          .map(m => m.item.header)
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
                    {!allowEmpty && "(Required)"}
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
      <div className={"bp3-dialog-body"}>{inner}</div>
      <DialogFooter
        text="Next"
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
            setSteps(
              immer(steps, draft => {
                draft[0].active = false;
                draft[0].completed = true;
                draft[1].active = true;
              })
            );
            setSubmitted(true);
          }
        })}
        style={{ alignSelf: "end" }}
      ></DialogFooter>
    </div>
  );
});

export default UploadHelper;

const PreviewCsvData = tgFormValues("onlyShowRowsWErrors")(function({
  matchedHeaders,
  onlyShowRowsWErrors,
  validateAgainstSchema,
  userSchema
}) {
  console.log(`~ onlyShowRowsWErrors`, onlyShowRowsWErrors);
  console.log(`matchedHeaders:`, matchedHeaders);
  const [people, setPeople] = React.useState(
    userSchema.exampleData &&
      userSchema.exampleData.length &&
      userSchema.exampleData.map(row => {
        const toRet = {};
        validateAgainstSchema.headers.forEach(({ header }, i) => {
          const matchingKey = matchedHeaders[i];
          if (!matchingKey) toRet[header] = "";

          toRet[header] = row[matchingKey];
        });
        return toRet;
      })

    // validateAgainstSchema.exampleData &&
    //   validateAgainstSchema.exampleData.length
    //   ? validateAgainstSchema.exampleData
    //   : [1, 2, 3, 4].map(() => {
    //       const toRet = {};
    //       validateAgainstSchema.headers.forEach(({ header }) => {
    //         toRet[header] = "";
    //       });
    //       return toRet;
    //     })
  );

  const handleChanges = changes => {
    setPeople(prevPeople => applyChangesToPeople(changes, prevPeople));
  };

  const rows = getRows({ validateAgainstSchema, people });
  const columns = getColumns(validateAgainstSchema);

  return (
    <div style={{ width: "100%" }}>
      <h5>Does this data look correct?</h5>
      <SwitchField
        name={"onlyShowRowsWErrors"}
        inlineLabel={true}
        label="Only Show Rows With Errors"
      />
      <ReactGrid
        stickyTopRows={1}
        style={{ maxHeight: 500 }}
        enableFillHandle
        enableRangeSelection
        // enableRowSelection
        onCellsChanged={handleChanges}
        rows={rows}
        columns={columns}
      />
    </div>
  );
});
