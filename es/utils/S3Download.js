import axios from "axios";

var S3Download = function S3Download(request) {
  var url = (request.server || "/") + "/s3/" + (request.s3path || "") + request.file + "?bucket=" + (request.bucket || "");
  return axios.get(url, { responseType: "blob" }).then(function (res) {
    return res.data;
  });
};

export default S3Download;