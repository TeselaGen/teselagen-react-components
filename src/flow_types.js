//@flow
const tableDataTypes = {
  string: "string",
  lookup: "lookup",
  number: "number",
  boolean: "boolean",
  timestamp: "timestamp",
  mixed: "mixed",
  undefined: "undefined"
};
export type TableDataTypes = $Keys<typeof tableDataTypes>;

export type SchemaForField = SchemaForFieldRelated | SchemaForFieldNonRelated;

export type TableParams = {
  reduxFormSearchInput: Object,
  history: Object,
  page: number,
  pageSize: number,
  order: string,
  selectedFilter: string,
  filterValue: string,
  fieldName: string,
  searchTerm: string,
  columns: Array<string>,
  setSearchTerm: Function,
  setFilter: Function,
  clearFilters: Function,
  setPageSize: Function,
  setOrder: Function,
  setPage: Function
};

type SchemaForFieldNonRelated = {
  type: TableDataTypes,
  displayName: string
};

type SchemaForFieldRelated = {
  type: TableDataTypes,
  displayName: string,
  model: string,
  path: string,
  field: string
};

export type DataTableSchema = {
  fields: {
    [columnName: string]: SchemaForField
  },
  customFields?: Object
};

const stringOperationTypes = {
  startsWith: "startsWith",
  endsWith: "endsWith",
  contains: "contains",
  exactlyMatches: "exactlyMatches"
};

type StringOperationTypes = $Keys<typeof stringOperationTypes>;

const numberAndTimestampOperationTypes = {
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

interface FilterOperation {
  dataType: TableDataTypes,
  operationType?: any,
  values: Array<any>
}

export type ColumnFilters = {
  [columnName: string]: {
    filterOperation: FilterOperation
  }
};

export type SortingOptions = {
  [columnName: string]: "asc" | "desc"
};

export type Paging = {
  pageSize: number,
  page: number,
  total: number
};

export type QueryParams = {
  limit: number,
  order: string,
  where: Object,
  offset: number,
  include: Array<Object>
};
