// import each from 'lodash/each';
import { InputField, SelectField,
// FileUploadField,
// AntFileUploadField,
// DateInputField,
// CheckboxField,
// TextareaField,
// EditableTextField,
NumericInputField
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

describe("form components", function () {
  it("InputField", function () {
    var FormContainer = reduxForm({
      form: "testForm",
      validate: function validate(values) {
        var errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function (argument) {
      return React.createElement(
        "div",
        null,
        React.createElement(InputField, { name: "testField" })
      );
    });

    var mountedForm = mount(React.createElement(
      Provider,
      { store: createStore(combineReducers({ form: formReducer })) },
      React.createElement(FormContainer, null)
    ));

    var input = mountedForm.find("input").first();
    expect(input).toHaveLength(1);
    // Our form component only shows error messages (help text) if the
    // field has been touched. To mimic touching the field, we simulate a
    // blur event, which means the input's onBlur method will run, which
    // will call the onBlur method supplied by Redux-Form.
    input.simulate("blur");

    expect(input).toHaveLength(1);
    input.simulate("change", { target: { value: "testValue" } });

    var _input$props = input.props(),
        value = _input$props.value;

    expect(value).toEqual("testValue");
  });
  var nestedJson = { my: "nestedJson" };

  it("NumericInputField functions as expected", function () {
    var FormContainer = reduxForm({
      form: "testForm",
      validate: function validate(values) {
        var errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function (argument) {
      return React.createElement(
        "div",
        null,
        React.createElement(NumericInputField, { name: "testField" }),
        " // defaultValue=",
        1
      );
    });
    var store = createStore(combineReducers({ form: formReducer }));
    var mountedForm = mount(React.createElement(
      Provider,
      { store: store },
      React.createElement(FormContainer, null)
    ));

    var input = mountedForm.find("input").first();
    expect(input).toHaveLength(1);
    // Our form component only shows error messages (help text) if the
    // field has been touched. To mimic touching the field, we simulate a
    // blur event, which means the input's onBlur method will run, which
    // will call the onBlur method supplied by Redux-Form.
    input.simulate("blur");
    var errorTextContainer = mountedForm.find(".tg-field-error-holder");
    expect(errorTextContainer).toHaveLength(1);

    expect(input).toHaveLength(1);
    input.simulate("change", { target: { value: "2" } });
    expect(store.getState().form.testForm.values.testField).toEqual("2");

    input.simulate("change", { target: { value: "-2" } });
    expect(store.getState().form.testForm.values.testField).toEqual("-2");

    input.simulate("change", { target: { value: "ab" } });
    expect(store.getState().form.testForm.values.testField).toEqual("ab");
    input.simulate("blur", { target: { value: "ab" } });
    mountedForm.find(".tg-field-error-holder");
    expect(errorTextContainer).toHaveLength(1);
  });

  it("SelectField functions as expected", function () {
    var FormContainer = reduxForm({
      form: "testForm",
      validate: function validate(values) {
        var errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function (argument) {
      return React.createElement(
        "div",
        null,
        React.createElement(SelectField, {
          defaultValue: "firstVal",
          options: [{ value: "firstVal", label: "firstLabel" }, { value: "testValue", name: "myOpt1" }, { value: nestedJson, name: "anotherValuename" }],
          name: "testField"
        })
      );
    });
    var store = createStore(combineReducers({ form: formReducer }));
    var mountedForm = mount(React.createElement(
      Provider,
      { store: store },
      React.createElement(FormContainer, null)
    ));

    var input = mountedForm.find("select").first();
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
    expect(store.getState().form.testForm.values.testField).toEqual("anotherValue");

    input.simulate("change", { target: { value: JSON.stringify(nestedJson) } });
    expect(store.getState().form.testForm.values.testField).toEqual(nestedJson);
  });
});