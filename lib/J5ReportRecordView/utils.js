"use strict";

exports.__esModule = true;
exports.getLinkDialogProps = getLinkDialogProps;

var _lodash = require("lodash");

var _pluralize = require("pluralize");

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function getLinkDialogProps(j5Report, fragmentMap) {
  var useFragments = !(0, _lodash.isEmpty)(fragmentMap);
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
      var items = j5Report[(0, _pluralize2.default)(model)];
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