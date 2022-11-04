import { forEach } from "lodash";
import React, { useRef } from "react";
import ReactDOM from "react-dom";

export function CellDragHandle({ thisTable, onDragEnd, cellId }) {
  const xStart = useRef(0);
  const timeoutkey = useRef();
  // const lastUserY = useRef();
  const rowsToSelect = useRef();

  const handleDrag = useRef(e => {
    const table = ReactDOM.findDOMNode(thisTable).querySelector(".rt-table");
    const trs = table.querySelectorAll(`.rt-tr-group.with-row-data`);
    const [rowId, path] = cellId.split(":");
    const selectedTr = table.querySelector(
      `.rt-tr-group.with-row-data[data-test-id="${rowId}"]`
    );
    const selectedIndex = selectedTr.dataset.index;

    if (selectedTr && trs.length) {
      const selectedY = selectedTr.getBoundingClientRect().y;
      const cursorY = e.clientY;
      clearTimeout(timeoutkey.current);
      // eslint-disable-next-line no-inner-declarations
      function updateScrollIfNecessary() {
        const { y, height } = table.getBoundingClientRect();
        if (cursorY < y) {
          table.scrollBy(0, -5);
        } else if (cursorY > y + height) {
          table.scrollBy(0, 5);
        }
      }
      updateScrollIfNecessary();
      timeoutkey.current = setInterval(() => {
        updateScrollIfNecessary();
      }, 10);

      const isCursorBelow = cursorY > selectedY;
      rowsToSelect.current = [];
      forEach(trs, (tr, index) => {
        let isSelectedForUpdate;
        const rowId = tr.dataset.testId;
        if (isCursorBelow ? index > selectedIndex : index < selectedIndex) {
          const { y, height } = tr.getBoundingClientRect();
          if (isCursorBelow ? y < cursorY : y + height > cursorY) {
            rowsToSelect.current.push(rowId);
            isSelectedForUpdate = true;
            //add dashed borders
            tr.querySelector(
              `[data-test="tgCell_${path}"]`
            ).parentNode.classList.add("selectedForUpdate");
          }
        }
        if (!isSelectedForUpdate) {
          tr.querySelector(
            `[data-test="tgCell_${path}"]`
          ).parentNode.classList.remove("selectedForUpdate");
        }
      });
    }
  });
  // const fun = () => mouseup.current(onDragEnd);

  const mouseup = useRef(() => {
    clearTimeout(timeoutkey.current);
    const table = ReactDOM.findDOMNode(thisTable);
    const trs = table.querySelectorAll(`.rt-tr-group.with-row-data`);
    const [, path] = cellId.split(":");
    //remove the dashed borders
    forEach(trs, tr => {
      const el = tr.querySelector(`[data-test="tgCell_${path}"]`);
      el.parentNode.classList.remove("selectedForUpdate");
    });
    document.removeEventListener("mousemove", handleDrag.current, false);
    document.removeEventListener("mouseup", mouseup.current, false);
    onDragEnd(rowsToSelect.current.map(id => `${id}:${path}`));
  });

  return (
    <div
      onMouseDown={e => {
        rowsToSelect.current = [];
        xStart.current = e.clientX;
        document.addEventListener("mousemove", handleDrag.current, false);
        document.addEventListener("mouseup", mouseup.current, false);
      }}
      className="cellDragHandle"
    ></div>
  );
}
