import React from "react";
import { Provider } from "react-redux";
import { Button } from "@blueprintjs/core";
import store from "../store";
import { FileUploadField } from "../../../src";
import DemoWrapper from "../DemoWrapper";
import { parseCsvOrExcelFile } from "../../../src/utils/parserUtils";
import { reduxForm } from "redux-form";

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
  return (
    <DemoWrapper>
      <h6>FileUploadField with file limit</h6>
      <FileUploadField
        validateAgainstSchema={validateAgainstSchema}
        label="CSV upload with wizard"
        onFieldSubmit={function(fileList) {
          console.info("do something with the finished file list:", fileList);
        }}
        isRequired
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
  );
});
