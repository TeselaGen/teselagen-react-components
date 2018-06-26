import { round } from "lodash";

const schemas = {
  j5PcrReactions: {
    fields: [
      { path: "id", type: "number", displayName: "PCR ID" },
      // { path: 'name', type: 'string', displayName: 'Name' }
      {
        path: "primaryTemplate.name",
        type: "string",
        displayName: "Template Name"
      },
      {
        path: "secondaryTemplate.name",
        type: "string",
        displayName: "Alternate Template Name"
      },
      {
        path: "forwardPrimer.id",
        type: "string",
        displayName: "Forward Oligo ID"
      },
      {
        path: "forwardPrimer.name",
        type: "string",
        displayName: "Forward Oligo Name"
      },
      {
        path: "reversePrimer.id",
        type: "string",
        displayName: "Reverse Oligo ID"
      },
      {
        path: "reversePrimer.name",
        type: "string",
        displayName: "Reverse Oligo Name"
      },
      { path: "note", type: "string", displayName: "Notes" },
      {
        path: "oligoMeanTm",
        type: "number",
        displayName: "Mean Tm (°C)",
        render: v => round(v, 2)
      },
      {
        path: "oligoDeltaTm",
        type: "number",
        displayName: "Delta Tm (°C)",
        render: v => round(v, 2)
      },
      {
        path: "oligoMeanTm3Prime",
        type: "number",
        displayName: "Mean Tm 3' (°C)",
        render: v => round(v, 2)
      },
      {
        path: "oligoDeltaTm3Prime",
        type: "number",
        displayName: "Delta Tm 3' (°C)",
        render: v => round(v, 2)
      },
      {
        path: "pcrProductSequence.size",
        type: "string",
        displayName: "Length (bp)"
      }
    ]
  },
  j5OligoSyntheses: {
    fields: [
      { path: "id", type: "string", displayName: "Oligo ID" },
      { path: "name", type: "string", displayName: "Oligo Name" },
      {
        path: "firstTargetPart",
        type: "string",
        displayName: "First Target Part"
      },
      {
        path: "lastTargetPart",
        type: "string",
        displayName: "Last Target Part"
      },
      { path: "tm", type: "number", displayName: "Tm (°C)" },
      { path: "tm3Prime", type: "number", displayName: "Tm 3' Only (°C)" },
      {
        path: "oligo.sequence.size",
        type: "number",
        displayName: "Length (bp)"
      },
      {
        path: "cost",
        type: "number",
        displayName: "Cost (USD)"
      },
      {
        path: "oligo.sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      },
      { path: "bps", type: "string", displayName: "Sequence" }
    ]
  },
  j5AssemblyPieces: {
    fields: [
      { path: "id", type: "string", displayName: "Piece ID" },
      { path: "name", type: "string", displayName: "Name" },
      { path: "type", type: "string", displayName: "Source" },
      {
        path: "sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      },
      { path: "sequence.size", type: "number", displayName: "Length (bp)" },
      { path: "bps", type: "string", displayName: "Sequence" }
    ]
  },
  j5RunConstructs: {
    fields: [
      { path: "id", type: "string", displayName: "Construct ID" },
      { path: "name", type: "string", displayName: "Construct Name" },
      { path: "sequence.size", type: "number", displayName: "Length (bp)" },
      {
        path: "partsContainedNames",
        type: "string",
        displayName: "Parts Contained"
      }
    ]
  },
  j5InputSequences: {
    fields: [
      {
        path: "sequence.id",
        type: "string",
        displayName: "Sequence ID"
      },
      { path: "sequence.name", type: "string", displayName: "Name" },
      { path: "sequence.size", type: "number", displayName: "Length (bp)" },
      { path: "inStock", type: "boolean", displayName: "In Stock" },
      {
        path: "sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      }
    ]
  },
  j5DirectSyntheses: {
    fields: [
      {
        path: "id",
        type: "string",
        displayName: "DNA Synthesis ID"
      },
      { path: "sequence.name", type: "string", displayName: "Name" },
      // { path: "firstTargetPart", type: "string"  },
      // { path: "lastTargetPart", type: "string"  },
      { path: "inStock", type: "boolean", displayName: "In Stock" },
      {
        path: "sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      },
      { path: "sequence.size", type: "number", displayName: "Length (bp)" },
      { path: "cost", type: "number", displayName: "Cost (USD)" },
      { path: "bps", type: "string", displayName: "Sequence" }
    ]
  },
  j5InputParts: {
    fields: [
      {
        path: "sequencePart.id",
        type: "string",
        displayName: "Part ID"
      },
      { path: "sequencePart.name", type: "string", displayName: "Part Name" },
      {
        path: "sequencePart.sequence.name",
        type: "string",
        displayName: "Source"
      },
      {
        path: "sequencePart.strand",
        type: "number",
        displayName: "Reverse Complement",
        render: v => (v === 1 ? "False" : "True")
      },
      { path: "sequencePart.start", type: "number", displayName: "Start (bp)" },
      { path: "sequencePart.end", type: "number", displayName: "End (bp)" },
      { path: "size", type: "number", displayName: "Length (bp)" },
      { path: "bps", type: "string", displayName: "Sequence" }
    ]
  }
};
export default schemas;
