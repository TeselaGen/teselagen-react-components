import S3Download from "../../../src/utils/S3Download";
import magicDownload from "../../../src/DownloadLink/magicDownload";

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
      s3path: "uploads/"
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
            }}
            S3Params={S3Params}
            name={"uploadfield"}
          />
          <Button
            onClick={() => {
              S3Download("example.png").then(blob => {
                magicDownload(blob, `Downloadme.png`);
              });
            }}
            text="Download from s3 example"
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
