class S3Upload {
  constructor(options) {
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
    for (const option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }
    const files = this.fileElement ? this.fileElement.files : this.files || [];
    this.handleFileSelect(files);
  }

  onFinish = (signResult, fileId) => {
    return { signResult, fileId };
  };

  preprocess = (file, next) => {
    //console.("base.preprocess()", file);
    return next(file);
  };

  onProgress = (e, fileId) => {
    //return console.("base.onProgress()", e, fileId);
    return { e, fileId };
  };

  onError = (status, fileId) => {
    return { status, fileId };
  };

  onSignedUrl = result => {
    //return console.("base.onSignedUrl()", result);
    return result;
  };

  scrubFilename = filename => {
    return filename.replace(/[^\w\d_\-.]+/gi, "");
  };

  handleFileSelect = files => {
    const result = [];
    for (const file of files) {
      this.preprocess(file, processedFile => {
        this.onProgress(null, processedFile);
        result.push(this.uploadFile(processedFile));
        return result;
      });
    }
  };

  createCORSRequest = (method, url, opts) => {
    const newOpts = opts || {};
    let xhr = new XMLHttpRequest();
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

  executeOnSignedUrl = (file, callback) => {
    const fileName = this.scrubFilename(file.name);
    let queryString = `?objectName=${fileName}&contentType=${encodeURIComponent(
      file.type
    )}`;
    if (this.s3path) {
      queryString += `&path=${encodeURIComponent(this.s3path)}`;
    }
    if (this.bucket) {
      queryString += `&bucket=${encodeURIComponent(this.bucket)}`;
    }
    if (this.signingUrlQueryParams) {
      const signingUrlQueryParams =
        typeof this.signingUrlQueryParams === "function"
          ? this.signingUrlQueryParams()
          : this.signingUrlQueryParams;
      Object.keys(signingUrlQueryParams).forEach(key => {
        const val = signingUrlQueryParams[key];
        queryString += `&${key}=${val}`;
      });
    }
    const xhr = this.createCORSRequest(
      this.signingUrlMethod,
      (this.server || "/") + this.signingUrl + queryString,
      { withCredentials: this.signingUrlWithCredentials }
    );
    if (this.signingUrlHeaders) {
      const signingUrlHeaders =
        typeof this.signingUrlHeaders === "function"
          ? this.signingUrlHeaders()
          : this.signingUrlHeaders;
      Object.keys(signingUrlHeaders).forEach(key => {
        const val = signingUrlHeaders[key];
        xhr.setRequestHeader(key, val);
      });
    }
    xhr.overrideMimeType &&
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && this.successResponses.includes(xhr.status)) {
        let result;
        try {
          result = JSON.parse(xhr.responseText);
          this.onSignedUrl(result);
        } catch (error) {
          this.onError("Invalid response from server", this.fileId);
          return false;
        }
        return callback(result);
      } else if (
        xhr.readyState === 4 &&
        !this.successResponses.includes(xhr.status)
      ) {
        return this.onError(
          `Could not contact request signing server. Status = ${xhr.status}`,
          this.fileId
        );
      }
    };
    return xhr.send();
  };

  uploadToS3 = (file, signResult) => {
    const xhr = this.createCORSRequest("PUT", signResult.signedUrl);
    if (!xhr) {
      this.onError("CORS not supported", this.fileId);
    } else {
      xhr.onload = () => {
        if (this.successResponses.includes(xhr.status)) {
          return this.onFinish(signResult, this.fileId);
        } else {
          return this.onError(`Upload error: ${xhr.status}`, this.fileId);
        }
      };
      xhr.onerror = () => this.onError("Upload error", this.fileId);
      xhr.upload.onprogress = e => this.onProgress(e, this.fileId);
    }
    xhr.setRequestHeader("Content-Type", file.type);
    if (this.contentDisposition) {
      let disposition = this.contentDisposition;
      if (disposition === "auto") {
        disposition =
          file.type.substr(0, 6) === "image/" ? "inline" : "attachment";
      }

      const fileName = this.scrubFilename(file.name);
      xhr.setRequestHeader(
        "Content-Disposition",
        `${disposition}; filename="${fileName}"`
      );
    }
    if (signResult.headers) {
      const signResultHeaders = signResult.headers;
      Object.keys(signResultHeaders).forEach(key => {
        const val = signResultHeaders[key];
        xhr.setRequestHeader(key, val);
      });
    }
    if (this.uploadRequestHeaders) {
      const uploadRequestHeaders = this.uploadRequestHeaders;
      Object.keys(uploadRequestHeaders).forEach(key => {
        const val = uploadRequestHeaders[key];
        xhr.setRequestHeader(key, val);
      });
    } else {
      if (this.public) xhr.setRequestHeader("x-amz-acl", "public-read");
    }
    this.httprequest = xhr;
    return xhr.send(file);
  };

  uploadFile = file => {
    const uploadToS3Callback = this.uploadToS3.bind(this, file);
    if (this.getSignedUrl) return this.getSignedUrl(file, uploadToS3Callback);
    return this.executeOnSignedUrl(file, uploadToS3Callback);
  };

  abortUpload = () => {
    this.httprequest && this.httprequest.abort();
  };
}

export default S3Upload;
