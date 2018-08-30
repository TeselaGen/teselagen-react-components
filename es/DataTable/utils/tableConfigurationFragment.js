var _templateObject = _taggedTemplateLiteralLoose(["\n  fragment tableConfigurationFragment on tableConfiguration {\n    id\n    formName\n    fieldOptions {\n      ...fieldOptionFragment\n    }\n  }\n  ", "\n"], ["\n  fragment tableConfigurationFragment on tableConfiguration {\n    id\n    formName\n    fieldOptions {\n      ...fieldOptionFragment\n    }\n  }\n  ", "\n"]);

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

import gql from "graphql-tag";
import fieldOptionFragment from "./fieldOptionFragment";

export default gql(_templateObject, fieldOptionFragment);