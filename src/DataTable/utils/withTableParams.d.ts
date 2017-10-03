// TypeScript Version: 2.5

export interface IDefaults {
  filter: [Object],
  pageSize: Number,
  order: [String], //[-name, statusCode] //an array of camelCase display names with - sign to denote reverse
  searchTerm: "",
  page: Number,
}

export default function withTableParams({
  formName: String; // - required unique identifier for the table
  schema: Boolean; //  - The data table schema
  urlConnected: Boolean; //  - whether the table should connect to/update the URL
  withSelectedEntities: Boolean; //  - whether or not to pass the selected entities
  defaults: defaults; // - tableParam defaults such as pageSize, filter, etc
}) {}
