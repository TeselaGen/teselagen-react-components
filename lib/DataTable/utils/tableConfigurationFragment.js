"use strict";

exports.__esModule = true;

var _templateObject = _taggedTemplateLiteralLoose(["\n  fragment tableConfigurationFragment on tableConfiguration {\n    id\n    formName\n    fieldOptions {\n      ...fieldOptionFragment\n    }\n  }\n  ", "\n"], ["\n  fragment tableConfigurationFragment on tableConfiguration {\n    id\n    formName\n    fieldOptions {\n      ...fieldOptionFragment\n    }\n  }\n  ", "\n"]);

var _graphqlTag = require("graphql-tag");

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _fieldOptionFragment = require("./fieldOptionFragment");

var _fieldOptionFragment2 = _interopRequireDefault(_fieldOptionFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

exports.default = (0, _graphqlTag2.default)(_templateObject, _fieldOptionFragment2.default);
module.exports = exports["default"];