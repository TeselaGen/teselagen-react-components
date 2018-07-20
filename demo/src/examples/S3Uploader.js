const getOptions = function(input, callback) {
  setTimeout(function() {
    callback(null, {
      options: [{ value: "one", label: "One" }, { value: "two", label: "Two" }],
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: true
    });
  }, 500);
};

class FormComponentsDemo extends React.Component {
  render() {
    const { defaultSelectValue } = this.state || {};
    const { handleSubmit } = this.props;

    const S3Params = {
      server: "http://localhost:3030", //optional
      s3path: "uploads/", //folder within the bucket
      bucket: "tg-lims-bucket" //a globally unique "bucket" that needs to be set up on amazon beforehand 
    };

    return (
      <Provider store={store}>
        <div className="form-components">
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          <FileUploadField
            label="Upload component"
            onFieldSubmit={function(fileList) {
              console.info(
                "do something with the finished file list:",
                fileList
              );

              this.setState({fileList})
            }}
            S3Params={S3Params}
            name={"uploadfield"}
          />
          <Button
            disabled={!(this.state.fileList && this.state.fileList.length )}
            onClick={() => {
              this.state.fileList.map(({info={}}) => {
                S3Download(
                  Object.assign(S3Params, { file: "folder/" + info.fileName })
                )
                  .then(blob => magicDownload(blob, "example.csv"))
                  .catch(error => console.log("file doesn't exist in server"));
              })
            }}
            text="Download file from S3"
          />
        </div>
      </Provider>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.inputField) {
    errors.inputField = "required";
  }
  if (!values.untouchedSelect) {
    errors.untouchedSelect = "required";
  }
  if (!values.inputFieldWithTooltipError) {
    errors.inputFieldWithTooltipError = "required";
  }
  if (values.dateInputField > new Date().setDate(new Date().getDate() + 10)) {
    errors.dateInputField = "date too big";
  }
  return errors;
};

const formWrapped = reduxForm({
  form: "demoForm",
  validate
})(FormComponentsDemo);

render(formWrapped);
