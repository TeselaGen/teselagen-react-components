"use strict";

exports.__esModule = true;

var _templateObject = _taggedTemplateLiteralLoose(["\n  fragment __", "FragmentGenerated", " on ", " {\n    ", "\n  }\n  ", "\n  "], ["\n  fragment __", "FragmentGenerated", " on ", " {\n    ", "\n  }\n  ", "\n  "]);

exports.default = generateFragmentWithFields;

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var gql = require("graphql-tag");
var uniqid = require("uniqid");

/* eslint graphql/template-strings:0 */

function generateFragmentWithFields(model, fields) {
  var fragments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return gql(_templateObject, model, uniqid(), model, Array.isArray(fields) ? fields.join("\n") : fields, Array.isArray(fragments) ? fragments.map(function (f) {
    return f.loc.source.body;
  }).join("\n") : fragments);
}
module.exports = exports["default"];