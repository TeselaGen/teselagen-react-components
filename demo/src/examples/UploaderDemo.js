import React from "react";
import Uploader from "../../../src/FormComponents/Uploader";
import DemoWrapper from "../DemoWrapper";
import OptionsSection from "../OptionsSection";
import { useToggle } from "../useToggle";

export default function UploaderDemo() {
  const [disabled, disabledToggleComp] = useToggle({
    type: "disabled"
  });
  const [advancedAccept, advancedAcceptToggleComp] = useToggle({
    type: "accept",
    label: "Toggle Advance Accept"
  });
  // const [advancedAccept, advancedAcceptToggleComp] = useToggle({
  //   type: "accept",
  //   label: "Toggle Advance Accept"
  // });
  return (
    <div>
      <OptionsSection>
        {disabledToggleComp}
        {advancedAcceptToggleComp}
      </OptionsSection>
      <DemoWrapper>
        <Uploader
          accept={
            advancedAccept
              ? [
                  {
                    type: "zip",
                    description: "Any of the following types, just compressed",
                    exampleFile: () => {
                      window.toastr.success(`I've been clicked!`);
                    }
                  },
                  {
                    type: "ab1",
                    description: "Sequence Trace Format",
                    exampleFiles: [
                      { description: "Download File 1", exampleFile: "google.com" },
                      { description: "Download File 2", exampleFile: "google.com" }
                    ]
                  },
                  {
                    type: "dna",
                    description: "SnapGene DNA Format I'm a superrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrrsuperrrrrrrrrrr long message",
                    exampleFile: "google.com"
                  },
                  {
                    type: "template",
                    isTemplate: true,
                    description: "I'm a template file",
                    exampleFile: "google.com"
                  },
                  {
                    type: "json",
                    description: "TeselaGen JSON Format",
                    exampleFile: "google.com"
                  },
                  {
                    type: ["fasta", "fas", "fa", "fna", "ffn", "txt"],
                    description: "Fasta Format",
                    exampleFile: "google.com"
                  },
                  {
                    type: ["csv", "xlsx"],
                    description: "TeselaGen CSV Format",
                    exampleFile: "google.com"
                  },
                  {
                    type: ["gb", "gbk", "txt"],
                    description: "Genbank Format",
                    exampleFile: "google.com"
                  },
                  {
                    type: ["gp", "genpep", "txt"],
                    description: "Genbank Protein Format",
                    exampleFile: "google.com"
                  },
                  {
                    type: ["xml", "rdf"],
                    description: "SBOL XML Format",
                    exampleFile: "google.com"
                  },
                  {
                    type: ".dna",
                    description: "SnapGene DNA File",
                    exampleFile: "google.com"
                  }
                ]
              : ["gb", "gp"]
          }
          onChange={() => {
            window.toastr.success("File uploaded!");
          }}
          disabled={disabled}
        />
      </DemoWrapper>
    </div>
  );
}
