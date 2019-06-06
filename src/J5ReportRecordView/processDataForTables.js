import { getRangeLength } from "ve-range-utils";
import { get, flatMap } from "lodash";
import { compose } from "recompose";

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
      )
    };
  });

const processJ5DirectSyntheses = j5DirectSynths =>
  j5DirectSynths.map(j5DirectSynth => {
    return {
      ...j5DirectSynth,
      id: "dna_syn_" + j5DirectSynth.id
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
        j5RunConstruct.partNames ||
        (get(
          j5RunConstruct,
          "j5ConstructAssemblyPieces[0].assemblyPiece.j5AssemblyPieceParts[0].j5InputPart.sequencePart.name"
        ) &&
          flatMap(
            j5RunConstruct.j5ConstructAssemblyPieces,
            j5ConstructAssemblyPiece =>
              j5ConstructAssemblyPiece.assemblyPiece.j5AssemblyPieceParts.map(
                j5InputPart => j5InputPart.j5InputPart.sequencePart.name
              )
          ).join(", "))
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
    id: "piece_" + ap.id
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

const processJ5OligoSynthesis = j5Oligos =>
  j5Oligos.map(j5Oligo => {
    // todo this shouldn't rely on the oligo name to parse the target parts
    // if someone uses output naming templates for oligos then this will not work
    const partNames = getWrappedInParensMatches(j5Oligo.name);

    return {
      ...j5Oligo,
      id: "oligo_" + j5Oligo.id,
      name: j5Oligo.name,
      firstTargetPart: partNames[0],
      lastTargetPart: partNames[1]
    };
  });

const processJ5AnnealedOligo = j5Oligos => {
  return j5Oligos
    .filter(({ oligo }) => {
      // only keep the j5 oligos that link to a top or bottom annealed oligo
      return (
        oligo &&
        oligo.j5AnnealedOligosTopOligos &&
        oligo.j5AnnealedOligosBottomOligos &&
        (oligo.j5AnnealedOligosTopOligos.length ||
          oligo.j5AnnealedOligosBottomOligos.length)
      );
    })
    .map(j5Oligo => {
      let targetPart = "";
      try {
        targetPart = j5Oligo.oligo.j5AnnealedOligosTopOligos.length
          ? j5Oligo.oligo.j5AnnealedOligosTopOligos[0].sequence.j5AssemblyPiece
              .j5AssemblyPieceParts[0].j5InputPart.part.name
          : j5Oligo.oligo.j5AnnealedOligosBottomOligos[0].sequence
              .j5AssemblyPiece.j5AssemblyPieceParts[0].j5InputPart.part.name;
      } catch (e) {
        targetPart = "not found";
      }

      return {
        ...j5Oligo,
        id: "oligo_" + j5Oligo.id,
        name: j5Oligo.name,
        targetPart
      };
    });
};

function getWrappedInParensMatches(s) {
  const matches = [];
  s.replace(/\((.*?)\)/g, function(g0, g1) {
    matches.push(g1);
  });
  return matches;
}

export default {
  j5PcrReaction: processJ5PcrReactions,
  j5InputSequence: processInputSequences,
  j5InputPart: compose(
    processInputParts,
    getInputPartsFromInputSequences
  ),
  j5OligoSynthesis: processJ5OligoSynthesis,
  j5AnnealedOligo: processJ5AnnealedOligo,
  j5AssemblyPiece: processJ5AssemblyPieces,
  j5DirectSynthesis: processJ5DirectSyntheses,
  j5RunConstruct: processJ5RunConstructs,
  prebuiltConstruct: processPrebuiltConstructs
};
