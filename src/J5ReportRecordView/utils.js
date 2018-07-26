import { each } from "lodash";

export function getLinkDialogProps(j5Report) {
  const {
    j5OligoSyntheses,
    j5AssemblyPieces,
    j5InputSequences,
    j5RunConstructs,
    j5DirectSyntheses
    // j5InputParts
  } = j5Report;
  const linkDialogProps = {
    inputSequences: {
      dialogProps: {
        title: "Link Input Sequences to Materials"
      },
      items: j5InputSequences,
      sequenceHashes: j5InputSequences.map(({ sequence }) => {
        return sequence.hash;
      })
    },

    dnaSynthesisSequences: {
      dialogProps: {
        title: "Link DNA Synthesis Sequences to Materials"
      },
      items: j5DirectSyntheses,
      sequenceHashes: j5DirectSyntheses.map(({ sequence }) => {
        return sequence.hash;
      })
    },

    constructs: {
      dialogProps: {
        title: "Link Constructs to Materials"
      },
      items: j5RunConstructs,
      sequenceHashes: j5RunConstructs.map(({ sequence }) => {
        return sequence.hash;
      })
    },

    oligos: {
      dialogProps: {
        title: "Link Oligos to Materials"
      },
      items: j5OligoSyntheses.map(({ oligo }) => {
        return oligo;
      }),
      sequenceHashes: j5OligoSyntheses.map(({ oligo }) => {
        return oligo.sequence.hash;
      })
    },

    dnaPieces: {
      dialogProps: {
        title: "Link DNA Pieces to Materials"
      },
      items: j5AssemblyPieces,
      sequenceHashes: j5AssemblyPieces.map(({ sequence }) => {
        return sequence.hash;
      })
    }
  };
  each(linkDialogProps, obj => {
    obj.allLinked = true;
    obj.items.some(item => {
      if (item.sequence && !item.sequence.polynucleotideMaterialId) {
        obj.allLinked = false;
        return true;
      }
      return false;
    });
  });
  return linkDialogProps;
}
