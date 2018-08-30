"use strict";

exports.__esModule = true;
exports.default = basicHandleActionsWithFullState;
function basicHandleActionsWithFullState(handlers, defaultState) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];
    var fullState = arguments[2];
    var type = action.type;

    var handler = handlers[type];
    if (handler) {
      return handler(state, action, fullState);
    } else {
      return state;
    }
  };
}
module.exports = exports["default"];