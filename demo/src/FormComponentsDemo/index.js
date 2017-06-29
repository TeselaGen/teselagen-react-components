import enUS from 'antd/lib/locale-provider/en_US';
import LocaleProvider from 'antd/lib/locale-provider';
import React from "react";
import { reduxForm } from "redux-form";

import {
  InputField,
  SelectField,
  ReactSelectField,
  DateInputField,
  CheckboxField,
  TextareaField,
  EditableTextField,
  NumericInputField,
  RadioGroupField,
  FileUploadField,
  AntFileUploadField,
  onEnterOrBlurHelper
} from "../../../src";
import "./style.css";
import "antd/lib/upload/style/index.css";
import "antd/lib/transfer/style/css";
import "antd/lib/transfer/style/css";
import 'antd/lib/tooltip/style/css';


import { Provider } from "react-redux";
import store from "../store";
import { Position, Button, Intent } from "@blueprintjs/core";
var getOptions = function(input, callback) {
  setTimeout(function() {
    callback(null, {
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: true
    });
  }, 500);
};



class FormComponentsDemo extends React.Component {
  
  render() {
    const {defaultSelectValue} = this.state || {}
    const {handleSubmit} = this.props
    return (<LocaleProvider locale={enUS}>
      
      <Provider store={store}>
        <div>
          <h3 className="form-component-title">
            Blueprint Redux Form Components
          </h3>
          <RadioGroupField
            name={"fieldnumber0"}
            label={"Radio Group Input"}
            defaultValue={"false"}
            options={[
              {
                label: "Option 1",
                value: "true"
              },
              {
                label: "Option 2",
                value: "false"
              }
            ]}
          />
          <NumericInputField
            name={"fieldnumber1"}
            label="Numeric Input"
            placeholder="0"
          />
          <FileUploadField 

            name={"fieldnumber1a"} 
            label="File Input" 
          />
          
          <AntFileUploadField 

          label='AntD upload component'
          onUploadFinished={function (fileList) {
              console.log('do something with the finished file list:', fileList)
            }} 
          multiple
          // accept={[".json"]} 
          // innerIcon={<span></span>} //icon override
          // innerText='some text override'
          action={"//jsonplaceholder.typicode.com/posts/"} 
          name={"uploadfield"}  />

          <AntFileUploadField 
          className={'myspecialclassname'}
          label='AntD upload component with hidden drop target after upload'
          onUploadFinished={function (fileList) {
              console.log('do something with the finished file list:', fileList)
            }} 
          multiple
          hideDropAfterUpload
          // accept={[".json"]} 
          // innerIcon={<span></span>} //icon override
          // innerText='some text override'
          action={"//jsonplaceholder.typicode.com/posts/"} 
          name={"uploadfieldwithhiddendroptargetafterupload"}  />

          <AntFileUploadField 
          label='AntD upload component with default value set!'
          onUploadFinished={function (fileList) {
              console.log('do something with the finished file list:', fileList)
            }}
          multiple
          defaultValue={[{
            uid: 1, //you must set a unique id for this to work properly
            name: "yarn.lock",
            status: "error",
          }]}
          // accept={[".json"]} 
          // innerIcon={<span></span>} //icon override
          // innerText='some text override'
          action={"//jsonplaceholder.typicode.com/posts/"} 
          name={"uploadfieldwithdefault"}  />
          <InputField
            name={"inputField"}
            label="Input"
            placeholder="Enter input..."
            {...onEnterOrBlurHelper(function(argument) {
              console.log("onEnter/Blur hit");
            })}
          />
          <InputField
            name={"inputField2"}
            label="Input With Default"
            defaultValue={'Default Value Here!'}
            placeholder="Enter input..."
            {...onEnterOrBlurHelper(function(argument) {
              console.log("onEnter/Blur hit");
            })}
          />
          <InputField
            name={"inputFieldWithTooltipError"}
            tooltipError
            tooltipProps={{
              position: Position.TOP
            }}
            label="Input"
            placeholder="Enter input..."
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3.1"}
            label="Select Simple"
          />
          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3agag.2"}
            defaultValue={"you"}
            label="Select Simple with defaultValue"
          />

          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3aa.3"}
            defaultValue={defaultSelectValue}
            placeholder="I'm just hanging out"
            label="Select Simple with initially unset defaultValue and a placeholder"
          />
          <Button text="Set default" onClick={()=>{
            this.setState({defaultSelectValue: "you"})
          }}>

          </Button>
          <SelectField
            options={["hey", "you", "guys"]}
            name={"fieldnumber3asdfg"}
            placeholder={"Please choose..."}
            label="Select Simple With Placeholder"
          />
          <SelectField
            onChange={function () {
              console.log('arguments:', arguments)
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
            name={"fieldnumber3baa"}
            label="Select with name and value"
          />
          <DateInputField
            name={"fieldnumber5"}
            label="Date Input"
            minDate={new Date()}
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 10))
            }
          />
          <CheckboxField name={"fieldnumber6"} label="Checkbox" />
          <TextareaField
            name={"fieldnumber7"}
            label="Textarea"
            placeholder="Enter notes..."
          />
          <EditableTextField
            name={"fieldnumber8"}
            {...onEnterOrBlurHelper(function(argument) {
              console.log("onEnter/Blur hit");
            })}
            label="Editable Text"
            placeholder="Enter new text..."
          />
          <ReactSelectField
            name="collaborators"
            label="Collaborators"
            onChange={function (val) {
              console.log('val:', val)
            }}
            options={[
              { label: "Rodrigo Pavez", value: "Rodrigo Pavez" },
              { label: "Ximena Morales", value: "Ximena Morales" },
              { label: "Kyle Craft", value: "Kyle Craft" },
              { label: "Sam Denicola", value: "Sam Denicola" },
              { label: "Tom Ogasawara", value: "Tom Ogasawara" }
            ]}
          />
          <ReactSelectField
            async
            name="collaborators2"
            label="React Select AsyncCollaborators"
            multi
            onChange={function (val) {
              console.log('val:', val)
            }}
            loadOptions={getOptions}
          />
          <Button intent={Intent.SUCCESS} text="Submit Form" onClick={handleSubmit(function (formData) {
            console.log('formData:', formData)
          })}>
          </Button>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
      </Provider>
      
    </LocaleProvider>);
  }
}

const validate = values => {
  const errors = {};
  if (!values.inputField) {
    errors.inputField = "required";
  }
  if (!values.inputFieldWithTooltipError) {
    errors.inputFieldWithTooltipError = "required";
  }
  return errors;
};

export default reduxForm({
  form: "demoForm",
  validate
})(FormComponentsDemo);
