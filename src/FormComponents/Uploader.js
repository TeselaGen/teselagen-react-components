import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Button,
  Classes,
  Icon,
  Menu,
  Popover,
  Position
} from "@blueprintjs/core";
import Dropzone from "react-dropzone";
// import { first } from "lodash";
import classnames from "classnames";
import { nanoid } from "nanoid";

import papaparse from "papaparse";

import downloadjs from "downloadjs";

import UploadCsvWizardDialog, {
  SimpleInsertDataDialog
} from "../UploadCsvWizard";
import { useDialog } from "../useDialog";
import {
  isCsvOrExcelFile,
  parseCsvOrExcelFile,
  removeExt
} from "../utils/parserUtils";
import tryToMatchSchemas from "./tryToMatchSchemas";

function noop() {}
// wink wink
const emptyPromise = Promise.resolve.bind(Promise);

function Uploader({
  accept,
  contentOverride: maybeContentOverride,
  innerIcon,
  innerText,
  action,
  className = "",
  minimal,
  validateAgainstSchema,
  fileLimit,
  readBeforeUpload, //read the file using the browser's FileReader before passing it to onChange and/or uploading it
  uploadInBulk, //tnr: not yet implemented
  showUploadList = true,
  beforeUpload,
  fileList, //list of files with options: {name, loading, error, url, originalName, downloadName}
  onFileSuccess = emptyPromise, //called each time a file is finished and before the file.loading gets set to false, needs to return a promise!
  onFieldSubmit = noop, //called when all files have successfully uploaded
  // fileFinished = noop,
  onRemove = noop, //called when a file has been selected to be removed
  onChange = noop, //this is almost always getting passed by redux-form, no need to pass this handler manually
  onFileClick, // called when a file link in the filelist is clicked
  dropzoneProps = {},
  overflowList,
  disabled,
  showFilesCount,
  threeDotMenuItems,
  onPreviewClick,
  axiosInstance = window.api || axios
}) {
  const [loading, setLoading] = useState(false);
  const filesToClean = useRef([]);

  const { showDialogPromise: showUploadCsvWizardDialog, comp } = useDialog({
    ModalComponent: UploadCsvWizardDialog
  });
  const {
    showDialogPromise: showSimpleInsertDataDialog,
    comp: comp2
  } = useDialog({
    ModalComponent: SimpleInsertDataDialog
  });

  function cleanupFiles() {
    filesToClean.current.forEach(file => URL.revokeObjectURL(file.preview));
  }
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cleanupFiles();
    };
  });

  let contentOverride = maybeContentOverride;
  if (contentOverride && typeof contentOverride === "function") {
    contentOverride = contentOverride({ loading });
  }

  const acceptToUse = Array.isArray(accept) ? accept.join(", ") : accept;
  const fileListToUse = fileList ? fileList : [];

  async function handleSecondHalfOfUpload({ acceptedFiles, cleanedFileList }) {
    // onChange(cleanedFileList); //tnw: commenting this out because I don't think we should be triggering this before
    // beforeUpload is called, otherwise beforeUpload will not be able to truly cancel the upload
    const keepGoing = beforeUpload
      ? await beforeUpload(cleanedFileList, onChange)
      : true;
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

        await Promise.all(
          acceptedFiles.map(fileToUpload => {
            const data = new FormData();
            data.append("file", fileToUpload);

            return axiosInstance
              .post(action, data)
              .then(function(res) {
                responses.push(res.data && res.data[0]);
                onFileSuccess(res.data[0]).then(() => {
                  cleanedFileList = cleanedFileList.map(file => {
                    const fileToReturn = {
                      ...file,
                      ...res.data[0]
                    };
                    if (fileToReturn.id === fileToUpload.id) {
                      fileToReturn.loading = false;
                    }
                    return fileToReturn;
                  });
                  onChange(cleanedFileList);
                });
              })
              .catch(function(err) {
                console.error("Error uploading file:", err);
                responses.push({
                  ...fileToUpload,
                  error: err && err.msg ? err.msg : err
                });
                cleanedFileList = cleanedFileList.map(file => {
                  const fileToReturn = { ...file };
                  if (fileToReturn.id === fileToUpload.id) {
                    fileToReturn.loading = false;
                    fileToReturn.error = true;
                  }
                  return fileToReturn;
                });
                onChange(cleanedFileList);
              });
          })
        );
        onFieldSubmit(responses);
      }
    } else {
      onChange(
        cleanedFileList.map(function(file) {
          return {
            ...file,
            loading: false
          };
        })
      );
    }
    setLoading(false);
  }
  return (
    <div
      className="tg-uploader-outer"
      style={{
        width: minimal ? undefined : "100%",
        display: "flex",
        height: "fit-content"
      }}
    >
      {comp}
      {comp2}
      <div
        className="tg-uploader-inner"
        style={{ width: "100%", height: "fit-content", minWidth: 0 }}
      >
        {acceptToUse && (
          <div
            className={Classes.TEXT_MUTED}
            style={{ fontSize: 11, marginBottom: 5 }}
          >
            Accepts {acceptToUse}
          </div>
        )}
        <Dropzone
          disabled={disabled}
          onClick={evt => evt.preventDefault()}
          multiple={fileLimit !== 1}
          accept={acceptToUse}
          {...{
            onDrop: async (acceptedFiles, rejectedFiles) => {
              cleanupFiles();
              if (rejectedFiles.length) {
                let msg = "";
                rejectedFiles.forEach(file => {
                  if (msg) msg += "\n";
                  msg +=
                    `${file.file.name}: ` +
                    file.errors.map(err => err.message).join(", ");
                });
                window.toastr &&
                  window.toastr.warning(
                    <div className="preserve-newline">{msg}</div>
                  );
              }
              if (!acceptedFiles.length) return;
              setLoading(true);
              if (fileLimit) {
                acceptedFiles = acceptedFiles.slice(0, fileLimit);
              }

              acceptedFiles.forEach(file => {
                file.preview = URL.createObjectURL(file);
                file.loading = true;
                if (!file.id) {
                  file.id = nanoid();
                }
                filesToClean.current.push(file);
              });

              if (readBeforeUpload) {
                acceptedFiles = await Promise.all(
                  acceptedFiles.map(file => {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
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
              }

              const cleanedFileList = [
                ...acceptedFiles.map(file => {
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

              if (validateAgainstSchema) {
                const filesWIssues = [];
                for (const file of cleanedFileList) {
                  if (isCsvOrExcelFile(file)) {
                    const parsedF = await parseCsvOrExcelFile(file);
                    const {
                      csvValidationIssue,
                      initialMatchedHeaders,
                      userSchema,
                      searchResults
                    } = tryToMatchSchemas({
                      incomingData: parsedF.data,
                      validateAgainstSchema
                    });
                    if (csvValidationIssue) {
                      filesWIssues.push({
                        file,
                        csvValidationIssue,
                        initialMatchedHeaders,
                        userSchema,
                        searchResults
                      });
                    } else {
                      const newFile = new File(
                        [papaparse.unparse(userSchema.userData)],
                        file.name
                      );
                      const newFileName = removeExt(file.name) + `.csv`;
                      file.name = newFileName;
                      file.originFileObj = newFile;
                      file.originalFileObj = newFile;
                    }
                  }
                }
                if (filesWIssues.length) {
                  const {
                    file,
                    name,
                    csvValidationIssue,
                    ...rest
                  } = filesWIssues[0];

                  //just handle the 1st file for now
                  const { newEntities } = await showUploadCsvWizardDialog(
                    "onUploadWizardFinish",
                    {
                      ...rest,
                      dialogProps: {
                        title: `Fix Up File ${
                          file.name ? `"${file.name}"` : ""
                        }`
                      },
                      csvValidationIssue,
                      validateAgainstSchema
                    }
                  );

                  if (!newEntities) {
                    window.toastr.warning(`File Upload Aborted`);
                    return;
                  } else {
                    const newFileName = removeExt(file.name) + `_updated.csv`;
                    //swap out file with a new csv file
                    const newFile = new File(
                      [papaparse.unparse(newEntities)],
                      newFileName
                    );

                    file.name = newFileName;
                    file.originFileObj = newFile;
                    file.originalFileObj = newFile;

                    window.toastr.success(`Added Fixed Up File ${newFileName}`);
                  }
                }
              }

              handleSecondHalfOfUpload({ acceptedFiles, cleanedFileList });
            }
          }}
          {...dropzoneProps}
        >
          {({
            getRootProps,
            getInputProps,
            isDragAccept,
            isDragReject,
            isDragActive
            // isDragActive
            // isDragReject
            // isDragAccept
          }) => (
            <section>
              <div
                {...getRootProps()}
                className={classnames("tg-dropzone", className, {
                  "tg-dropzone-minimal": minimal,
                  "tg-dropzone-active": isDragActive,
                  "tg-dropzone-reject": isDragReject, // tnr: the acceptClassName/rejectClassName doesn't work with file extensions (only mimetypes are supported when dragging). Thus we'll just always turn the drop area blue when dragging and let the filtering occur on drop. See https://github.com/react-dropzone/react-dropzone/issues/888#issuecomment-773938074
                  "tg-dropzone-accept": isDragAccept,
                  "tg-dropzone-disabled": disabled
                })}
              >
                <input {...getInputProps()} />
                {contentOverride || (
                  <div
                    title={
                      acceptToUse
                        ? "Accepts only the following file types: " +
                          acceptToUse
                        : "Accepts any file input"
                    }
                    className="tg-upload-inner"
                  >
                    {innerIcon || (
                      <Icon icon="upload" iconSize={minimal ? 15 : 30} />
                    )}
                    {innerText ||
                      (minimal ? "Upload" : "Click or drag to upload")}
                  </div>
                )}
              </div>
              {validateAgainstSchema && (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    marginTop: 7,
                    marginBottom: 5
                  }}
                  onClick={async e => {
                    e.stopPropagation();
                    const { newEntities } = await showSimpleInsertDataDialog(
                      "onSimpleInsertDialogFinish",
                      {
                        validateAgainstSchema
                      }
                    );
                    if (!newEntities) {
                      return;
                    } else {
                      const newFileName = `manual_data_entry.csv`;
                      const newFile = new File(
                        [papaparse.unparse(newEntities)],
                        newFileName
                      );
                      const file = {
                        ...newFile,
                        name: newFileName,
                        originFileObj: newFile,
                        originalFileObj: newFile,
                        id: nanoid()
                      };

                      const cleanedFileList = [file, ...fileListToUse].slice(
                        0,
                        fileLimit ? fileLimit : undefined
                      );
                      handleSecondHalfOfUpload({
                        acceptedFiles: cleanedFileList,
                        cleanedFileList
                      });
                      window.toastr.success(`File Added`);
                    }
                  }}
                  className="link-button"
                >
                  .. or manually enter data
                </div>
              )}
              {showFilesCount ? (
                <div className="tg-upload-file-list-counter">
                  Files: {fileList ? fileList.length : 0}
                </div>
              ) : null}
            </section>
          )}
        </Dropzone>
        {/* {validateAgainstSchema && <CsvWizardHelper bindToggle={{}} validateAgainstSchema={validateAgainstSchema}></CsvWizardHelper>} */}

        {fileList && showUploadList && !minimal && !!fileList.length && (
          <div
            className={
              overflowList ? "tg-upload-file-list-item-overflow" : null
            }
          >
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
              let isPreviewable = false;
              if (loading) {
                icon = "repeat";
              } else if (error) {
                icon = "error";
              } else {
                if (onPreviewClick) {
                  isPreviewable = true;
                  icon = "eye-open";
                } else {
                  icon = "saved";
                }
              }
              return (
                <div
                  key={index}
                  className="tg-upload-file-list-item"
                  style={{ display: "flex", width: "100%" }}
                >
                  <div style={{ display: "flex", width: "100%" }}>
                    <Icon
                      className={classnames({
                        "tg-spin": loading,
                        "tg-upload-file-list-item-preview": isPreviewable
                      })}
                      style={{ marginRight: 5 }}
                      icon={icon}
                      onClick={() => {
                        if (isPreviewable) {
                          onPreviewClick(file, index, fileList);
                        }
                      }}
                    />
                    <a
                      name={name || originalName}
                      {...(url && !onFileClick ? { href: url } : {})}
                      /* eslint-disable react/jsx-no-bind*/
                      onClick={() => {
                        if (onFileClick) {
                          onFileClick(file);
                        } else {
                          //handle default download
                          if (file.originFileObj) {
                            downloadjs(file.originFileObj, file.name);
                          }
                        }
                      }}
                      /* eslint-enable react/jsx-no-bind*/
                      {...(downloadName ? { download: downloadName } : {})}
                    >
                      {" "}
                      {name || originalName}{" "}
                    </a>
                    {!loading && (
                      <Icon
                        onClick={() => {
                          onRemove(file, index, fileList);
                          onChange(
                            fileList.filter((file, index2) => {
                              return index2 !== index;
                            })
                          );
                        }}
                        iconSize={16}
                        icon="cross"
                        className="tg-upload-file-list-item-close"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {threeDotMenuItems && (
        <div className="tg-dropzone-extra-options">
          <Popover
            autoFocus={false}
            minimal
            content={<Menu>{threeDotMenuItems}</Menu>}
            position={Position.BOTTOM_RIGHT}
          >
            <Button minimal icon="more" />
          </Popover>
        </div>
      )}
    </div>
  );
}

export default Uploader;
