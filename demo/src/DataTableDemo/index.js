//@flow
import React from "react";
import { entities, schema } from "./mocks";
import { MenuItem, Switch } from "@blueprintjs/core";
import { FocusStyleManager, Dialog } from "@blueprintjs/core";
// import { createStore, combineReducers } from "redux";
// import { reducer as form } from "redux-form";
import { withTableParams, DataTable } from "../../../src";
// import { onEnterOrBlurHelper } from "../../../src";
import "./style.css";
// import { columns, schema } from "./new_mocks";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
FocusStyleManager.onlyShowFocusOnTabs();

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
      {description &&
        <span>
          {description}
        </span>}
    </div>
  );
};

export default class DataTableDemo extends React.Component {
  state = {
    renderUnconnectedTable: false,
    urlConnected: true,
    onlyOneFilter: false,
    inDialog: false
  };
  componentWillMount() {
    //tnr: the following code allows the DataTable test to set defaults on the demo (which is used in the testing)
    this.setState(this.props);
  }

  render() {
    let ConnectedTable = withTableParams(DataTableInstance, {
      ConnectedTable: true,
      formname: "example 1", //this should be a unique name
      schema,
      urlConnected: this.state.urlConnected,
      onlyOneFilter: this.state.onlyOneFilter
    });
    ConnectedTable = withRouter(ConnectedTable);

    return (
      <Provider store={store}>
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
              <br />
              {this.state.inDialog
                ? <Dialog
                    onClose={() =>
                      this.setState({
                        inDialog: false
                      })}
                    title="Table inside a dialog"
                    isOpen={this.state.inDialog}
                  >
                    <ConnectedTable />
                  </Dialog>
                : this.state.renderUnconnectedTable
                  ? <DataTableInstance
                      {...{
                        tableParams: {
                          schema
                        }
                      }}
                    />
                  : <ConnectedTable />}
              <br />
            </div>
          </Router>
        </div>
      </Provider>
    );
  }
}

export class DataTableInstance extends React.Component {
  state = {
    additionalFilters: false,
    withTitle: true,
    withSearch: true,
    withPaging: true,
    isInfinite: false,
    withCheckboxes: true
  };

  render() {
    const { tableParams } = this.props;
    const { page, pageSize } = tableParams;
    let entitiesToPass = [];
    if (this.state.isInfinite) {
      entitiesToPass = entities;
    } else {
      for (var i = (page - 1) * pageSize; i < page * pageSize; i++) {
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
        {renderToggle(this, "withTitle")}
        {renderToggle(this, "withSearch")}
        {renderToggle(this, "withPaging")}
        {renderToggle(this, "isInfinite")}
        {renderToggle(this, "withCheckboxes")}
        <DataTable
          {...tableParams}
          entities={entitiesToPass}
          entityCount={entities.length}
          onDoubleClick={function() {
            console.log("double clicked");
          }}
          additionalFilters={additionalFilters}
          title={"Demo table"}
          contextMenu={function({
            selectedRecords,
            history,
            selectedRows,
            regions
          }) {
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
          isInfinite={this.state.isInfinite}
          withCheckboxes={this.state.withCheckboxes}
          onRefresh={() => {
            alert("clicked refresh!");
          }}
          // history={history}
          onSingleRowSelect={noop}
          onDeselect={noop}
          onMultiRowSelect={noop}
        />
        <br />
        <br />
      </div>
    );
  }
}

function noop() {}
