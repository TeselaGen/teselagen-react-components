"use strict";

exports.__esModule = true;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _core = require("@blueprintjs/core");

var _reactDropzone = require("react-dropzone");

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _uniqid = require("uniqid");

var _uniqid2 = _interopRequireDefault(_uniqid);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require("lodash");

var _itemUpload = require("./itemUpload");

var _itemUpload2 = _interopRequireDefault(_itemUpload);

var _S3upload = require("../utils/S3upload");

var _S3upload2 = _interopRequireDefault(_S3upload);

var _v = require("uuid/v4");

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { first } from "lodash";


function noop() {}
// wink wink
var emptyPromise = Promise.resolve.bind(Promise);

var Uploader = function (_Component) {
  _inherits(Uploader, _Component);

  function Uploader(props) {
    var _this2 = this;

    _classCallCheck(this, Uploader);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.showProgress = function (progressEvent, fileId) {
      if (progressEvent) {
        var percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
        var up = _this.state.uploading;
        up[fileId] = (0, _lodash.merge)(up[fileId], {
          percentage: percentCompleted,
          loading: true,
          saved: false,
          error: null
        });
        _this.setState({
          uploading: up
        });
      }
    };

    _this.onFinishUpload = function (saved, fileId) {
      var up = _this.state.uploading;
      up[fileId] = (0, _lodash.merge)(up[fileId], {
        percentage: 100,
        loading: false,
        saved: true,
        error: null,
        info: saved,
        path: saved.publicUrl
      });
      _this.props.fileFinished && _this.props.fileFinished(saved, fileId);
      _this.checkLoadings(up);
    };

    _this.onUploadError = function (e, fileId) {
      var up = _this.state.uploading;
      up[fileId] = (0, _lodash.merge)(up[fileId], {
        percentage: 0,
        loading: false,
        saved: false,
        error: JSON.stringify(e)
      });
      _this.checkLoadings(up);
    };

    _this.sendFiles = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(files) {
        var up;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                up = _this.state.uploading;

                files.forEach(function (file) {
                  var f = new File([file.originFileObj], (0, _v2.default)(), {
                    type: file.originFileObj.type,
                    id: file.id
                  });
                  var options = _this.props.S3Params;
                  options.files = [f];
                  options.fileId = file.id;
                  options.onProgress = options.onProgress || _this.showProgress;
                  options.onFinish = options.onFinish || _this.onFinishUpload;
                  options.onError = options.onError || _this.onUploadError;

                  options.signingUrlWithCredentials = true;

                  // If you want to upload to a different bucket, pass a different signingURL and adjust params on the server!
                  options.signingUrl = options.signingUrl || "/s3/sign";

                  if (!_this.uploadingFiles[file.id]) {
                    up[file.id] = {
                      loading: true,
                      percentage: 0,
                      error: null,
                      saved: false,
                      originalFileName: file.name
                    };
                    file.loading = true;
                    _this.uploadingFiles[file.id] = new _S3upload2.default(options);
                  }
                });
                _this.setState({
                  loading: true,
                  uploading: up
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.abortUpload = function (item) {
      _this.uploadingFiles[item.id].abortUpload();
      var up = _this.state.uploading;
      up[item.id] = {
        percentage: 0,
        loading: false,
        saved: false,
        error: "Upload aborted"
      };
      _this.checkLoadings(up);
    };

    _this.abortAllUploads = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _lodash.forEach)(_this.uploadingFiles, function (item) {
                return item.abortUpload();
              });

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }));

    _this.checkLoadings = function (items) {
      var m = (0, _lodash.map)(items, function (item) {
        return item;
      });
      var l = (0, _lodash.some)(m, { loading: true });
      var s = (0, _lodash.every)(m, { saved: true });
      if (s || !l) _this.props.onFieldSubmit(Object.values(items));
      _this.setState({
        uploading: items,
        loading: l,
        allSaved: s
      });
    };

    _this.deleteItem = function (item) {
      var fields = _this.props.fileList;
      if (!fields) {
        console.error("Can't delete item");
        return;
      }
      var i = (0, _lodash.findIndex)(fields, { id: item.id });
      delete fields[i];
      //we need to compact array to avoid empty fields
      var compactFields = (0, _lodash.compact)(fields);
      _this.props.onChange(compactFields);
    };

    _this.itemListRender = function (item) {
      var isActive = false;
      var value = 0;
      var error = null;
      var saved = false;
      var fileUpload = _this.state.uploading[item.id];

      if (fileUpload) {
        isActive = fileUpload.loading;
        value = fileUpload.percentage;
        error = fileUpload.error;
        saved = fileUpload.saved;
      }

      return _react2.default.createElement(_itemUpload2.default, {
        key: item.id,
        item: item,
        active: isActive,
        value: value,
        error: error,
        saved: saved,
        onClick: function onClick(file) {
          console.log("Try download file");
          console.log(file);
        },
        onCancel: isActive ? _this.abortUpload.bind(_this, item) : _this.deleteItem.bind(_this, item)
      });
    };

    _this.uploadingFiles = {};
    _this.state = {
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
    return _this;
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

  Uploader.prototype.render = function render() {
    var _this3 = this;

    var _props = this.props,
        accept = _props.accept,
        contentOverride = _props.contentOverride,
        innerIcon = _props.innerIcon,
        innerText = _props.innerText,
        action = _props.action,
        _props$className = _props.className,
        className = _props$className === undefined ? "" : _props$className,
        fileLimit = _props.fileLimit,
        readBeforeUpload = _props.readBeforeUpload,
        uploadInBulk = _props.uploadInBulk,
        _props$showUploadList = _props.showUploadList,
        showUploadList = _props$showUploadList === undefined ? true : _props$showUploadList,
        beforeUpload = _props.beforeUpload,
        fileList = _props.fileList,
        fileListItemRenderer = _props.fileListItemRenderer,
        _props$onFileSuccess = _props.onFileSuccess,
        onFileSuccess = _props$onFileSuccess === undefined ? emptyPromise : _props$onFileSuccess,
        _props$onFieldSubmit = _props.onFieldSubmit,
        onFieldSubmit = _props$onFieldSubmit === undefined ? noop : _props$onFieldSubmit,
        _props$fileFinished = _props.fileFinished,
        fileFinished = _props$fileFinished === undefined ? noop : _props$fileFinished,
        _props$onRemove = _props.onRemove,
        onRemove = _props$onRemove === undefined ? noop : _props$onRemove,
        _props$onChange = _props.onChange,
        onChange = _props$onChange === undefined ? noop : _props$onChange,
        onFileClick = _props.onFileClick,
        _props$dropzoneProps = _props.dropzoneProps,
        dropzoneProps = _props$dropzoneProps === undefined ? {} : _props$dropzoneProps,
        overflowList = _props.overflowList,
        showFilesCount = _props.showFilesCount,
        S3Params = _props.S3Params;

    var self = this;
    var acceptToUse = Array.isArray(accept) ? accept.join(", ") : accept;
    var fileListToUse = fileList ? fileList : [];
    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        _reactDropzone2.default,
        _extends({
          className: "tg-dropzone " + className,
          multiple: fileLimit !== 1,
          activeClassName: "tg-dropzone-active",
          rejectClassName: "tg-dropzone-reject",
          acceptClassName: "tg-dropzone-accept",
          disabledClassName: "tg-dropzone-disabled",
          accept: acceptToUse
        }, {
          onDrop: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(acceptedFiles) {
              var cleanedFileList, keepGoing, responses;
              return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      if (fileLimit) {
                        acceptedFiles = acceptedFiles.slice(0, fileLimit);
                      }
                      acceptedFiles.forEach(function (file) {
                        file.loading = true;
                        if (!file.id) {
                          file.id = (0, _uniqid2.default)();
                        }
                      });

                      if (!readBeforeUpload) {
                        _context3.next = 6;
                        break;
                      }

                      _context3.next = 5;
                      return Promise.all(acceptedFiles.map(function (file) {
                        return new Promise(function (resolve, reject) {
                          var reader = new FileReader();
                          reader.readAsText(file, "UTF-8");
                          reader.onload = function (evt) {
                            file.parsedString = evt.target.result;
                            resolve(file);
                          };
                          reader.onerror = function (err) {
                            console.error("err:", err);
                            reject(err);
                          };
                        });
                      }));

                    case 5:
                      acceptedFiles = _context3.sent;

                    case 6:
                      cleanedFileList = [].concat(acceptedFiles.map(function (file) {
                        return _extends({
                          originFileObj: file,
                          originalFileObj: file,
                          id: file.id,
                          lastModified: file.lastModified,
                          lastModifiedDate: file.lastModifiedDate,
                          loading: file.loading,
                          name: file.name,
                          preview: file.preview,
                          size: file.size,
                          type: file.type
                        }, file.parsedString ? { parsedString: file.parsedString } : {});
                      }), fileListToUse).slice(0, fileLimit ? fileLimit : undefined);


                      onChange(cleanedFileList);

                      if (!beforeUpload) {
                        _context3.next = 14;
                        break;
                      }

                      _context3.next = 11;
                      return beforeUpload(cleanedFileList, onChange);

                    case 11:
                      _context3.t0 = _context3.sent;
                      _context3.next = 15;
                      break;

                    case 14:
                      _context3.t0 = true;

                    case 15:
                      keepGoing = _context3.t0;

                      if (keepGoing) {
                        _context3.next = 18;
                        break;
                      }

                      return _context3.abrupt("return");

                    case 18:
                      if (!S3Params) {
                        _context3.next = 20;
                        break;
                      }

                      return _context3.abrupt("return", _this3.sendFiles(cleanedFileList));

                    case 20:
                      if (!action) {
                        _context3.next = 30;
                        break;
                      }

                      if (!uploadInBulk) {
                        _context3.next = 24;
                        break;
                      }

                      _context3.next = 28;
                      break;

                    case 24:
                      responses = [];
                      _context3.next = 27;
                      return Promise.all(acceptedFiles.map(function (fileToUpload) {
                        var data = new FormData();
                        data.append("file", fileToUpload);

                        return _axios2.default.post(action, data).then(function (res) {
                          responses.push(res.data && res.data[0]);
                          onFileSuccess(res.data[0]).then(function () {
                            onChange(fileListToUse = fileListToUse.map(function (file) {
                              var fileToReturn = _extends({}, file);
                              if (fileToReturn.id === fileToUpload.id) {
                                fileToReturn.loading = false;
                              }
                              return fileToReturn;
                            }));
                          });
                        }).catch(function (err) {
                          console.error("Error uploading file:", err);
                          responses.push(_extends({}, fileToUpload, {
                            error: err && err.msg ? err.msg : err
                          }));
                          onChange(fileListToUse = fileListToUse.map(function (file) {
                            var fileToReturn = _extends({}, file);
                            if (fileToReturn.id === fileToUpload.id) {
                              fileToReturn.loading = false;
                              fileToReturn.error = true;
                            }
                            return fileToReturn;
                          }));
                        });
                      }));

                    case 27:
                      onFieldSubmit(responses);

                    case 28:
                      _context3.next = 31;
                      break;

                    case 30:
                      onChange(cleanedFileList.map(function (file) {
                        return _extends({}, file, {
                          loading: false
                        });
                      }));

                    case 31:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3, _this3);
            }));

            return function onDrop(_x2) {
              return _ref3.apply(this, arguments);
            };
          }()
        }, dropzoneProps),
        showFilesCount ? _react2.default.createElement(
          "div",
          { className: "tg-upload-file-list-counter" },
          "Files: ",
          fileList ? fileList.length : 0
        ) : null,
        contentOverride || _react2.default.createElement(
          "div",
          {
            title: acceptToUse ? "Accepts only the following file types: " + acceptToUse : "Accepts any file input",
            className: "tg-upload-inner"
          },
          innerIcon || _react2.default.createElement(_core.Icon, { icon: "upload", iconSize: 30 }),
          innerText || "Click or drag to upload"
        )
      ),
      fileList && showUploadList && !!fileList.length && _react2.default.createElement(
        "div",
        {
          className: overflowList ? "tg-upload-file-list-item-overflow" : null
        },
        fileList.map(function (file, index) {
          var loading = file.loading,
              error = file.error,
              name = file.name,
              originalName = file.originalName,
              url = file.url,
              downloadName = file.downloadName;

          var icon = void 0;
          if (loading) {
            icon = "repeat";
          } else if (error) {
            icon = "error";
          } else {
            icon = "saved";
          }
          return fileListItemRenderer ? fileListItemRenderer(file, self) : S3Params ? _this3.itemListRender(file, self) : _react2.default.createElement(
            "div",
            { key: index, className: "tg-upload-file-list-item" },
            _react2.default.createElement(
              "div",
              null,
              _react2.default.createElement(_core.Icon, {
                className: (0, _classnames2.default)({
                  "tg-spin": loading
                }),
                icon: icon
              }),
              _react2.default.createElement(
                "a",
                _extends({
                  name: name || originalName
                }, url && !onFileClick ? { href: url } : {}, {
                  /* eslint-disable react/jsx-no-bind*/
                  onClick: function onClick() {
                    return onFileClick && onFileClick(file);
                  }
                  /* eslint-enable react/jsx-no-bind*/
                }, downloadName ? { download: downloadName } : {}),
                " ",
                name || originalName,
                " "
              )
            ),
            !loading && _react2.default.createElement(
              "div",
              {
                onClick: function onClick() {
                  onRemove(file, index, fileList);
                  onChange(fileList.filter(function (file, index2) {
                    return index2 !== index;
                  }));
                }
              },
              _react2.default.createElement(_core.Icon, {
                iconSize: 16,
                icon: "cross",
                className: "tg-upload-file-list-item-close"
              })
            )
          );
        })
      )
    );
  };

  return Uploader;
}(_react.Component);

exports.default = Uploader;
module.exports = exports["default"];