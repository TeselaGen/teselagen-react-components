"use strict";

exports.__esModule = true;

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var S3Download = function S3Download(request) {
  var url = (request.server || "/") + "/s3/" + (request.s3path || "") + request.file + "?bucket=" + (request.bucket || "");
  return _axios2.default.get(url, { responseType: "blob" }).then(function (res) {
    return res.data;
  });
};

exports.default = S3Download;
module.exports = exports["default"];