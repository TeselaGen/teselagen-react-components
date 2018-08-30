import { isEmpty } from "lodash";
import pluralize from "pluralize";

// linkable models (keep order)
var models = ["j5InputSequence", "j5DirectSynthesis", "j5RunConstruct", "j5OligoSynthesis", "j5AssemblyPiece"];

var titleMap = {
  j5OligoSynthesis: "Oligos",
  j5AssemblyPiece: "DNA Pieces",
  j5InputSequence: "Input Sequences",
  j5RunConstruct: "Constructs",
  j5DirectSynthesis: "DNA Synthesis Sequences"
};

var propNameMap = {
  j5OligoSynthesis: "oligos",
  j5AssemblyPiece: "dnaPieces",
  j5InputSequence: "inputSequences",
  j5RunConstruct: "constructs",
  j5DirectSynthesis: "dnaSynthesisSequences"
};

var hasOligos = {
  j5OligoSynthesis: true
};

export function getLinkDialogProps(j5Report, fragmentMap) {
  var useFragments = !isEmpty(fragmentMap);
  var linkDialogProps = models.reduce(function (acc, model) {
    var propName = propNameMap[model];
    acc[propName] = {
      dialogProps: {
        title: "Link " + titleMap[model] + " to Materials"
      },
      hasOligos: hasOligos,
      j5ReportId: j5Report.id,
      model: model
    };
    if (useFragments) {
      acc[propName].runTimeQueryOptions = {
        fragment: fragmentMap[model]
      };
    } else {
      var items = j5Report[pluralize(model)];
      if (hasOligos[model]) {
        items = items.map(function (item) {
          return item.oligo;
        });
      }
      acc[propName].items = items;
      acc[propName].sequenceHashes = items.map(function (_ref) {
        var sequence = _ref.sequence;
        return sequence.hash;
      });
      acc[propName].allLinked = !items.some(function (item) {
        return item.sequence && !item.sequence.polynucleotideMaterialId;
      });
    }
    return acc;
  }, {});
  return linkDialogProps;
}