import React from "react";
import { ReactTableDefaults } from "react-table";
var LoadingComponent = ReactTableDefaults.LoadingComponent;


function DisabledLoadingComponent(_ref) {
  var disabled = _ref.disabled,
      loading = _ref.loading,
      loadingText = _ref.loadingText;

  return React.createElement(LoadingComponent, {
    className: disabled ? "disabled" : "",
    loading: loading,
    loadingText: disabled ? "" : loadingText
  });
}

export default DisabledLoadingComponent;