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
      { path: "id", type: "string", displayName: "Id", isHidden: true },
      { path: "name", type: "string", displayName: "Name" },
      { path: "cost", type: "number", displayName: "Cost" },
      { path: "tm", type: "number", displayName: "Tm" },
      { path: "tm_3prime", type: "number", displayName: "Tm 3'" },
      { path: "bps", type: "number", displayName: "Bps" },
      {
        path: "oligo.sequence.polynucleotideMaterialId",
        type: "boolean",
        displayName: "Is Linked"
      }
      // id first target part last target part tm tm 3' length cost
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
        path: "nextLevelParts",
        type: "string",
        displayName: "Next level parts"
      },
      {
        path: "partsContainedNames",
        type: "string",
        displayName: "Parts contained"
      }
    ]
  },
  j5InputSequences: {
    fields: [
      {
        path: "sequence.id",
        type: "string",
        displayName: "ID",
        isHidden: true
      },
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
      {
        path: "sequence.id",
        type: "string",
        displayName: "ID",
        isHidden: true
      },
      { path: "sequencePart.name", type: "string", displayName: "Name" },
      { path: "sequencePart.start", type: "number", displayName: "Start (bp)" },
      { path: "sequencePart.end", type: "number", displayName: "End (bp)" },
      { path: "size", type: "number", displayName: "Length (bp)" },
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
