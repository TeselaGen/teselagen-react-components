// TypeScript Version: 2.3

import { Component } from "react";

export interface DataTableProps {
    entities: [],
    schema: DataTableSchema, //Only use if you're in an app where you don't have react-router set up.
    noRouter: Boolean, //Only use if you're in an app where you don't have react-router set up.
    destroyOnUnmount: Boolean, //redux-form prop to not destroy the dataTable managed data like search query, selected entities, etc
    noHeader: Boolean,
    pageSize: Number,
    SubComponent: function, //react component
    ReactTableProps: object, //Additional props passed directly to the ReactTable instance (ie SubComponent, )
    extraClasses: String,
    className: String,
    page: Number,
    style: {},
    isLoading: Boolean, 
    maxHeight: Number,
    isSimple: Boolean, //preset value   
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