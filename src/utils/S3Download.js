import axios from "axios";

const signRequest = request => {
  const data = {};
  return axios
    .post("/s3/sign", data)
    .then(function(res) {
      console.log("Axios finished");
    })
    .catch(function(err) {
      console.log("Axios error");
    });
};

const S3Download = request => {
  signRequest(request).then(signedUrl =>
    axios
      .get(signedUrl)
      .then(function(res) {
        console.log(res);
        console.log("Axios finished");
        return res;
      })
      .catch(function(err) {
        console.log("Axios error");
      })
  );
};
export default S3Download;
