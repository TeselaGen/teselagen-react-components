import React from "react";
import axios from "axios";
import { Icon } from "@blueprintjs/core";
import Dropzone from "react-dropzone";
// import { first } from "lodash";
import uniqid from "uniqid";
import classnames from "classnames";

function noop() {}
// wink wink
const emptyPromise = Promise.resolve.bind(Promise);

export default props => {
  const {
    accept,
    contentOverride,
    innerIcon,
    innerText,
    action,
    className = "",
    fileLimit,
    readBeforeUpload, //read the file using the browser's FileReader before passing it to onChange and/or uploading it
    uploadInBulk, //tnr: not yet implemented
    showUploadList = true,
    beforeUpload,
    fileList, //list of files with options: {name, loading, error, url, originalName, downloadName}
    fileListItemRenderer, // handle rendering the file list items yourself :)
    onFileSuccess = emptyPromise, //called each time a file is finished and before the file.loading gets set to false, needs to return a promise!
    onFieldSubmit = noop, //called when all files have successfully uploaded
    onRemove = noop, //called when a file has been selected to be removed
    onChange = noop, //this is almost always getting passed by redux-form, no need to pass this handler manually
    onFileClick, // called when a file link in the filelist is clicked
    dropzoneProps = {}
  } = props;

  let acceptToUse = Array.isArray(accept) ? accept.join(", ") : accept;
  let fileListToUse = fileList ? fileList : [];
  return (
    <div>
      <Dropzone
        className={"tg-dropzone " + className}
        multiple={fileLimit !== 1}
        activeClassName={"tg-dropzone-active"}
        rejectClassName={"tg-dropzone-reject"}
        //acceptClassName={"tg-dropzone-accept"} //tnr: commenting these out temporarily until https://github.com/react-dropzone/react-dropzone/pull/504 gets merged
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

            Promise.resolve()
              .then(() => {
                if (readBeforeUpload) {
                  return Promise.all(
                    acceptedFiles.map(file => {
                      return new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.readAsText(file, "UTF-8");
                        reader.onload = evt => {
                          file.parsedString = evt.target.result;
                          resolve(file);
                        };
                        reader.onerror = err => {
                          console.error("err:", err);
                          reject(err);
                        };
                      });
                    })
                  );
                } else {
                  return acceptedFiles;
                }
              })
              .then(files => {
                fileListToUse = [
                  ...files.map(file => {
                    return {
                      originFileObj: file,
                      originalFileObj: file,
                      id: file.id,
                      lastModified: file.lastModified,
                      lastModifiedDate: file.lastModifiedDate,
                      loading: file.loading,
                      name: file.name,
                      preview: file.preview,
                      size: file.size,
                      type: file.type,
                      ...(file.parsedString
                        ? { parsedString: file.parsedString }
                        : {})
                    };
                  }),
                  ...fileListToUse
                ].slice(0, fileLimit ? fileLimit : undefined);

                onChange(fileListToUse);
                return fileListToUse;
              })
              .then(acceptedFiles => {
                return beforeUpload
                  ? beforeUpload(acceptedFiles, onChange)
                  : true;
              })
              .then(keepGoing => {
                if (!keepGoing) return;
                if (action) {
                  if (uploadInBulk) {
                    //tnr: not yet implemented
                    /* const config = {
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
                      }); */
                  } else {
                    const responses = [];
                    Promise.all(
                      acceptedFiles.map(fileToUpload => {
                        const data = new FormData();
                        data.append("file", fileToUpload);
                        return axios
                          .post(action, data)
                          .then(function(res) {
                            responses.push(res.data && res.data[0]);
                            onFileSuccess(res.data[0]).then(() => {
                              onChange(
                                (fileListToUse = fileListToUse.map(file => {
                                  const fileToReturn = { ...file };
                                  if (fileToReturn.id === fileToUpload.id) {
                                    fileToReturn.loading = false;
                                  }
                                  return fileToReturn;
                                }))
                              );
                            });
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
                                  fileToReturn.error = true;
                                }
                                return fileToReturn;
                              }))
                            );
                          });
                      })
                    ).then(() => {
                      onFieldSubmit(responses);
                    });
                  }
                } else {
                  onChange(
                    fileListToUse.map(function(file) {
                      return {
                        ...file,
                        loading: false
                      };
                    })
                  );
                }
              });
          }
        }}
        {...dropzoneProps}
      >
        {contentOverride || (
          <div
            title={
              acceptToUse
                ? "Accepts only the following file types: " + acceptToUse
                : "Accepts any file input"
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
              const {
                loading,
                error,
                name,
                originalName,
                url,
                downloadName
              } = file;
              let icon;
              if (loading) {
                icon = "repeat";
              } else if (error) {
                icon = "error";
              } else {
                icon = "saved";
              }
              return fileListItemRenderer ? (
                fileListItemRenderer(file)
              ) : (
                <div key={index} className={"tg-upload-file-list-item"}>
                  <div>
                    <Icon
                      className={classnames({
                        "tg-spin": loading
                      })}
                      icon={icon}
                    />
                    <a
                      name={name || originalName}
                      {...(url && !onFileClick ? { href: url } : {})}
                      /* eslint-disable react/jsx-no-bind*/
                      onClick={() => onFileClick && onFileClick(file)}
                      /* eslint-enable react/jsx-no-bind*/
                      {...(downloadName ? { download: downloadName } : {})}
                    >
                      {" "}
                      {name || originalName}{" "}
                    </a>
                  </div>
                  {!loading && (
                    <span
                      style={{ fontSize: "13px" }}
                      className={"tg-upload-file-list-item-close pt-icon-cross"}
                      /* eslint-disable react/jsx-no-bind*/
                      onClick={() => {
                        onRemove(file, index, fileList);
                        onChange(
                          fileList.filter((file, index2) => {
                            return index2 !== index;
                          })
                        );
                      }}
                      /* eslint-enable react/jsx-no-bind*/
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};
