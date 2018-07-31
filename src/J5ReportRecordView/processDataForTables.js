import { getRangeLength } from "ve-range-utils";
import { get, flatMap } from "lodash";
import { compose } from "recompose";
import getSequenceStringOfJ5InputPart from "./getSequenceStringOfJ5InputPart";

const processInputParts = inputParts =>
  inputParts.map(inputPart => {
    const sequencePart = get(inputPart, "sequencePart", {});
    return {
      ...inputPart,
      sequencePart: {
        ...sequencePart,
        id: "part_" + sequencePart.id
      },
      size: getRangeLength(
        {
          start: inputPart.sequencePart.start,
          end: inputPart.sequencePart.end
        },
        get(inputPart, "sequencePart.sequence.size")
      ),
      bps: getSequenceStringOfJ5InputPart(inputPart)
    };
  });

const processJ5DirectSyntheses = j5DirectSynths =>
  j5DirectSynths.map(j5DirectSynth => {
    return {
      ...j5DirectSynth,
      id: "dna_syn_" + j5DirectSynth.id,
      bps: get(j5DirectSynth, "sequence.sequenceFragments", [])
        .map(f => f.fragment)
        .join("")
    };
  });

const processJ5RunConstructs = j5RunConstructs =>
  j5RunConstructs
    .filter(j5RunConstruct => !j5RunConstruct.isPrebuilt)
    .map(j5RunConstruct => ({
      ...j5RunConstruct,
      id: "construct_" + j5RunConstruct.id,
      nextLevelParts: (get(j5RunConstruct, "sequence.sequenceParts") || [])
        .map(part => part.name)
        .join(", "),
      partsContainedNames:
        get(
          j5RunConstruct,
          "j5ConstructAssemblyPieces[0].assemblyPiece.j5AssemblyPieceParts[0].j5InputPart.sequencePart.name"
        ) &&
        flatMap(
          j5RunConstruct.j5ConstructAssemblyPieces,
          j5ConstructAssemblyPiece =>
            j5ConstructAssemblyPiece.assemblyPiece.j5AssemblyPieceParts.map(
              j5InputPart => j5InputPart.j5InputPart.sequencePart.name
            )
        ).join(", ")
    }));

const processPrebuiltConstructs = j5RunConstructs =>
  j5RunConstructs
    .filter(j5RunConstruct => j5RunConstruct.isPrebuilt)
    .map(j5RunConstruct => ({
      ...j5RunConstruct,
      id: "construct_" + j5RunConstruct.id,
      nextLevelParts: (get(j5RunConstruct, "sequence.sequenceParts") || [])
        .map(part => part.name)
        .join(", "),
      partsContainedNames: j5RunConstruct.partNames
    }));

const getInputPartsFromInputSequences = j5InputSequences =>
  j5InputSequences
    .map(({ j5InputParts, sequence }) =>
      j5InputParts.map(({ sequencePart }) => ({
        sequencePart: { ...sequencePart, sequence }
      }))
    )
    .reduce((a, b) => a.concat(b), []);

const processJ5AssemblyPieces = j5AssemblyPieces =>
  j5AssemblyPieces.map(ap => ({
    ...ap,
    id: "piece_" + ap.id,
    bps: get(ap, "sequence.sequenceFragments", [])
      .map(f => f.fragment)
      .join("")
  }));

const processInputSequences = j5InputSequences =>
  j5InputSequences.map(s => ({
    ...s,
    sequence: { ...s.sequence, id: "sequence_" + s.sequence.id }
  }));

const processJ5PcrReactions = j5PcrReactions =>
  j5PcrReactions.map(pcr => ({
    ...pcr,
    id: "pcr_" + pcr.id
  }));

export default {
  j5PcrReaction: processJ5PcrReactions,
  j5InputSequence: processInputSequences,
  j5InputPart: compose(
    processInputParts,
    getInputPartsFromInputSequences
  ),
  j5AssemblyPiece: processJ5AssemblyPieces,
  j5DirectSynthesis: processJ5DirectSyntheses,
  j5RunConstruct: processJ5RunConstructs,
  prebuiltConstruct: processPrebuiltConstructs
};
