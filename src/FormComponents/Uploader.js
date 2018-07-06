import React, { Component } from "react";
import axios from "axios";
import { Icon } from "@blueprintjs/core";
import Dropzone from "react-dropzone";
// import { first } from "lodash";
import uniqid from "uniqid";
import classnames from "classnames";
import { some, forEach, map, every, compact, findIndex } from "lodash";
import ItemUpload from "./itemUpload";
import S3Upload from "../utils/S3upload";

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

  componentDidUpdate(prevProps) {
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
  }

  showProgress = (progressEvent, fileId) => {
    if (progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      const up = this.state.uploading;
      up[fileId] = {
        percentage: percentCompleted,
        loading: true,
        saved: false,
        error: null
      };
      this.setState({
        uploading: up
      });
    }
  };

  onFinishUpload = (saved, fileId) => {
    const up = this.state.uploading;
    up[fileId] = {
      percentage: 100,
      loading: false,
      saved: true,
      error: null
    };
    this.props.fileSaved(saved, fileId);
    this.checkLoadings(up);
  };

  onUploadError = (e, fileId) => {
    const up = this.state.uploading;
    up[fileId] = {
      percentage: 0,
      loading: false,
      saved: false,
      error: JSON.stringify(e)
    };
    this.checkLoadings(up);
  };

  sendFiles = async files => {
    const up = {};
    files.forEach(file => {
      const f = new File([file.originFileObj], file.originFileObj.name, {
        type: file.originFileObj.type,
        id: file.id
      });

      const options = this.props.S3Params;

      options.files = [f];
      options.onProgress = options.onProgress || this.showProgress;
      options.onFinish = options.onFinish || this.onFinishUpload;
      options.onError = options.onError || this.onUploadError;

      options.signingUrlWithCredentials = true;

      // If you want to upload to a different bucket, pass a different signingURL and adjust params on the server!
      options.signingUrl = options.signingUrl || "/s3/sign";

      up[file.id] = { loading: true, percentage: 0, error: null, saved: false };
      file.loading = true;
      if (!this.uploadingFiles[file.id]) this.uploadingFiles[file.id] = new S3Upload(options);
    });
    this.setState({
      loading: true,
      uploading: up
    });
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
    this.setState({
      uploading: items,
      loading: l,
      allSaved: s
    });
  };

  deleteItem = item => {
    const fields = this.props[this.props.fieldName];
    const i = findIndex(fields, { id: item.id });
    delete fields[i];
    const compactFields = compact(fields);
    this.props.change(this.props.fieldName, compactFields);
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
        onCancel={
          isActive
            ? this.abortUpload.bind(this, item)
            : this.deleteItem.bind(this, item)
        }
      />
    );
  };

  render() {
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
      fileListItemRenderer, // handle rendering the file list items yourself (receive filelist and context) :)
      onFileSuccess = emptyPromise, //called each time a file is finished and before the file.loading gets set to false, needs to return a promise!
      onFieldSubmit = noop, //called when all files have successfully uploaded
      onRemove = noop, //called when a file has been selected to be removed
      onChange = noop, //this is almost always getting passed by redux-form, no need to pass this handler manually
      onFileClick, // called when a file link in the filelist is clicked
      dropzoneProps = {},
      overflowList,
      showFilesCount,
      S3Params // if this is defined we assume we want to upload to aws s3 (or minio)
    } = this.props;
    const self = this;
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
                    : {keepGoing: true, acceptedFiles};
                })
                .then(({keepGoing, acceptedFiles}) => {
                  if (!keepGoing) return;
                  if(this.props.S3Params){
                    // this is s3 upload
                    this.sendFiles(acceptedFiles);
                  }
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
                })
            }
          }}
          {...dropzoneProps}
        >
          {showFilesCount ? (
            <div className="tg-upload-file-list-counter">
              Files: {fileList ? fileList.length : 0}
            </div>
          ) : null}
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
                if (loading) {
                  icon = "repeat";
                } else if (error) {
                  icon = "error";
                } else {
                  icon = "saved";
                }
                return fileListItemRenderer ? (
                  fileListItemRenderer(file, self)
                ) : ( S3Params ? (
                  this.itemListRender(file,self)
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
                        className={
                          "tg-upload-file-list-item-close pt-icon-cross"
                        }
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
                )
              )
              })}
            </div>
          )}
      </div>
    );
  }
}

export default Uploader;