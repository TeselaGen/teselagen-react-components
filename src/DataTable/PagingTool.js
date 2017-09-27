//@flow
import React from "react";
import type { Paging } from "../flow_types";
import { Button } from "@blueprintjs/core";
import { pageSizes } from "./utils/queryParams";
import { onEnterOrBlurHelper } from "../utils/handlerHelpers";

export default class PagingTool extends React.Component {
  props: {
    paging: Paging,
    setPageSize: Function,
    onRefresh?: Function,
    setPage: Function
  };

  state = {
    selectedPage: 1
  };

  componentWillReceiveProps(nextProps) {
    const { paging: { page } } = nextProps;
    this.setState({
      selectedPage: page
    });
  }

  render() {
    const { selectedPage } = this.state;
    const {
      paging: { pageSize, page, total },
      setPageSize,
      setPage,
      onRefresh
    } = this.props;
    const pageStart = (page - 1) * pageSize + 1;
    if (pageStart < 0) throw new Error("We should never have page be <0");
    // const pageEnd =
    //   (page - 1) * pageSize + pageSize < total
    //     ? (page - 1) * pageSize + pageSize
    //     : total;
    const backEnabled = page - 1 > 0;
    const forwardEnabled = page * pageSize < total;
    const lastPage = Math.ceil(total / pageSize);

    return (
      <div className={"paging-toolbar-container"}>
        {onRefresh && (
          <Button
            className={"pt-minimal"}
            iconName="refresh"
            onClick={() => onRefresh()}
          />
        )}
        <div className="pt-select pt-minimal">
          <select
            style={{ width: 55 }}
            onChange={e => {
              setPageSize(parseInt(e.target.value, 10));
            }}
            value={pageSize}
          >
            {[
              <option key="page-size-placeholder" disabled value={"fake"}>
                Set Page Size
              </option>,
              ...pageSizes.map(size => {
                return (
                  <option key={size} value={size}>
                    {size}
                  </option>
                );
              })
            ]}
          </select>
        </div>
        <div style={{}} className="pt-button-group">
          <Button
            style={{}}
            onClick={() => {
              setPage(parseInt(page, 10) - 1);
            }}
            disabled={!backEnabled}
            className="paging-arrow-left"
            iconName="chevron-left"
          />
        </div>
        <div>
          {total ? (
            <div>
              <input
                style={{ width: 35, marginLeft: 8, marginRight: 8 }}
                value={selectedPage}
                onChange={e => {
                  this.setState({
                    selectedPage: e.target.value
                  });
                }}
                {...onEnterOrBlurHelper(e => {
                  const pageValue = parseInt(e.target.value, 10);
                  const selectedPage =
                    pageValue > lastPage
                      ? lastPage
                      : pageValue < 1 || isNaN(pageValue) ? 1 : pageValue;
                  this.setState({
                    selectedPage
                  });
                  setPage(selectedPage);
                })}
                className="pt-input"
              />
              of {lastPage}
            </div>
          ) : (
            "No Rows"
          )}
        </div>
        <div className="pt-button-group">
          <Button
            style={{ marginLeft: 10 }}
            disabled={!forwardEnabled}
            iconName="chevron-right"
            className="paging-arrow-right"
            onClick={() => {
              setPage(parseInt(page, 10) + 1);
            }}
          />
        </div>
      </div>
    );
  }
}
