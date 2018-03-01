import React, { Component } from "react";
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

  return (
    <div className={"rt-thead " + props.className} style={props.style}>
      <div className="rt-tr">
        {headerColumns.map((column, i) => {
          // if a column is marked as immovable just return regular column
          if (column.props.immovable === "true") return column;
          // keeps track of hidden columns here so columnIndex might not equal i
          const columnIndex = column.props.columnindex || i;
          if (!column.props.columnindex) {
            console.warn("Sortable columns will break. Column index not found");
          }
          return (
            <SortableItem key={`item-${columnIndex}`} index={columnIndex}>
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
        oldColumnIndex: oldIndex,
        columnIndex: newIndex
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
        distance={10}
        shouldCancelStart={this.shouldCancelStart}
        onSortEnd={this.onSortEnd}
      />
    );
  }
}

export default SortableColumns;
