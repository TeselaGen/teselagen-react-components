import React, { Component } from "react";
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
import { some, forEach, map, every, compact, findIndex, merge } from "lodash";
import shortid from "shortid";
import ItemUpload from "./itemUpload";

function noop() {}
// wink wink
const emptyPromise = Promise.resolve.bind(Promise);

class Uploader extends Component {
  constructor(props) {
    super(props);
    this.uploadingFiles = {};
    this.state = {
      loading: false,
      uploading: {},
      uploadingFiles: {},
      allSaved: false,
      onDragOver: false,
      startUploads: false,

      startUpload: false,
      abortUploads: false,
      fileSetId: null
    };
  }

  /* componentDidUpdate(prevProps) {
    if (prevProps.startUpload !== this.props.startUpload) {
      if (this.props.startUpload) {
        this.sendFiles();
      }
    }

    if (this.props.updateStatus) {
      this.props.updateStatus(this.props.fieldName, {
        loading: this.state.loading,
        allSaved: this.state.allSaved
      });
    }

    if (this.props.abortUploads) {
      this.abortAllUploads();
    }
  } */

  showProgress = (progressEvent, fileId) => {
    if (progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      const up = this.state.uploading;
      up[fileId] = merge(up[fileId], {
        percentage: percentCompleted,
        loading: true,
        saved: false,
        error: null
      });
      this.setState({
        uploading: up
      });
    }
  };

  onFinishUpload = (saved, fileId) => {
    const up = this.state.uploading;
    up[fileId] = merge(up[fileId], {
      percentage: 100,
      loading: false,
      saved: true,
      error: null,
      info: saved,
      path: saved.publicUrl
    });
    this.props.fileFinished && this.props.fileFinished(saved, fileId);
    this.checkLoadings(up);
  };

  onUploadError = (e, fileId) => {
    const up = this.state.uploading;
    up[fileId] = merge(up[fileId], {
      percentage: 0,
      loading: false,
      saved: false,
      error: JSON.stringify(e)
    });
    this.checkLoadings(up);
  };

  abortUpload = item => {
    this.uploadingFiles[item.id].abortUpload();
    const up = this.state.uploading;
    up[item.id] = {
      percentage: 0,
      loading: false,
      saved: false,
      error: "Upload aborted"
    };
    this.checkLoadings(up);
  };

  abortAllUploads = async () => {
    return await forEach(this.uploadingFiles, item => item.abortUpload());
  };

  checkLoadings = items => {
    const m = map(items, item => item);
    const l = some(m, { loading: true });
    const s = every(m, { saved: true });
    if (s || !l) this.props.onFieldSubmit(Object.values(items));
    this.setState({
      uploading: items,
      loading: l,
      allSaved: s
    });
  };

  deleteItem = item => {
    const fields = this.props.fileList;
    if (!fields) {
      console.error("Can't delete item");
      return;
    }
    const i = findIndex(fields, { id: item.id });
    delete fields[i];
    //we need to compact array to avoid empty fields
    const compactFields = compact(fields);
    this.props.onChange(compactFields);
  };

  itemListRender = item => {
    let isActive = false;
    let value = 0;
    let error = null;
    let saved = false;
    const fileUpload = this.state.uploading[item.id];

    if (fileUpload) {
      isActive = fileUpload.loading;
      value = fileUpload.percentage;
      error = fileUpload.error;
      saved = fileUpload.saved;
    }

    return (
      <ItemUpload
        key={item.id}
        item={item}
        active={isActive}
        value={value}
        error={error}
        saved={saved}
        onClick={file => {
          console.info("Try download file");
          console.info(file);
        }}
        onCancel={
          isActive
            ? this.abortUpload.bind(this, item)
            : this.deleteItem.bind(this, item)
        }
      />
    );
  };

  render() {
    const { loading, uploading } = this.state;
    const {
      accept,
      contentOverride: maybeContentOverride,
      innerIcon,
      innerText,
      action,
      className = "",
      minimal,
      fileLimit,
      readBeforeUpload, //read the file using the browser's FileReader before passing it to onChange and/or uploading it
      uploadInBulk, //tnr: not yet implemented
      showUploadList = true,
      beforeUpload,
      fileList, //list of files with options: {name, loading, error, url, originalName, downloadName}
      fileListItemRenderer, // handle rendering the file list items yourself (receive filelist and context) :)
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
    } = this.props;

    let contentOverride = maybeContentOverride;
    if (contentOverride && typeof contentOverride === "function") {
      contentOverride = contentOverride({ uploading, loading });
    }

    const self = this;
    const acceptToUse = Array.isArray(accept) ? accept.join(", ") : accept;
    const fileListToUse = fileList ? fileList : [];

    return (
      <div
        className="tg-uploader-outer"
        style={{
          width: minimal ? undefined : "100%",
          display: "flex",
          height: "fit-content"
        }}
      >
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
                if (rejectedFiles.length) {
                  const fileNames = rejectedFiles.map(f => f.name);
                  window.toastr &&
                    window.toastr
                      .warning(`This uploader accepts ${acceptToUse}. These files were rejected because they \
                do not have the proper extension: ${fileNames.join(", ")}`);
                }
                if (!acceptedFiles.length) return;
                this.setState({
                  loading: true
                });
                if (fileLimit) {
                  acceptedFiles = acceptedFiles.slice(0, fileLimit);
                }
                acceptedFiles.forEach(file => {
                  file.loading = true;
                  if (!file.id) {
                    file.id = shortid();
                  }
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

                let cleanedFileList = [
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

                onChange(cleanedFileList);

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
                this.setState({
                  loading: false
                });
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
                {showFilesCount ? (
                  <div className="tg-upload-file-list-counter">
                    Files: {fileList ? fileList.length : 0}
                  </div>
                ) : null}
              </section>
            )}
          </Dropzone>

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
                return fileListItemRenderer ? (
                  fileListItemRenderer(file, self)
                ) : (
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
                        onClick={() => onFileClick && onFileClick(file)}
                        /* eslint-enable react/jsx-no-bind*/
                        {...(downloadName ? { download: downloadName } : {})}
                      >
                        {" "}
                        {name || originalName}{" "}
                      </a>
                    </div>
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
}

export default Uploader;
