"use strict";

var _index = require("./index");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _enzyme = require("enzyme");

var _reduxForm = require("redux-form");

var _redux = require("redux");

var _reactRedux = require("react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// See README for discussion of chai, enzyme, and sinon
// import each from 'lodash/each';
describe("form components", function () {
  it("InputField", function () {
    var FormContainer = (0, _reduxForm.reduxForm)({
      form: "testForm",
      validate: function validate(values) {
        var errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function (argument) {
      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_index.InputField, { name: "testField" })
      );
    });

    var mountedForm = (0, _enzyme.mount)(_react2.default.createElement(
      _reactRedux.Provider,
      { store: (0, _redux.createStore)((0, _redux.combineReducers)({ form: _reduxForm.reducer })) },
      _react2.default.createElement(FormContainer, null)
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
    var FormContainer = (0, _reduxForm.reduxForm)({
      form: "testForm",
      validate: function validate(values) {
        var errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function (argument) {
      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_index.NumericInputField, { name: "testField" }),
        " // defaultValue=",
        1
      );
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({ form: _reduxForm.reducer }));
    var mountedForm = (0, _enzyme.mount)(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(FormContainer, null)
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
    var FormContainer = (0, _reduxForm.reduxForm)({
      form: "testForm",
      validate: function validate(values) {
        var errors = {};
        if (!values.testField) {
          errors.testField = "Required";
        }
        return errors;
      }
    })(function (argument) {
      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_index.SelectField, {
          defaultValue: "firstVal",
          options: [{ value: "firstVal", label: "firstLabel" }, { value: "testValue", name: "myOpt1" }, { value: nestedJson, name: "anotherValuename" }],
          name: "testField"
        })
      );
    });
    var store = (0, _redux.createStore)((0, _redux.combineReducers)({ form: _reduxForm.reducer }));
    var mountedForm = (0, _enzyme.mount)(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(FormContainer, null)
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
// import sinon from 'sinon'

// In this file we're doing an integration test. Thus we need to hook up our
// form component to Redux and Redux-Form. To do that, we need to create the
// simplest redux store possible that will work with Redux-Form.