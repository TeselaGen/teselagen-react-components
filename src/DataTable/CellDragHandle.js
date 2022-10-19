import React, { useRef } from "react";
export function CellDragHandle({ onDrag }) {
  const xStart = useRef(0);

  const resize = useRef(e => {
    const dx = xStart.current - e.clientX;
    onDrag({ dx });
    xStart.current = e.clientX;
  });
  const mouseup = useRef(() => {
    document.removeEventListener("mousemove", resize.current, false);
    document.removeEventListener("mousemove", mouseup.current, false);
  });

  return (
    <div
      onMouseDown={e => {
        xStart.current = e.clientX;
        document.addEventListener("mousemove", resize.current, false);
        document.addEventListener("mouseup", mouseup.current, false);
      }}
      className="cellDragHandle"
    ></div>
  );
}
