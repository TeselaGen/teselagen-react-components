import AnnotationPositioner from "../AnnotationPositioner";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import React from "react";

import "./style.css";

import getXStartAndWidthOfRangeWrtRow from "../getXStartAndWidthOfRangeWrtRow";
import getOverlapsOfPotentiallyCircularRanges
  from "ve-range-utils/getOverlapsOfPotentiallyCircularRanges";

function DeletionLayers(props) {
  var {
    charWidth,
    bpsPerRow,
    row,
    sequenceLength,
    deletionLayerClicked,
    deletionLayerRightClicked,
    deletionLayers = {},
    deletionLineHeight = 6
  } = props;

  var deletionLayersToUse = Object.keys(deletionLayers).map(function(key) {
    return deletionLayers[key];
  });
  if (!deletionLayersToUse.length) return null;
  return (
    <AnnotationContainerHolder
      className="veRowViewDeletionLayers"
      containerHeight={deletionLineHeight}
    >
      {deletionLayersToUse
        .sort(function(deletionLayer) {
          return deletionLayer.inBetweenBps ? 1 : 0;
        })
        .map(function(deletionLayer, index) {
          var rangeSpansSequence =
            deletionLayer.start === deletionLayer.end + 1 ||
            (deletionLayer.start === 0 &&
              deletionLayer.end === sequenceLength - 1);
          var { className = "", style = {}, color } = deletionLayer;
          var overlaps = getOverlapsOfPotentiallyCircularRanges(
            deletionLayer,
            row,
            sequenceLength
          );
          return overlaps.map(function(overlap, index2) {
            var { xStart, width } = getXStartAndWidthOfRangeWrtRow(
              overlap,
              row,
              bpsPerRow,
              charWidth,
              sequenceLength
            );
            var deletionStart = overlap.start === deletionLayer.start;
            var deletionEnd = overlap.end === deletionLayer.end;

            return [
              <AnnotationPositioner
                height={deletionLineHeight}
                width={width}
                key={index}
                top={0}
                // className={classnames() }
                left={
                  xStart + (deletionLayer.inBetweenBps ? charWidth / 1.2 : 0)
                }
              >
                <g
                  className="clickable"
                  onClick={function(event) {
                    deletionLayerClicked({ annotation: deletionLayer, event });
                  }}
                  onContextMenu={function(event) {
                    deletionLayerRightClicked({
                      annotation: deletionLayer,
                      event
                    });
                  }}
                >
                  <rect
                    fill={color}
                    x="0"
                    y="0"
                    height={deletionLineHeight}
                    width={width}
                  />
                  {rangeSpansSequence &&
                    deletionStart &&
                    <rect
                      fill={"blue"}
                      x="0"
                      y="0"
                      height={deletionLineHeight}
                      width={4}
                    />}
                  {rangeSpansSequence &&
                    deletionEnd &&
                    <rect
                      fill={"blue"}
                      x={width - 4}
                      y="0"
                      height={deletionLineHeight}
                      width={4}
                    />}
                </g>
              </AnnotationPositioner>
            ];
          });
        })}
    </AnnotationContainerHolder>
  );
}

export default DeletionLayers;
