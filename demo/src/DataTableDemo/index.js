//@flow
import React from "react";
import { MenuItem, Switch } from "@blueprintjs/core";
import { FocusStyleManager, Dialog } from "@blueprintjs/core";
import {ApolloProvider, ApolloClient} from 'react-apollo';

// import { createStore, combineReducers } from "redux";
// import { reducer as form } from "redux-form";
import { withTableParams, DataTable } from "../../../src";
// import { onEnterOrBlurHelper } from "../../../src";
import "./style.css";

// import { columns, schema } from "./new_mocks";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import Chance from "chance";
import times from "lodash/times";
import { DataTableSchema } from "../../../src/flow_types";
FocusStyleManager.onlyShowFocusOnTabs();

//@flow
const client = new ApolloClient({})
const chance = new Chance();

const schema: DataTableSchema = {
  model: "material",
  fields: [
    {
      path: "notDisplayedField",
      isHidden: true,
      type: "string",
      displayName: "Not Displayed"
    },
    { path: "type", type: "lookup", displayName: "Special Type" },
    { path: "isShared", type: "boolean", displayName: "Is Shared?" },
    {
      path: "name",
      type: "string",
      displayName: "Name",
      render: (value, record, row) => {
        return (
          <span
            style={{
              color: (Math.random() > .5) ? "green" : "red"
            }}
          >
            {value}
          </span>
        );
      },
      renderTitleInner: <span className={'pt-icon-search-around'}> &nbsp; Name</span> 
    },
    { path: "createdAt", type: "timestamp", displayName: "Date Created" },
    { path: "updatedAt", type: "timestamp", displayName: "Last Edited" },
    {
      type: "lookup",
      displayName: "User Status",
      path: "user.status.name"
    },
    {
      sortDisabled: true,
      path: "user.lastName",
      type: "string",
      displayName: "Added By"
    }
  ]
};

const renderToggle = (that, type, description) => {
  return (
    <div className={"toggle-button-holder"}>
      <Switch
        checked={that.state[type]}
        label={type}
        onChange={() => {
          that.setState({
            [type]: !that.state[type]
          });
        }}
      />
      {description && <span>{description}</span>}
    </div>
  );
};

export default class DataTableDemo extends React.Component {
  state = {
    renderUnconnectedTable: false,
    urlConnected: true,
    onlyOneFilter: false,
    inDialog: false,
    withSelectedEntities: false
  };
  componentWillMount() {
    //tnr: the following code allows the DataTable test to set defaults on the demo (which is used in the testing)
    this.setState(this.props);
  }

  render() {
    let ConnectedTable = withTableParams({
      //tnrtodo: this should be set up as an enhancer instead
      formName: "example 1", //this should be a unique name
      schema,
      urlConnected: this.state.urlConnected,
      onlyOneFilter: this.state.onlyOneFilter,
      withSelectedEntities: this.state.withSelectedEntities
    })(DataTableInstance);
    ConnectedTable = withRouter(ConnectedTable);

    return (
      <ApolloProvider client={client} store={store}>
        <div>
          <Router>
            <div>
              <h3>Demo specific options:</h3>
              <br />
              {renderToggle(
                this,
                "renderUnconnectedTable",
                "Render the table without the withTableParams wrapper. It's just a simple disconnected react component. You'll need to handle paging/sort/filters yourself. Try hitting isInfinite to see something actually show up with it"
              )}
              {renderToggle(this, "inDialog", "Render the table in a dialog")}
              <h3>withTableParams options:</h3>
              <br />
              {renderToggle(
                this,
                "urlConnected",
                "Turn off urlConnected if you don't want the url to be updated by the table"
              )}
              {renderToggle(
                this,
                "onlyOneFilter",
                "Setting this true makes the table only keep 1 filter/search term in memory instead of allowing multiple"
              )}
              {renderToggle(
                this,
                "withSelectedEntities",
                "Setting this true makes the table pass the selectedEntities"
              )}
              <br />
              {this.state.inDialog ? (
                <Dialog
                  onClose={() =>
                    this.setState({
                      inDialog: false
                    })}
                  title="Table inside a dialog"
                  isOpen={this.state.inDialog}
                >
                  <ConnectedTable />
                </Dialog>
              ) : this.state.renderUnconnectedTable ? (
                <DataTableInstance
                  {...{
                    tableParams: {
                      formName: "example 1", //this should be a unique name
                      schema,
                      urlConnected: this.state.urlConnected,
                      onlyOneFilter: this.state.onlyOneFilter
                    }
                  }}
                />
              ) : (
                <ConnectedTable />
              )}
              <br />
            </div>
          </Router>
        </div>
      </ApolloProvider>
    );
  }
}

const generateFakeRows = num => {
  return times(num).map(function(a, index) {
    return {
      id: index,
      notDisplayedField: chance.name(),
      name: chance.name(),
      isShared: chance.pickone([true, false]),
      user: {
        lastName: chance.name(),
        status: {
          name: chance.pickone(["pending", "added"])
        }
      },
      type: "denicolaType",
      addedBy: chance.name(),
      updatedAt: chance.date(),
      createdAt: chance.date()
    };
  });
};

const defaultNumOfEntities = 60;

export class DataTableInstance extends React.Component {
  state = {
    additionalFilters: false,
    withTitle: true,
    withSearch: true,
    withPaging: true,
    noHeader: false,
    noFooter: false,
    noPadding: false,
    withDisplayOptions: false,
    isInfinite: false,
    isSingleSelect: false,
    maxHeight: false,
    isLoading: false,
    compact: false,
    hidePageSizeWhenPossible: false,
    hideSelectedCount: false,
    doNotShowEmptyRows: false,
    withCheckboxes: true,
    numOfEntities: 60,
    selectedIds: undefined,
    entities: generateFakeRows(defaultNumOfEntities)
  };

  render() {
    const { numOfEntities, entities, selectedIds } = this.state;
    const { tableParams, selectedEntities } = this.props;
    const { page, pageSize, isTableParamsConnected } = tableParams;
    let entitiesToPass = [];
    if (this.state.isInfinite || !isTableParamsConnected) {
      entitiesToPass = entities;
    } else {
      for (let i = (page - 1) * pageSize; i < page * pageSize; i++) {
        entities[i] && entitiesToPass.push(entities[i]);
      }
    }
    const additionalFilters = this.state.additionalFilters && [
      {
        filterOn: "notDisplayed", //remember this needs to be the camel cased display name
        selectedFilter: "Contains",
        filterValue: "aj"
      }
    ];
    return (
      <div>
        <h3>Table Level Options</h3>
        <br />
        {renderToggle(
          this,
          "additionalFilters",
          "Filters can be added by passing an additionalFilters prop. You can even filter on non-displayed fields"
        )}
        Set number of entities:{" "}
        <input
          type="number"
          value={numOfEntities}
          onChange={e => {
            const numOfEntities = parseInt(e.target.value, 10);
            this.setState({
              numOfEntities,
              entities: generateFakeRows(numOfEntities)
            });
          }}
        />
        <br />
        Select records by ids (a single number or numbers separated by ","):{" "}
        <input
          onChange={e => {
            const val = e.target.value;
            const selectedIds = (val.indexOf(",") > -1
              ? val.split(",").map(num => parseInt(num, 10))
              : [parseInt(val, 10)]).filter(val => !isNaN(val));
            this.setState({
              selectedIds
            });
          }}
        />
        {renderToggle(this, "withTitle")}
        {renderToggle(this, "withSearch")}
        {renderToggle(this, "withDisplayOptions", "This feature doesn't work currently without a data table connection")}
        {renderToggle(this, "withPaging")}
        {renderToggle(this, "noHeader")}
        {renderToggle(this, "noFooter")}
        {renderToggle(this, "noPadding")}
        {renderToggle(this, "isInfinite")}
        {renderToggle(this, "isLoading")}
        {renderToggle(this, "hidePageSizeWhenPossible")}
        {renderToggle(this, "doNotShowEmptyRows")}
        {renderToggle(this, "withCheckboxes")}
        {renderToggle(this, "isSingleSelect")}
        {renderToggle(this, "hideSelectedCount")}
        {renderToggle(this, "compact")}
        {renderToggle(
          this,
          "maxHeight",
          "By default every table has a max height of 800px. Setting this true changes it to 200px"
        )}
        {selectedEntities && (
          <div>
            The following records are selected (pass withSelectedEntities: true
            to withTableParams):
            <div
              style={{
                height: 40,
                maxHeight: 40,
                maxWidth: 800,
                overflow: "auto"
              }}
            >
              {selectedEntities
                .map(record => `${record.id}: ${record.name}`)
                .join(", ")}
            </div>
          </div>
        )}
        <DataTable
          {...tableParams}
          entities={entitiesToPass}
          entityCount={entities.length}
          onDoubleClick={function() {
            console.log("double clicked");
          }}
          cellRenderer={{
            isShared: (value, record, row) => {
              return (
                <span
                  style={{
                    color: value ? "green" : "red"
                  }}
                >
                  {value ? "True" : "False"} <button>click me</button>
                </span>
              );
            }
          }}
          additionalFilters={additionalFilters}
          title={"Demo table"}
          contextMenu={function({ selectedRecords, history }) {
            return [
              <MenuItem
                onClick={function() {
                  console.log("I got clicked!");
                }}
                text={"Menu text here"}
              />,
              <MenuItem
                onClick={function() {
                  console.log("I also got clicked!");
                }}
                text={"Some more"}
              />
            ];
          }}
          withTitle={this.state.withTitle}
          withSearch={this.state.withSearch}
          withPaging={this.state.withPaging}
          noPadding={this.state.noPadding}
          noHeader={this.state.noHeader}
          noFooter={this.state.noFooter}
          withDisplayOptions={this.state.withDisplayOptions}
          isInfinite={this.state.isInfinite}
          isLoading={this.state.isLoading}
          compact={this.state.compact}
          hidePageSizeWhenPossible={this.state.hidePageSizeWhenPossible}
          doNotShowEmptyRows={this.state.doNotShowEmptyRows}
          withCheckboxes={this.state.withCheckboxes}
          isSingleSelect={this.state.isSingleSelect}
          hideSelectedCount={this.state.hideSelectedCount}
          {...(this.state.maxHeight
            ? {
                maxHeight: "200px"
              }
            : {})}
          onRefresh={() => {
            alert("clicked refresh!");
          }}
          // history={history}
          onSingleRowSelect={noop}
          onDeselect={noop}
          onMultiRowSelect={noop}
          selectedIds={selectedIds}
        />
        <br />
        <br />
      </div>
    );
  }
}

function noop() {}
