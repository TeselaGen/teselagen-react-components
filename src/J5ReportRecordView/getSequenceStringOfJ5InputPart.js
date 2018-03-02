import { get } from "lodash";
import { getReverseComplementSequenceString } from "ve-sequence-utils";

export default function getSequenceStringOfJ5InputPart(j5InputPart) {
  const { start, end, strand } = j5InputPart;
  const sequenceString = get(j5InputPart, "sequence.sequenceFragments", [])
    .map(f => f.fragment)
    .join("");

  // This will likely only happen if the input sequence
  // doesn't have any fragments attached to it.
  if (Math.max(start, end) >= sequenceString.length) return "";

  let partSeq;
  if (start <= end) {
    partSeq = sequenceString.slice(start, end + 1);
  } else {
    partSeq = sequenceString.slice(start) + sequenceString.slice(0, end + 1);
  }
  if (strand !== 1) {
    partSeq = getReverseComplementSequenceString(partSeq);
  }

  return partSeq;
}
