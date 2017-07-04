// import each from 'lodash/each';
import {
  InputField,
  SelectField
  // FileUploadField,
  // AntFileUploadField,
  // DateInputField,
  // CheckboxField,
  // TextareaField,
  // EditableTextField,
  // NumericInputField,
  // RadioGroupField,
  // ReactSelectField,
} from "./index";
import React from "react";

// See README for discussion of chai, enzyme, and sinon
import { mount } from "enzyme";
// import sinon from 'sinon'

// In this file we're doing an integration test. Thus we need to hook up our
// form component to Redux and Redux-Form. To do that, we need to create the
// simplest redux store possible that will work with Redux-Form.
import { reducer as formReducer, reduxForm } from "redux-form";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

describe("form components", function() {
  it("InputField", function() {
    const FormContainer = reduxForm({
      form: "testForm",
      validate: function(values) {
        const errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function(argument) {
      return (
        <div>
          <InputField name="testField" />
        </div>
      );
    });

    const mountedForm = mount(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <FormContainer />
      </Provider>
    );

    const input = mountedForm.find("input").first();
    expect(input).toHaveLength(1);
    // Our form component only shows error messages (help text) if the
    // field has been touched. To mimic touching the field, we simulate a
    // blur event, which means the input's onBlur method will run, which
    // will call the onBlur method supplied by Redux-Form.
    input.simulate("blur");

    expect(input).toHaveLength(1);
    input.simulate("change", { target: { value: "testValue" } });
    const { value } = input.props();
    expect(value).toEqual("testValue");
  });
  const nestedJson = { my: "nestedJson" };
  it("SelectField functions as expected", function() {
    const FormContainer = reduxForm({
      form: "testForm",
      validate: function(values) {
        const errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function(argument) {
      return (
        <div>
          <SelectField
            defaultValue={"firstVal"}
            options={[
              { value: "firstVal", label: "firstLabel" },
              { value: "testValue", name: "myOpt1" },
              { value: nestedJson, name: "anotherValuename" }
            ]}
            name="testField"
          />
        </div>
      );
    });
    const store = createStore(combineReducers({ form: formReducer }));
    const mountedForm = mount(
      <Provider store={store}>
        <FormContainer />
      </Provider>
    );

    const input = mountedForm.find("select").first();
    expect(input).toHaveLength(1);
    // Our form component only shows error messages (help text) if the
    // field has been touched. To mimic touching the field, we simulate a
    // blur event, which means the input's onBlur method will run, which
    // will call the onBlur method supplied by Redux-Form.
    input.simulate("blur");
    expect(store.getState().form.testForm.values.testField).toEqual("firstVal");
    expect(input.props().value).toEqual("firstVal");

    expect(input).toHaveLength(1);
    input.simulate("change", { target: { value: "anotherValue" } });
    expect(store.getState().form.testForm.values.testField).toEqual(
      "anotherValue"
    );

    input.simulate("change", { target: { value: JSON.stringify(nestedJson) } });
    expect(store.getState().form.testForm.values.testField).toEqual(nestedJson);
  });
});
