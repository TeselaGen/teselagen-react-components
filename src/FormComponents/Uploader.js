import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Button,
  Classes,
  Icon,
  Menu,
  MenuItem,
  Popover,
  Position,
  Tooltip
} from "@blueprintjs/core";
import Dropzone from "react-dropzone";
// import { first } from "lodash";
import classnames from "classnames";
import { nanoid } from "nanoid";

import papaparse, { unparse } from "papaparse";

import downloadjs from "downloadjs";

import UploadCsvWizardDialog, {
  SimpleInsertDataDialog
} from "../UploadCsvWizard";
import { useDialog } from "../useDialog";
import {
  filterFilesInZip,
  isCsvOrExcelFile,
  isZipFile,
  parseCsvOrExcelFile,
  removeExt
} from "../utils/parserUtils";
import tryToMatchSchemas from "./tryToMatchSchemas";
import { isArray, isFunction, isPlainObject } from "lodash";
import { flatMap } from "lodash";
import urljoin from "url-join";
import popoverOverflowModifiers from "../utils/popoverOverflowModifiers";
import writeXlsxFile from "write-excel-file";
import { startCase } from "lodash";
import { getNewName } from "./getNewName";

const helperText = [
  `How to Use This Template to Upload New Data`,
  `1. Go to the first tab and delete the example data.`,
  `2. Input your rows of data organized under the appropriate columns. If you're confused about a column name, go to the "Data Dictionary" tab for clarification.`,
  `3. Save the file.`,
  `4. Return to the interface from which you dowloaded this template.`,
  `5. Upload the completed file.`
];
// const objects = [
//   {
//     name: 'John Smith',
//     age: 1800,
//     dateOfBirth: new Date(),
//     graduated: true
//   },
//   {
//     name: 'Alice Brown',
//     age: 2600.50,
//     dateOfBirth: new Date(),
//     graduated: false
//   }
// ]

const helperSchema = [
  {
    column: undefined,
    type: String,
    value: student => student,
    width: 200
  }
];

// const a = async () => {
//   console.log(`writin`);
//   const b = await writeXlsxFile([helperText, helperText,helperText], {

//     helperSchema: [helperSchema,helperSchema,helperSchema],
//     sheets: ["Sheet 1", "Data Dictionary", "Help Notes"],
//     filePath: "file.xlsx"
//   });
//   downloadjs(b, "file.xlsx", "xlsx");
//   console.log(`b:`, b);
// };
// setTimeout(() => {
//   a();
// }, 0);

function noop() {}
// wink wink
const emptyPromise = Promise.resolve.bind(Promise);

function Uploader({
  accept: _accept,
  contentOverride: maybeContentOverride,
  innerIcon,
  innerText,
  action,
  className = "",
  minimal,
  validateAgainstSchema: _validateAgainstSchema,
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
  let validateAgainstSchema = _validateAgainstSchema;
  const accept = !_accept
    ? undefined
    : isPlainObject(_accept)
    ? [_accept]
    : isArray(_accept)
    ? _accept
    : _accept.split(",").map(a => ({ type: a }));
  if (accept && !accept.some(a => a.type === "zip")) {
    accept?.unshift({
      type: "zip",
      description: "Any of the following types, just compressed"
    });
  }
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
  let simpleAccept;
  let handleManuallyEnterData;
  let advancedAccept;
  if (Array.isArray(accept)) {
    if (accept.some(a => isPlainObject(a))) {
      //advanced accept
      advancedAccept = accept;
      simpleAccept = flatMap(accept, a => {
        if (a.validateAgainstSchema) {
          validateAgainstSchema = a.validateAgainstSchema;
          handleManuallyEnterData = async e => {
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
              //check existing files to make sure the new file name gets incremented if necessary
              // fileList

              const newFileName = getNewName(fileList, `manual_data_entry.csv`);
              const newFile = new File(
                [papaparse.unparse(newEntities)],
                newFileName
              );
              const file = {
                ...newFile,
                parsedData: newEntities,
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
          };

          const nameToUse = startCase(validateAgainstSchema.name) || "Example";

          const handleDownloadXlsxFile = async () => {
            const dataDictionarySchema = [
              { value: f => f.displayName || f.path, column: `Name` },
              {
                value: f => f.isUnique,
                column: `Unique`
              },
              {
                value: f => f.isRequired,
                column: `Required`,
                type: Boolean
              },
              {
                value: f => f.type || "text",
                column: `Data Type`
              },
              {
                value: f => f.description,
                column: `Notes`
              },
              {
                value: f => f.example || f.defaultValue || "",
                column: `Example Data`
              }
            ];

            const mainExampleData = {};
            const mainSchema = a.validateAgainstSchema.fields.map(f => {
              mainExampleData[f.displayName || f.path] =
                f.example || f.defaultValue;
              return {
                column: f.displayName || f.path,
                value: v => {
                  return v[f.displayName || f.path];
                }
              };
            });
            const b = await writeXlsxFile(
              [[mainExampleData], a.validateAgainstSchema.fields, helperText],
              {
                headerStyle: {
                  fontWeight: "bold"
                },
                schema: [mainSchema, dataDictionarySchema, helperSchema],
                sheets: [nameToUse, "Data Dictionary", "Help Notes"],
                filePath: "file.xlsx"
              }
            );
            downloadjs(b, `${nameToUse}.xlsx`, "xlsx");
          };
          // handleDownloadXlsxFile()
          a.exampleFiles = [
            // ...(a.exampleFile ? [a.exampleFile] : []),
            {
              description: "Download Example CSV File",
              exampleFile: () => {
                const rows = [];
                rows.push(
                  a.validateAgainstSchema.fields.map(f => {
                    return `${f.displayName || f.path}`;
                  })
                );
                rows.push(
                  a.validateAgainstSchema.fields.map(f => {
                    return `${f.example || f.defaultValue || ""}`;
                  })
                );

                const csv = unparse(rows);

                downloadjs(csv, `${nameToUse}.csv`, "csv");
              }
            },
            {
              description: "Download Example XLSX File",
              exampleFile: handleDownloadXlsxFile
            },
            {
              description: "Manually Enter Data",
              icon: "manually-entered-data",
              exampleFile: handleManuallyEnterData
            }
          ];
          delete a.exampleFile;
        }
        if (a.type) return a.type;
        return a;
      });
      simpleAccept = simpleAccept.join(", ");
    } else {
      simpleAccept = accept.join(", ");
    }
  } else {
    simpleAccept = accept;
  }

  const fileListToUse = fileList ? fileList : [];

  async function handleSecondHalfOfUpload({ acceptedFiles, cleanedFileList }) {
    onChange(cleanedFileList); //tnw: this line is necessary, if you want to clear the file list in the beforeUpload, call onChange([])
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
        {simpleAccept && (
          <div
            className={Classes.TEXT_MUTED}
            style={{ fontSize: 11, marginBottom: 5 }}
          >
            {advancedAccept ? (
              <div style={{}}>
                Accepts &nbsp;
                <span style={{}}>
                  {advancedAccept.map((a, i) => {
                    const disabled = !(
                      a.description ||
                      a.exampleFile ||
                      a.exampleFiles
                    );
                    const PopOrTooltip = a.exampleFiles ? Popover : Tooltip;
                    const hasDownload = a.exampleFile || a.exampleFiles;
                    const CustomTag = !hasDownload ? "span" : "a";
                    return (
                      <PopOrTooltip
                        key={i}
                        interactionKind="hover"
                        disabled={disabled}
                        modifiers={popoverOverflowModifiers}
                        content={
                          a.exampleFiles ? (
                            <Menu>
                              {a.exampleFiles.map(
                                ({ description, exampleFile, icon }, i) => {
                                  return (
                                    <MenuItem
                                      icon={icon || "download"}
                                      intent="primary"
                                      text={description}
                                      {...getFileDownloadAttr(exampleFile)}
                                      key={i}
                                    ></MenuItem>
                                  );
                                }
                              )}
                            </Menu>
                          ) : (
                            <div
                              style={{ maxWidth: 400, wordBreak: "break-word" }}
                            >
                              {a.description ? (
                                <div
                                  style={{
                                    marginBottom: 4,
                                    fontStyle: "italic"
                                  }}
                                >
                                  {a.description}
                                </div>
                              ) : (
                                ""
                              )}
                              {a.exampleFile &&
                                (a.isTemplate
                                  ? "Download Example Template"
                                  : "Download Example File")}
                            </div>
                          )
                        }
                      >
                        <CustomTag
                          className="tgFileTypeDescriptor"
                          style={{ marginRight: 10, cursor: "pointer" }}
                          {...getFileDownloadAttr(a.exampleFile)}
                        >
                          {(a.type
                            ? isArray(a.type)
                              ? a.type
                              : [a.type]
                            : [a]
                          )
                            .map(t => {
                              return t.startsWith(".") ? t : "." + t;
                            })
                            .join(", ")}

                          {hasDownload && (
                            <Icon
                              style={{
                                marginTop: 3,
                                marginLeft: 3
                              }}
                              size={10}
                              icon="download"
                            ></Icon>
                          )}
                        </CustomTag>
                      </PopOrTooltip>
                    );
                  })}
                </span>
              </div>
            ) : (
              <>Accepts {simpleAccept}</>
            )}
          </div>
        )}
        <Dropzone
          disabled={disabled}
          onClick={evt => evt.preventDefault()}
          multiple={fileLimit !== 1}
          accept={
            simpleAccept
              ? simpleAccept
                  .split(", ")
                  .map(a => (a.startsWith(".") ? a : "." + a))
                  .join(", ")
              : undefined
          }
          {...{
            onDrop: async (_acceptedFiles, rejectedFiles) => {
              let acceptedFiles = [];
              for (const file of _acceptedFiles) {
                if (isZipFile(file)) {
                  const files = await filterFilesInZip(
                    file,
                    simpleAccept
                      ?.split(", ")
                      ?.map(a => (a.startsWith(".") ? a : "." + a)) || []
                  );
                  acceptedFiles.push(...files.map(f => f.originFileObj));
                } else {
                  acceptedFiles.push(file);
                }
              }
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
              const cleanedAccepted = acceptedFiles.map(file => {
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
              });
              const cleanedFileList = [
                ...cleanedAccepted,
                ...fileListToUse
              ].slice(0, fileLimit ? fileLimit : undefined);

              if (validateAgainstSchema) {
                const filesWIssues = [];
                const filesWOIssues = [];
                for (const file of cleanedAccepted) {
                  if (isCsvOrExcelFile(file)) {
                    const parsedF = await parseCsvOrExcelFile(file);
                    const {
                      csvValidationIssue,
                      matchedHeaders,
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
                        matchedHeaders,
                        userSchema,
                        searchResults
                      });
                    } else {
                      filesWOIssues.push({
                        file,
                        csvValidationIssue,
                        matchedHeaders,
                        userSchema,
                        searchResults
                      });
                      const newFile = new File(
                        [papaparse.unparse(userSchema.userData)],
                        file.name
                      );
                      file.parsedData = userSchema.userData;
                      const newFileName = removeExt(file.name) + `.csv`;
                      file.name = newFileName;
                      file.originFileObj = newFile;
                      file.originalFileObj = newFile;
                    }
                  }
                }
                if (filesWIssues.length) {
                  const { file } = filesWIssues[0];
                  const allFiles = [...filesWIssues, ...filesWOIssues];
                  const doAllFilesHaveSameHeaders = allFiles.every(f => {
                    if (f.userSchema.fields && f.userSchema.fields.length) {
                      return f.userSchema.fields.every((h, i) => {
                        return h.path === allFiles[0].userSchema.fields[i].path;
                      });
                    }
                    return false;
                  });
                  const multipleFiles = allFiles.length > 1;
                  const { res } = await showUploadCsvWizardDialog(
                    "onUploadWizardFinish",
                    {
                      dialogProps: {
                        title: `Fix Up File${multipleFiles ? "s" : ""} ${
                          multipleFiles ? "" : file.name ? `"${file.name}"` : ""
                        }`
                      },
                      doAllFilesHaveSameHeaders,
                      filesWIssues: allFiles,
                      validateAgainstSchema
                    }
                  );

                  if (!res) {
                    window.toastr.warning(`File Upload Aborted`);
                    return;
                  } else {
                    allFiles.forEach(({ file }, i) => {
                      const newEntities = res[i];
                      // const newFileName = removeExt(file.name) + `_updated.csv`;
                      //swap out file with a new csv file
                      const newFile = new File(
                        [papaparse.unparse(newEntities)],
                        file.name
                      );
                      file.parsedData = newEntities;
                      // file.name = newFileName;
                      file.originFileObj = newFile;
                      file.originalFileObj = newFile;
                    });
                    setTimeout(() => {
                      //inside a timeout for cypress purposes
                      window.toastr.success(
                        `Added Fixed Up File${
                          allFiles.length > 1 ? "s" : ""
                        } ${allFiles.map(({ file }) => file.name).join(", ")}`
                      );
                    }, 200);
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
                      simpleAccept
                        ? "Accepts only the following file types: " +
                          simpleAccept
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
                  onClick={handleManuallyEnterData}
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
                      {...(url && !onFileClick
                        ? { download: true, href: url }
                        : {})}
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

function getFileDownloadAttr(exampleFile) {
  const baseUrl = window?.frontEndConfig?.serverBasePath || "";
  return isFunction(exampleFile)
    ? { onClick: exampleFile }
    : exampleFile && {
        target: "_blank",
        download: true,
        href:
          exampleFile.startsWith("https") || exampleFile.startsWith("www")
            ? exampleFile
            : baseUrl
            ? urljoin(baseUrl, "exampleFiles", exampleFile)
            : exampleFile
      };
}
