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
  constructor(props) {
    super(props);
    this.state = {
      inlineLabels: false
    };
  }
  render() {
    const { defaultSelectValue } = this.state || {};
    const { handleSubmit } = this.props;
    return (
      <Provider store={store}>
        <div className="form-components">
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          
################################################################################################
          <h4>Options</h4>
          <Switch
            checked={this.state.inlineLabels}
            label="Toggle Inline Labels"
            onChange={() => {
              this.setState({ inlineLabels: !this.state.inlineLabels });
            }}
          >
          <br/>
          <br/>
################################################################################################
            {" "}
          </Switch>
          <Uploader
            action={"docs.google.com/upload"}
            fileList={[
              {
                uid: 1, //you must set a unique id for this to work properly
                name: "yarn.lock",
                status: "error"
              }
            ]}
          />
          <RadioGroupField
            name={"radioGroup"}
            inlineLabel={this.state.inlineLabels}
            label={"Radio Group Input"}
            defaultValue={"true"}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={[
              {
                label: "Option 1",
                value: "true"
              },
              {
                label: "Option 2",
                value: ""
              }
            ]}
          />
          <NumericInputField
            secondaryLabel="(optional)"
            name={"numericInput"}
            inlineLabel={this.state.inlineLabels}
            label="Numeric Input"
            placeholder="0"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
          />
          <FileUploadField
            label="Upload component"
            onFieldSubmit={function(fileList) {
              console.info(
                "do something with the finished file list:",
                fileList
              );
            }}
            action={"//jsonplaceholder.typicode.com/posts/"}
            name={"uploadfield"}
            inlineLabel={this.state.inlineLabels}
          />
          <InputField
            name={"inputFieldWithDefaultValue"}
            inlineLabel={this.state.inlineLabels}
            label="Input With Default"
            defaultValue={"Default Value Here!"}
            placeholder="Enter input..."
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
          />
          <InputField
            name={"inputFieldWithTooltipError"}
            inlineLabel={this.state.inlineLabels}
            tooltipError
            tooltipProps={{
              position: Position.TOP
            }}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            label="Input"
            placeholder="Enter input..."
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={["hey", "you", "guys"]}
            name={"selectField"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple"
          />
          <InputField
            name={"inlineinputFieldWithTooltipError"}
            inlineLabel={this.state.inlineLabels}
            tooltipError
            tooltipProps={{
              position: Position.TOP
            }}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            label="Input with toolTip error with inlineLabel = true"
            placeholder="Enter input..."
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={["hey", "you", "guys"]}
            name={"inlineselectField"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple with inlineLabel = true"
          />
          {"<BPSelect onChange value /> component (not redux form connected):"}
          <BPSelect
            onChange={function(val) {
              console.info("on field submit!:", val);
            }}
            value="hey"
            inlineLabel
            options={["hey", "you", "guys"]}
            name={"inlineselectField"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple with inlineLabel = true"
          />
          {
            "<BPSelect onChange value /> component with className pt-minimal passed (not redux form connected):"
          }
          <BPSelect
            onChange={function(val) {
              console.info("on field submit!:", val);
            }}
            className="pt-minimal"
            value="hey"
            options={["hey", "you", "guys"]}
            name={"inlineselectField"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple with inlineLabel = true"
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={[1, 2, 4]}
            name={"selectFieldWithNumbers"}
            inlineLabel={this.state.inlineLabels}
            label="Select Simple with number values passed in simplified options obj"
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={["hey", "you", "guys"]}
            name={"selectFieldWithDefaultValue"}
            inlineLabel={this.state.inlineLabels}
            defaultValue={"you"}
            label="Select Simple with defaultValue"
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={["hey", "you", "guys"]}
            name={"selectFieldWithPlaceholderAndInitiallyUnsetDefault"}
            inlineLabel={this.state.inlineLabels}
            defaultValue={defaultSelectValue}
            placeholder="I'm just hanging out"
            label="Select Simple with initially unset defaultValue and a placeholder"
          />
          <Button
            text="Set default"
            onClick={() => {
              this.setState({ defaultSelectValue: "you" });
            }}
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"selectFieldWithPlaceholder"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            placeholder={"Please choose..."}
            label="Select Simple With Placeholder"
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"selectFieldWithUntouchedErrors"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            showErrorIfUntouched
            placeholder={"Please choose..."}
            label="Select With Untouched Errors"
          />
          <SelectField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={[
              {
                label: "hey",
                value: { tree: "trunk" }
              },
              {
                label: "there",
                value: "12312asd"
              },
              { label: "you", value: { tree: "graph" } },
              { label: "guys", value: { tree: "chart" } }
            ]}
            name={"selectFieldWithLabelAndValue"}
            inlineLabel={this.state.inlineLabels}
            label="Select with name and value, supporting json values"
          />
          <DateInputField
            name={"dateInputField"}
            inlineLabel={this.state.inlineLabels}
            label="Date Input"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            defaultValue={new Date()}
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 10))
            }
          />
          <DateRangeInputField
            name={"dateRangeInputField"}
            inlineLabel={this.state.inlineLabels}
            label="Date Range Input"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 1000))
            }
          />
          <CheckboxField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            defaultValue
            name={"checkboxField"}
            inlineLabel={this.state.inlineLabels}
            label="Checkbox"
          />
          <SwitchField
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            defaultValue
            name={"switchField"}
            inlineLabel={this.state.inlineLabels}
            label="I'm a SwitchField"
          />
          <TextareaField
            name={"textAreaField"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            label="Textarea"
            placeholder="Enter notes..."
          />
          <EditableTextField
            name={"editableTextField"}
            inlineLabel={this.state.inlineLabels}
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            label="Editable Text"
            placeholder="Enter new text..."
          />
          <ReactSelectField
            name="reactSelectField"
            inlineLabel={this.state.inlineLabels}
            label="Collaborators"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            options={[
              {
                label: "Rodrigo Pavez",
                value: { name: "Rodrigo Pavez", id: "123" }
              },
              { label: "Ximena Morales", value: "Ximena Morales" },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
            onChange={function(val) {
              console.info("val:", val);
            }}
          />
          <ReactSelectField
            name="reactSelectFieldMulti"
            inlineLabel={this.state.inlineLabels}
            label="Collaborators Multi"
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            multi
            options={[
              {
                label: "Rodrigo Pavez",
                value: { name: "Rodrigo Pavez", id: "123" }
              },
              { label: "Ximena Morales", value: "Ximena Morales" },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
            onChange={function(val) {
              console.info("val:", val);
            }}
          />
          <ReactSelectField
            async
            name="reactSelectFieldMultiAsync"
            inlineLabel={this.state.inlineLabels}
            label="React Select AsyncCollaborators"
            multi
            onFieldSubmit={function(val) {
              console.info("on field submit!:", val);
            }}
            loadOptions={getOptions}
          />
          <Button
            intent={Intent.SUCCESS}
            text="Submit Form"
            onClick={handleSubmit(function(formData) {
              console.info("formData:", formData);
            })}
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
