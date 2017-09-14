import React from "react";
import Dropzone from "react-dropzone";
import { first } from "lodash";

export default props => {
  const {
    accept,
    inputProps = {},
    contentOverride,
    innerIcon,
    innerText,
    action,
    className,
    fileLimit,
    beforeUpload,
    fileList,
    onChange,
    fileListItemRenderer
  } = props;
  let acceptToUse = Array.isArray(accept) ? accept.join(", ") : accept;

  return (
    <div>
      <Dropzone
        className={"tg-dropzone " + className}
        activeClassName={"tg-dropzone-active"}
        acceptClassName={"tg-dropzone-accept"}
        rejectClassName={"tg-dropzone-reject"}
        disabledClassName={"tg-dropzone-disabled"}
        accept={acceptToUse}
        {...{
          onDrop: acceptedFiles => {
            if (fileLimit) {
              acceptedFiles = first(acceptedFiles, fileLimit);
            }
            beforeUpload && beforeUpload();
            if (beforeUpload) {
              acceptedFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                  const fileAsBinaryString = reader.result;
                  // do whatever you want with the file content
                };
                reader.onabort = () => console.log("file reading was aborted");
                reader.onerror = () => console.log("file reading has failed");

                reader.readAsBinaryString(file);
              });
            }
            console.log("acceptedFiles:", acceptedFiles);
            onChange(acceptedFiles);

            //if (beforeAction) {
            //}
          }
        }}
      >
        {contentOverride || (
          <div
            title={
              acceptToUse ? (
                "Accepts only the following file types: " + acceptToUse
              ) : (
                "Accepts any file input"
              )
            }
            className={"tg-upload-inner"}
          >
            {innerIcon || <span className={"pt-icon-upload pt-icon-large"} />}
            {innerText || "Click or drag to upload"}
          </div>
        )}
      </Dropzone>
      {fileList &&
      !!fileList.length && (
        <div>
          {fileList.map(file => {
            const { loading, name, url } = file;
            return fileListItemRenderer ? (
              fileListItemRenderer(file)
            ) : (
              <div className={"tg-upload-file-list-item"}>
                <span
                  style={{ fontSize: "13px", marginRight: 11 }}
                  className={
                    loading ? "pt-icon-repeat tg-spin" : "pt-icon-link"
                  }
                />
                <a
                  style={{ width: "100%" }}
                  name={name}
                  {...(url ? { href: url } : {})}
                >
                  {" "}
                  {name}{" "}
                </a>
                <span
                  style={{ fontSize: "13px" }}
                  className={"tg-upload-file-list-item-close pt-icon-cross"}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
