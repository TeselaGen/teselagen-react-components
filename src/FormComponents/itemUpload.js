import React from "react";
import {
  ProgressBar,
  Intent,
  Button,
  Tooltip,
  Position,
  Icon
} from "@blueprintjs/core";

const itemUpload = props => {
  const item = props.item;
  const name = nameShortener(item.name);

  return (
    <div className="item-upload-container" key={item.id}>
      <div className="item-upload">
        <div>
          {!props.saved ? (
            <Tooltip
              className="pt-icon"
              content={
                <span>
                  {`Click to
              ${props.active ? "abort this uploading" : "remove this file"}`}
                </span>
              }
              position={Position.LEFT}
              usePortal={true}
            >
              <Button
                intent={Intent.DANGER}
                className="pt-icon-delete pt-minimal"
                onClick={props.onCancel}
              />
            </Tooltip>
          ) : null}
        </div>
        <div>
          <span>{name}</span>
        </div>
        <div>
          {props.active ? `${props.value}%` : null}
          {props.error ? (
            <Tooltip
              className="pt-icon"
              content={props.error}
              usePortal={true}
            >
              <Icon icon="error" intent={Intent.DANGER} />
            </Tooltip>
          ) : null}
          {props.saved ? (
            <Tooltip
              className="pt-icon"
              content={"File Saved"}
              usePortal={true}
            >
              <Icon icon="saved" intent={Intent.SUCCESS} />
            </Tooltip>
          ) : null}
        </div>
      </div>
      {props.active ? (
        <ProgressBar intent={Intent.PRIMARY} value={props.value / 100} />
      ) : null}
    </div>
  );
};

/**
 * Short file names length to display
 * @param {*} itemName
 */
const nameShortener = itemName => {
  if (itemName.length > 40) {
    let name = "";
    const arr = itemName.split(".");
    name += `${arr[0].substring(0, 20)}...`;
    if (arr.length >= 2) {
      name += `${arr[arr.length - 2].substring(
        arr[arr.length - 2].length - 5,
        arr[arr.length - 2].length
      )}`;
      name += `.${arr[arr.length - 1]}`;
    }
    return name;
  }
  return itemName;
};

export default itemUpload;
