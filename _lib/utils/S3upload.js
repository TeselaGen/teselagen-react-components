"use strict";

exports.__esModule = true;

var _class, _temp, _initialiseProps;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var S3Upload = (_temp = _class = function S3Upload(options) {
  _classCallCheck(this, S3Upload);

  _initialiseProps.call(this);

  this.server = "";
  this.signingUrl = "";
  this.signingUrlMethod = "GET";
  this.successResponses = [200, 201];
  this.fileElement = null;
  this.files = null;
  this.fileId = null;
  this.bucket = null;

  if (options === null) {
    options = {};
  }
  for (var option in options) {
    if (options.hasOwnProperty(option)) {
      this[option] = options[option];
    }
  }
  var files = this.fileElement ? this.fileElement.files : this.files || [];
  this.handleFileSelect(files);
}, _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.onFinish = function (signResult, fileId) {
    return { signResult: signResult, fileId: fileId };
  };

  this.preprocess = function (file, next) {
    //console.("base.preprocess()", file);
    return next(file);
  };

  this.onProgress = function (e, fileId) {
    //return console.("base.onProgress()", e, fileId);
    return { e: e, fileId: fileId };
  };

  this.onError = function (status, fileId) {
    return { status: status, fileId: fileId };
  };

  this.onSignedUrl = function (result) {
    //return console.("base.onSignedUrl()", result);
    return result;
  };

  this.scrubFilename = function (filename) {
    return filename.replace(/[^\w\d_\-.]+/gi, "");
  };

  this.handleFileSelect = function (files) {
    var result = [];
    for (var _iterator = files, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var file = _ref;

      _this.preprocess(file, function (processedFile) {
        _this.onProgress(null, processedFile);
        result.push(_this.uploadFile(processedFile));
        return result;
      });
    }
  };

  this.createCORSRequest = function (method, url, opts) {
    var newOpts = opts || {};
    var xhr = new XMLHttpRequest();
    if (xhr.withCredentials !== null) {
      xhr.open(method, url, true);
      if (newOpts.withCredentials !== null) {
        xhr.withCredentials = newOpts.withCredentials;
      }
    } else if (typeof XDomainRequest !== "undefined") {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      xhr = null;
    }
    return xhr;
  };

  this.executeOnSignedUrl = function (file, callback) {
    var fileName = _this.scrubFilename(file.name);
    var queryString = "?objectName=" + fileName + "&contentType=" + encodeURIComponent(file.type);
    if (_this.s3path) {
      queryString += "&path=" + encodeURIComponent(_this.s3path);
    }
    if (_this.bucket) {
      queryString += "&bucket=" + encodeURIComponent(_this.bucket);
    }
    if (_this.signingUrlQueryParams) {
      var signingUrlQueryParams = typeof _this.signingUrlQueryParams === "function" ? _this.signingUrlQueryParams() : _this.signingUrlQueryParams;
      Object.keys(signingUrlQueryParams).forEach(function (key) {
        var val = signingUrlQueryParams[key];
        queryString += "&" + key + "=" + val;
      });
    }
    var xhr = _this.createCORSRequest(_this.signingUrlMethod, (_this.server || "/") + _this.signingUrl + queryString, { withCredentials: _this.signingUrlWithCredentials });
    if (_this.signingUrlHeaders) {
      var signingUrlHeaders = typeof _this.signingUrlHeaders === "function" ? _this.signingUrlHeaders() : _this.signingUrlHeaders;
      Object.keys(signingUrlHeaders).forEach(function (key) {
        var val = signingUrlHeaders[key];
        xhr.setRequestHeader(key, val);
      });
    }
    xhr.overrideMimeType && xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && _this.successResponses.includes(xhr.status)) {
        var result = void 0;
        try {
          result = JSON.parse(xhr.responseText);
          _this.onSignedUrl(result);
        } catch (error) {
          _this.onError("Invalid response from server", _this.fileId);
          return false;
        }
        return callback(result);
      } else if (xhr.readyState === 4 && !_this.successResponses.includes(xhr.status)) {
        return _this.onError("Could not contact request signing server. Status = " + xhr.status, _this.fileId);
      }
    };
    return xhr.send();
  };

  this.uploadToS3 = function (file, signResult) {
    var xhr = _this.createCORSRequest("PUT", signResult.signedUrl);
    if (!xhr) {
      _this.onError("CORS not supported", _this.fileId);
    } else {
      xhr.onload = function () {
        if (_this.successResponses.includes(xhr.status)) {
          return _this.onFinish(signResult, _this.fileId);
        } else {
          return _this.onError("Upload error: " + xhr.status, _this.fileId);
        }
      };
      xhr.onerror = function () {
        return _this.onError("Upload error", _this.fileId);
      };
      xhr.upload.onprogress = function (e) {
        return _this.onProgress(e, _this.fileId);
      };
    }
    xhr.setRequestHeader("Content-Type", file.type);
    if (_this.contentDisposition) {
      var disposition = _this.contentDisposition;
      if (disposition === "auto") {
        disposition = file.type.substr(0, 6) === "image/" ? "inline" : "attachment";
      }

      var fileName = _this.scrubFilename(file.name);
      xhr.setRequestHeader("Content-Disposition", disposition + "; filename=\"" + fileName + "\"");
    }
    if (signResult.headers) {
      var signResultHeaders = signResult.headers;
      Object.keys(signResultHeaders).forEach(function (key) {
        var val = signResultHeaders[key];
        xhr.setRequestHeader(key, val);
      });
    }
    if (_this.uploadRequestHeaders) {
      var uploadRequestHeaders = _this.uploadRequestHeaders;
      Object.keys(uploadRequestHeaders).forEach(function (key) {
        var val = uploadRequestHeaders[key];
        xhr.setRequestHeader(key, val);
      });
    } else {
      if (_this.public) xhr.setRequestHeader("x-amz-acl", "public-read");
    }
    _this.httprequest = xhr;
    return xhr.send(file);
  };

  this.uploadFile = function (file) {
    var uploadToS3Callback = _this.uploadToS3.bind(_this, file);
    if (_this.getSignedUrl) return _this.getSignedUrl(file, uploadToS3Callback);
    return _this.executeOnSignedUrl(file, uploadToS3Callback);
  };

  this.abortUpload = function () {
    _this.httprequest && _this.httprequest.abort();
  };
}, _temp);
exports.default = S3Upload;
module.exports = exports["default"];