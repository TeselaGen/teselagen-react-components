import getXStartAndWidthOfRangeWrtRow from "./getXStartAndWidthOfRangeWrtRow";

export default function getXCenterOfRowAnnotation(
  range,
  row,
  bpsPerRow,
  charWidth,
  sequenceLength
) {
  var result = getXStartAndWidthOfRangeWrtRow(
    range,
    row,
    bpsPerRow,
    charWidth,
    sequenceLength
  );
  var xStart = result.xStart;
  var width = result.width;
  return xStart + width / 2;
}
