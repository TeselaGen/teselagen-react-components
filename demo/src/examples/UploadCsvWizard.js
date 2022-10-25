import Fuse from "fuse.js";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { reduxForm } from "redux-form";
import { Button, Callout, Card } from "@blueprintjs/core";
import immer from "immer";

import store from "../store";
import {
  DataTable,
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
import "./UploadCsvWizard.css";

import "@silevis/reactgrid/styles.css";
import { forEach, map } from "lodash";
import { flatMap } from "lodash";
import { max } from "lodash";
import { compose } from "recompose";
import SimpleStepViz from "./SimpleStepViz";
import { nanoid } from "nanoid";

const validateAgainstSchema = {
  fields: [
    { isEditable: true, path: "name" },
    { isEditable: true, path: "description", allowEmpty: true },
    { isEditable: true, path: "sequence" },
    {
      isEditable: true,
      path: "isRegex",
      type: "boolean",
      defaultValue: false
    },
    {
      isEditable: true,
      path: "matchType",
      type: "dropdown",
      values: ["dna", "protein"],
      defaultValue: "dna"
    },
    {
      isEditable: true,
      path: "type",
      type: "dropdown",
      values: ["misc_feature", "CDS", "rbs"],
      defaultValue: "misc_feature"
    }
  ],
  userData: []
};
const csvStr = `Name,Sequence,Type,Color,Match type
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,misc_protein,#f58a5e,protein
38 aa lkong linker,APGGSGGGSGGGSGGGSGGGSGGGTGGGSGGGSAGSPG,,#75C6A9,protein
3d6 variable domain LC,YVVMTQTPLTLSVTIGQPASISCKSSQSLLDSDGKTYLNWLLQRPGQSPKRLIYLVSKLDSGVPDRFTGSGSGTDFTLKISRIEAEDLGLYYCWQGTHFPRTFGGGTKLEIK,,#ff9ccd,protein
3d6 variable HC,EVKLVESGGGLVKPGASLKLSCAASGFTFSNYGMSWVRQNSDKRLEWVASIRSGGGRTYYSDNVKGRFTISRENAKNTLYLQMSSLKSEDTALYYCVRYDHYSGSSDYWGQGTTVTVS,,#f58a5e,protein
15 long linker based on the one I designed,APGSGTGGGSGSAPG,,#85DAE9,protein
20 aa linker based on the one I designed,APGGSGGGTGGGSGGGSAPG,,#C7B0E3,protein
22 aa linker,GPGSGGGGSGGGGSGGGGSGPG,misc_feat1,#f58a5e,protein
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
const { /* hasIssues, */ searchResults } = tryToMatchFields(
  userSchema.fields,
  validateAgainstSchema.fields
);

const UploadHelper = compose(
  reduxForm({
    form: "correctCSVHeadersForm"
  }),

  wrapDialog({ title: "Upload Helper", style: { width: "fit-content" } })
)(({ handleSubmit, onlyShowRowsWErrors }) => {
  const [hasSubmitted, setSubmitted] = useState();
  const [steps, setSteps] = useState([
    { text: "Set Headers", active: true },
    { text: "Review Data", active: false }
  ]);
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
          the expected headers. Please look over and correct any issues with the
          mappings below.
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
                    {!allowEmpty && defaultValue === undefined && "(Required)"}
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
        const matchingKey = matchedHeaders[i];

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
      <h5>Does this data look correct? Edit it as needed.</h5>
      <SwitchField
        name={"onlyShowRowsWErrors"}
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
        entities={data}
        schema={validateAgainstSchema}
      ></DataTable>
    </div>
  );
});
