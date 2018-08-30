"use strict";

exports.__esModule = true;
exports.onEnterHelper = onEnterHelper;
exports.onBlurHelper = onBlurHelper;
exports.onEnterOrBlurHelper = onEnterOrBlurHelper;
function onEnterHelper(callback) {
  return {
    onKeyDown: function onKeyDown(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    }
  };
}

function onBlurHelper(callback) {
  return {
    onBlur: function onBlur(event) {
      callback(event);
    }
  };
}

function onEnterOrBlurHelper(callback) {
  return {
    onKeyDown: function onKeyDown(event) {
      if (event.key === "Enter") {
        callback(event);
      }
    },
    onBlur: function onBlur(event) {
      callback(event);
    }
  };
}