var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { getRangeLength } from "ve-range-utils";
import { get, flatMap } from "lodash";
import { compose } from "recompose";

var processInputParts = function processInputParts(inputParts) {
  return inputParts.map(function (inputPart) {
    var sequencePart = get(inputPart, "sequencePart", {});
    return _extends({}, inputPart, {
      sequencePart: _extends({}, sequencePart, {
        id: "part_" + sequencePart.id
      }),
      size: getRangeLength({
        start: inputPart.sequencePart.start,
        end: inputPart.sequencePart.end
      }, get(inputPart, "sequencePart.sequence.size"))
    });
  });
};

var processJ5DirectSyntheses = function processJ5DirectSyntheses(j5DirectSynths) {
  return j5DirectSynths.map(function (j5DirectSynth) {
    return _extends({}, j5DirectSynth, {
      id: "dna_syn_" + j5DirectSynth.id
    });
  });
};

var processJ5RunConstructs = function processJ5RunConstructs(j5RunConstructs) {
  return j5RunConstructs.filter(function (j5RunConstruct) {
    return !j5RunConstruct.isPrebuilt;
  }).map(function (j5RunConstruct) {
    return _extends({}, j5RunConstruct, {
      id: "construct_" + j5RunConstruct.id,
      nextLevelParts: (get(j5RunConstruct, "sequence.sequenceParts") || []).map(function (part) {
        return part.name;
      }).join(", "),
      partsContainedNames: get(j5RunConstruct, "j5ConstructAssemblyPieces[0].assemblyPiece.j5AssemblyPieceParts[0].j5InputPart.sequencePart.name") && flatMap(j5RunConstruct.j5ConstructAssemblyPieces, function (j5ConstructAssemblyPiece) {
        return j5ConstructAssemblyPiece.assemblyPiece.j5AssemblyPieceParts.map(function (j5InputPart) {
          return j5InputPart.j5InputPart.sequencePart.name;
        });
      }).join(", ")
    });
  });
};

var processPrebuiltConstructs = function processPrebuiltConstructs(j5RunConstructs) {
  return j5RunConstructs.filter(function (j5RunConstruct) {
    return j5RunConstruct.isPrebuilt;
  }).map(function (j5RunConstruct) {
    return _extends({}, j5RunConstruct, {
      id: "construct_" + j5RunConstruct.id,
      nextLevelParts: (get(j5RunConstruct, "sequence.sequenceParts") || []).map(function (part) {
        return part.name;
      }).join(", "),
      partsContainedNames: j5RunConstruct.partNames
    });
  });
};

var getInputPartsFromInputSequences = function getInputPartsFromInputSequences(j5InputSequences) {
  return j5InputSequences.map(function (_ref) {
    var j5InputParts = _ref.j5InputParts,
        sequence = _ref.sequence;
    return j5InputParts.map(function (_ref2) {
      var sequencePart = _ref2.sequencePart;
      return {
        sequencePart: _extends({}, sequencePart, { sequence: sequence })
      };
    });
  }).reduce(function (a, b) {
    return a.concat(b);
  }, []);
};

var processJ5AssemblyPieces = function processJ5AssemblyPieces(j5AssemblyPieces) {
  return j5AssemblyPieces.map(function (ap) {
    return _extends({}, ap, {
      id: "piece_" + ap.id
    });
  });
};

var processInputSequences = function processInputSequences(j5InputSequences) {
  return j5InputSequences.map(function (s) {
    return _extends({}, s, {
      sequence: _extends({}, s.sequence, { id: "sequence_" + s.sequence.id })
    });
  });
};

var processJ5PcrReactions = function processJ5PcrReactions(j5PcrReactions) {
  return j5PcrReactions.map(function (pcr) {
    return _extends({}, pcr, {
      id: "pcr_" + pcr.id
    });
  });
};

var processJ5OligoSynthesis = function processJ5OligoSynthesis(j5Oligos) {
  return j5Oligos.map(function (j5Oligo) {
    var partNames = getWrappedInParensMatches(j5Oligo.name);

    return _extends({}, j5Oligo, {
      id: "oligo_" + j5Oligo.id,
      name: j5Oligo.name,
      firstTargetPart: partNames[0],
      lastTargetPart: partNames[1]
    });
  });
};

function getWrappedInParensMatches(s) {
  var matches = [];
  s.replace(/\((.*?)\)/g, function (g0, g1) {
    matches.push(g1);
  });
  return matches;
}

export default {
  j5PcrReaction: processJ5PcrReactions,
  j5InputSequence: processInputSequences,
  j5InputPart: compose(processInputParts, getInputPartsFromInputSequences),
  j5OligoSynthesis: processJ5OligoSynthesis,
  j5AssemblyPiece: processJ5AssemblyPieces,
  j5DirectSynthesis: processJ5DirectSyntheses,
  j5RunConstruct: processJ5RunConstructs,
  prebuiltConstruct: processPrebuiltConstructs
};