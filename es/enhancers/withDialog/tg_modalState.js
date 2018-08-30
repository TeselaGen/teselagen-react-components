var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import cloneDeep from "lodash/cloneDeep";
import { omit } from "lodash";
export default function tg_modalState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref = arguments[1];
  var type = _ref.type,
      name = _ref.name,
      uniqueName = _ref.uniqueName,
      _ref$props = _ref.props,
      props = _ref$props === undefined ? {} : _ref$props;

  var existingModalState = state[name] || {};

  var _existingModalState$_ = existingModalState.__registeredAs,
      __registeredAs = _existingModalState$_ === undefined ? {} : _existingModalState$_;

  if (type === "TG_REGISTER_MODAL") {
    var _extends2, _extends3;

    return _extends({}, state, (_extends3 = {}, _extends3[name] = _extends({}, existingModalState, {
      __registeredAs: _extends({}, __registeredAs, (_extends2 = {}, _extends2[uniqueName] = true, _extends2))
    }), _extends3));
  }
  if (type === "TG_UNREGISTER_MODAL") {
    var _extends4;

    return _extends({}, state, (_extends4 = {}, _extends4[name] = _extends({}, existingModalState, {
      __registeredAs: omit(__registeredAs, uniqueName)
    }), _extends4));
  }
  if (type === "TG_SHOW_MODAL") {
    var _extends5;

    return _extends({}, state, (_extends5 = {}, _extends5[name] = _extends({}, existingModalState, props, {
      open: true
    }), _extends5));
  }
  if (type === "TG_HIDE_MODAL") {
    var _extends6;

    return _extends({}, state, (_extends6 = {}, _extends6[name] = {
      __registeredAs: existingModalState.__registeredAs,
      open: false
    }, _extends6));
  }
  return state;
}