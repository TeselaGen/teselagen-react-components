var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import { InputGroup, Button, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { onEnterHelper } from "../utils/handlerHelpers";

var SearchBar = function SearchBar(_ref) {
  var reduxFormSearchInput = _ref.reduxFormSearchInput,
      setSearchTerm = _ref.setSearchTerm,
      maybeSpinner = _ref.maybeSpinner,
      disabled = _ref.disabled;

  return React.createElement(InputGroup, _extends({
    disabled: disabled,
    className: classNames(Classes.ROUND, "datatable-search-input"),
    placeholder: "Search..."
  }, reduxFormSearchInput.input, onEnterHelper(function (e) {
    e.preventDefault();
    setSearchTerm(reduxFormSearchInput.input.value);
  }), {
    rightElement: maybeSpinner || React.createElement(Button, {
      className: Classes.MINIMAL,
      icon: "search",
      onClick: function onClick() {
        setSearchTerm(reduxFormSearchInput.input.value);
      }
    })
  }));
};

export default SearchBar;