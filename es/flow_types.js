var tableDataTypes = {
  string: "string",
  lookup: "lookup",
  number: "number",
  boolean: "boolean",
  timestamp: "timestamp",
  mixed: "mixed",
  undefined: "undefined"
};


var stringOperationTypes = {
  startsWith: "startsWith",
  endsWith: "endsWith",
  contains: "contains",
  exactlyMatches: "exactlyMatches"
};

var numberAndTimestampOperationTypes = {
  greaterThan: "greaterThan",
  lessThan: "lessThan",
  rangeOf: "rangeOf",
  equalTo: "equalTo",
  greaterThanEqualTo: "greaterThanEqualTo",
  lessThanEqualTo: "lessThanEqualTo"
};

// type NumberAndTimestampOperationTypes = $Keys<
//   typeof numberAndTimestampOperationTypes
// >;