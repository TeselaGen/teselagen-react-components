const schemas = {
  j5PcrReactions: {
    fields: [
      // { path: 'id', type: 'number', displayName: 'Id', isHidden: true },
      // { path: 'name', type: 'string', displayName: 'Name' }
      {
        path: "primaryTemplate.name",
        type: "string",
        displayName: "Primary Template"
      },
      {
        path: "forwardPrimer.name",
        type: "string",
        displayName: "Forward Oligo"
      },
      {
        path: "reversePrimer.name",
        type: "string",
        displayName: "Reverse Oligo"
      },
      // { path: 'note', type: 'string', displayName: 'Note' },
      { path: "oligoMeanTm", type: "string", displayName: "Oligo Mean Tm" },
      // { path: 'oligo_delta_tm', type: 'string', displayName: 'Oligo ΔTm' },
      {
        path: "oligoMeanTm3Prime",
        type: "string",
        displayName: "Oligo Mean Tm 3'"
      }
      // { path: 'oligo_delta_tm_3prime', type: 'string', displayName: 'Oligo ΔTm 3\'' }
    ]
  },
  j5OligoSyntheses: {
    fields: [
      { path: "name", type: "string", displayName: "Name" },
      { path: "cost", type: "number", displayName: "Cost" },
      { path: "tm", type: "number", displayName: "Tm" },
      { path: "tm_3prime", type: "number", displayName: "Tm 3'" },
      {
        path: "oligo.sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      }
      // { path: 'sequence', type: 'string', displayName: 'Sequence' }
    ]
  },
  j5AssemblyPieces: {
    fields: [
      { path: "name", type: "string", displayName: "Name" },
      { path: "type", type: "string", displayName: "Type" },
      {
        path: "sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      }
    ]
  },
  j5RunConstructs: {
    fields: [
      { path: "name", type: "string", displayName: "Name" },
      { path: "sequence.size", type: "number", displayName: "Size" },
      {
        path: "partsContainedNames",
        type: "string",
        displayName: "Parts Contained"
      }
    ]
  },
  j5InputSequences: {
    fields: [
      { path: "sequence.name", type: "string", displayName: "Name" },
      { path: "sequence.size", type: "number", displayName: "Size" },
      { path: "inStock", type: "boolean", displayName: "In Stock" },
      {
        path: "sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      }
    ]
  },
  j5InputParts: {
    fields: [
      { path: "sequencePart.name", type: "string", displayName: "Name" },
      { path: "sequencePart.start", type: "number", displayName: "Start" },
      { path: "sequencePart.end", type: "number", displayName: "End" },
      { path: "sequencePart.strand", type: "number", displayName: "Strand" },
      {
        path: "sequencePart.sequence.name",
        type: "string",
        displayName: "Source"
      }
    ]
  }
};
export default schemas;
