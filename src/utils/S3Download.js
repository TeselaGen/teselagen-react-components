import axios from "axios";

const S3Download = request => {
  const url =
    (request.server || "/") +
    "/s3/" +
    (request.s3path || "") +
    request.file +
    "?bucket=" +
    (request.bucket || "");
  return axios.get(url).then(res => {
    console.log("Supposde blob");
    console.log(res);
    console.log("==");
    console.log(res.data);
    return res.data
  });
};

export default S3Download;
