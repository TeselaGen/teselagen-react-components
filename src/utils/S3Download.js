import axios from "axios";

const S3Download = request => {
  const url =
    (request.server || "/") +
    "/s3/sign/" +
    (request.s3path || "") +
    request.file;
  return axios
    .get(url)
    .then(res => res.data);
};

export default S3Download;
