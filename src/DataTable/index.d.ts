// TypeScript Version: 2.3

import { Component } from "react";

export interface DataTableProps {
    entities: [],
    schema: DataTableSchema, //Only use if you're in an app where you don't have react-router set up.
    noRouter: Boolean, //Only use if you're in an app where you don't have react-router set up.
    destroyOnUnmount: Boolean,
    noHeader: Boolean,
    pageSize: Number,
    extraClasses: String,
    className: String,
    page: Number,
    style: {},
    isLoading: Boolean, 
    maxHeight: Number,
    isSimple: Boolean,
    reduxFormSearchInput: {},
    reduxFormSelectedEntityIdMap: {},
    setSearchTerm?(): void,
    setFilter?(): void,
    clearFilters?(): void,
    setPageSize?(): void,
    setOrder?(): void,
    setPage?(): void,
    contextMenu?(): void,
    onDoubleClick?(): void,
    onRowSelect?(): void,
    onMultiRowSelect?(): void,
    onSingleRowSelect?(): void,
    onDeselect?(): void,
    addFilters?(): void,
    removeSingleFilter?(): void,
    filters: [],
    isSimple: Boolean,
    isSingleSelect: Boolean,
    withCheckboxes: Boolean,
    noFooter: Boolean,
    noPadding: Boolean,
    hidePageSizeWhenPossible: Boolean,
    isInfinite: Boolean,
    hideSelectedCount: Boolean,
    withTitle: Boolean,
    withSearch: Boolean,
    withPaging: Boolean,
}
export interface DataTableSchema {
    model: string, //optional (eg. user)
    fields: [DataTableSchemaField]
}
export interface DataTableSchemaField {
    path: string,  //eg. "firstName" || "post.type"
    type: "string"|"number"|"timestamp", 
    displayName: string, //must be unique! eg. "First Name" || Post Type
}

export default class DataTable extends Component<DataTableProps> {}