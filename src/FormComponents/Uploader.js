import React from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
// import { first } from "lodash";
import uniqid from "uniqid";
import classnames from "classnames";

function noop() {}
export default props => {
  const {
    accept,
    inputProps = {},
    contentOverride,
    innerIcon,
    innerText,
    action,
    className = "",
    fileLimit,
    uploadInBulk,
    showUploadList = true,
    beforeUpload,
    fileList,
    onFieldSubmit = noop,
    onRemove = noop,
    onChange = noop,
    fileListItemRenderer
  } = props;
  let acceptToUse = Array.isArray(accept) ? accept.join(", ") : accept;
  // const fileMap = fileList.reduce((acc,file)=>{
  //   if (!file.id) {
  //     throw new Error('Please pass files with unique .id fields to Uploader so it can keep track')
  //   }
  //   acc[file.id] = new;
  //   return acc;
  // }, {})
  let fileListToUse = fileList ? fileList : [];
  return (
    <div>
      <Dropzone
        className={"tg-dropzone " + className}
        activeClassName={"tg-dropzone-active"}
        //acceptClassName={"tg-dropzone-accept"}
        rejectClassName={"tg-dropzone-reject"}
        //disabledClassName={"tg-dropzone-disabled"}
        accept={acceptToUse}
        {...{
          onDrop: acceptedFiles => {
            if (fileLimit) {
              acceptedFiles = acceptedFiles.slice(0, fileLimit);
            }
            acceptedFiles.forEach(file => {
              file.loading = true;
              if (!file.id) {
                file.id = uniqid();
              }
            });
            if (beforeUpload) {
              const keepGoing = beforeUpload(acceptedFiles);
              if (keepGoing === false) {
                return;
              }
            }
            fileListToUse = [
              ...acceptedFiles.map(file => {
                return {
                  id: file.id,
                  lastModified: file.lastModified,
                  lastModifiedDate: file.lastModifiedDate,
                  loading: file.loading,
                  name: file.name,
                  preview: file.preview,
                  size: file.size,
                  type: file.type
                };
              }),
              ...fileListToUse
            ].slice(0, fileLimit ? fileLimit : undefined);
            onChange(fileListToUse);
            if (action) {
              const data = new FormData();
              acceptedFiles.forEach(file => {
                data.append("file", file);
              });

              if (uploadInBulk) {
                const config = {
                  onUploadProgress: function(progressEvent) {
                    let percentCompleted = Math.round(
                      progressEvent.loaded * 100 / progressEvent.total
                    );
                  }
                };

                axios
                  .post(action, data, config)
                  .then(function(res) {
                    onChange(res.data);
                  })
                  .catch(function(err) {
                    console.log("err:", err);
                  });
              } else {
                const responses = [];
                Promise.all(
                  acceptedFiles.map(fileToUpload => {
                    return axios
                      .post(action, data)
                      .then(function(res) {
                        console.log("res:", res);
                        responses.push(res.data && res.data[0]);
                        onChange(
                          (fileListToUse = fileListToUse.map(file => {
                            const fileToReturn = { ...file };
                            if (fileToReturn.id === fileToUpload.id) {
                              fileToReturn.loading = false;
                            }
                            return fileToReturn;
                          }))
                        );
                      })
                      .catch(function(err) {
                        console.error("Error uploading file:", err);
                        responses.push({
                          ...fileToUpload,
                          error: err && err.msg ? err.msg : err
                        });
                        onChange(
                          (fileListToUse = fileListToUse.map(file => {
                            const fileToReturn = { ...file };
                            if (fileToReturn.id === fileToUpload.id) {
                              fileToReturn.loading = false;
                              fileToReturn.status = true;
                            }
                            return fileToReturn;
                          }))
                        );
                      });
                  })
                ).then(() => {
                  console.log("responses:", responses);
                  onFieldSubmit(responses);
                });
              }
            }

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
      showUploadList &&
      !!fileList.length && (
        <div>
          {fileList.map((file, index) => {
            const { loading, error, name, originalName, url } = file;
            return fileListItemRenderer ? (
              fileListItemRenderer(file)
            ) : (
              <div key={index} className={"tg-upload-file-list-item"}>
                <span
                  style={{ fontSize: "13px", marginRight: 11 }}
                  className={classnames({
                    "pt-icon-saved": !loading && !error,
                    "pt-icon-error": error,
                    "pt-icon-repeat tg-spin": loading
                  })}
                />
                <a
                  style={{ width: "100%" }}
                  name={name || originalName}
                  {...(url ? { href: url } : {})}
                >
                  {" "}
                  {name || originalName}{" "}
                </a>
                <span
                  style={{ fontSize: "13px" }}
                  className={"tg-upload-file-list-item-close pt-icon-cross"}
                  onClick={() => {
                    onRemove(file, index, fileList);

                    onChange(
                      fileList.filter((file, index2) => {
                        return index2 !== index;
                      })
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
