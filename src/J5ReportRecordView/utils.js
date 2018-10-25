import { isEmpty } from "lodash";
import pluralize from "pluralize";

// linkable models (keep order)
const models = [
  "j5InputSequence",
  "j5DirectSynthesis",
  "j5RunConstruct",
  "j5OligoSynthesis",
  "j5AssemblyPiece"
];

const titleMap = {
  j5OligoSynthesis: "Oligos",
  j5AssemblyPiece: "DNA Pieces",
  j5InputSequence: "Input Sequences",
  j5RunConstruct: "Constructs",
  j5DirectSynthesis: "DNA Synthesis Sequences"
};

const propNameMap = {
  j5OligoSynthesis: "oligos",
  j5AssemblyPiece: "dnaPieces",
  j5InputSequence: "inputSequences",
  j5RunConstruct: "constructs",
  j5DirectSynthesis: "dnaSynthesisSequences"
};

const hasOligos = {
  j5OligoSynthesis: true
};

export function getLinkDialogProps(j5Report, fragmentMap) {
  const linkDialogProps = models.reduce((acc, model) => {
    const propName = propNameMap[model];
    acc[propName] = {
      dialogProps: {
        title: `Link ${titleMap[model]} to Materials`
      },
      hasOligos,
      j5ReportId: j5Report.id,
      model
    };
    if (!isEmpty(fragmentMap)) {
      acc[propName].runTimeQueryOptions = {
        fragment: fragmentMap[model]
      };
    } else {
      let items = j5Report[pluralize(model)];
      if (hasOligos[model]) {
        items = items.map(item => item.oligo);
      }
      acc[propName].items = items;
      acc[propName].sequenceHashes = items.map(({ sequence }) => sequence.hash);
      acc[propName].allLinked = !items.some(
        item => item.sequence && !item.sequence.polynucleotideMaterialId
      );
    }
    return acc;
  }, {});
  return linkDialogProps;
}
