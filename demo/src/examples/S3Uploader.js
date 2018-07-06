const getOptions = function (input, callback) {
  setTimeout(function () {
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
      s3path: "uploads/",
    };

    return (
      <Provider store={store}>
        <div className="form-components">
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          <Uploader
            overflowList
            showFilesCount
            S3Params={S3Params}
            fileSaved={file=>{
              console.log("New file saved!");
              console.log(file);
            }}
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
