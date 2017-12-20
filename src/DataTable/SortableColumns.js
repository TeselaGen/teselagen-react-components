import React, { Component } from "react";
import { noop } from "lodash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const SortableItem = SortableElement(({ children }) => {
  return (
    <div
      className="tg-movable-table-column"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        height: "100%",
        ...children.props.style
      }}
    >
      {children}
    </div>
  );
});

function CustomTheadComponent(props) {
  const headerColumns = props.children.props.children;
  // hacky but using the undefined keys to make a column not movable
  // these undefined key columns will always be first so this might mess up
  // order if something was funky
  const [immovableColumns, movableColumns] = headerColumns.reduce(
    (acc, col) => {
      if (col.key.indexOf("undefined") > -1) acc[0].push(col);
      else acc[1].push(col);
      return acc;
    },
    [[], []]
  );
  return (
    <div className={"rt-thead " + props.className} style={props.style}>
      <div className="rt-tr">
        {immovableColumns}
        {movableColumns.map((column, index) => {
          return (
            <SortableItem key={`item-${index}`} index={index}>
              {column}
            </SortableItem>
          );
        })}
      </div>
    </div>
  );
}

const SortableCustomTheadComponent = SortableContainer(CustomTheadComponent);

class SortableColumns extends Component {
  shouldCancelStart = e => {
    const className = e.target.className;
    return (
      className.indexOf("pt-icon") > -1 || className.indexOf("rt-resizer") > -1
    );
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { moveColumnPersist, moveColumn } = this.props;
    if (moveColumnPersist) {
      moveColumnPersist({
        columnIndex: newIndex,
        oldColumnIndex: oldIndex
      });
    } else {
      moveColumn({ oldIndex, newIndex });
    }
  };

  render() {
    return (
      <SortableCustomTheadComponent
        {...this.props}
        lockAxis="x"
        axis="x"
        shouldCancelStart={this.shouldCancelStart}
        onSortEnd={this.onSortEnd}
      />
    );
  }
}

export default SortableColumns;
