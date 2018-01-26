//@flow
import React from "react";
import { withProps, withHandlers, compose } from "recompose";
import type { Paging } from "../flow_types";
import { noop, get } from "lodash";
import { Button } from "@blueprintjs/core";
import { pageSizes } from "./utils/queryParams";
import { onEnterOrBlurHelper } from "../utils/handlerHelpers";

export class PagingTool extends React.Component {
  static defaultProps = {
    onPageChange: noop
  };

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

  onRefresh = () => {
    this.props.onRefresh();
  };

  setPage = page => {
    this.props.setPage(page);
    this.props.onPageChange(page);
  };

  setPageSize = e => {
    this.props.setPageSize(parseInt(e.target.value, 10));
  };

  pageBack = () => {
    const { paging: { page } } = this.props;
    this.setPage(parseInt(page, 10) - 1);
  };

  pageForward = () => {
    const { paging: { page } } = this.props;
    this.setPage(parseInt(page, 10) + 1);
  };

  setSelectedPage = e => {
    this.setState({
      selectedPage: e.target.value
    });
  };

  pageInputBlur = e => {
    const { paging: { pageSize, total } } = this.props;
    const lastPage = Math.ceil(total / pageSize);
    const pageValue = parseInt(e.target.value, 10);
    const selectedPage =
      pageValue > lastPage
        ? lastPage
        : pageValue < 1 || isNaN(pageValue) ? 1 : pageValue;

    this.setState({
      selectedPage
    });
    this.setPage(selectedPage);
  };

  render() {
    const { selectedPage } = this.state;
    const {
      paging: { pageSize, page, total },
      onRefresh,
      disabled
    } = this.props;
    const pageStart = (page - 1) * pageSize + 1;
    if (pageStart < 0) throw new Error("We should never have page be <0");
    const backEnabled = page - 1 > 0;
    const forwardEnabled = page * pageSize < total;
    const lastPage = Math.ceil(total / pageSize);

    return (
      <div className={"paging-toolbar-container"}>
        {onRefresh && (
          <Button
            className={"pt-minimal"}
            iconName="refresh"
            disabled={disabled}
            onClick={this.onRefresh}
          />
        )}
        <div className="pt-select pt-minimal">
          <select
            className="paging-page-size"
            style={{ width: 55 }}
            onChange={this.setPageSize}
            disabled={disabled}
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
            onClick={this.pageBack}
            disabled={!backEnabled || disabled}
            className="pt-minimal paging-arrow-left"
            iconName="chevron-left"
          />
        </div>
        <div>
          {total ? (
            <div>
              <input
                style={{ marginLeft: 5, width: 35, marginRight: 8 }}
                value={selectedPage}
                disabled={disabled}
                onChange={this.setSelectedPage}
                {...onEnterOrBlurHelper(this.pageInputBlur)}
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
            style={{ marginLeft: 5 }}
            disabled={!forwardEnabled || disabled}
            iconName="chevron-right"
            className="pt-minimal  paging-arrow-right"
            onClick={this.pageForward}
          />
        </div>
      </div>
    );
  }
}

const ConnectedPagingTool = compose(
  withProps(props => {
    const {
      entityCount,
      page,
      pageSize,
      disabled,
      onRefresh,
      setPage,
      setPageSize
    } = props;
    return {
      paging: {
        total: entityCount,
        page,
        pageSize
      },
      disabled: disabled,
      onRefresh: onRefresh,
      setPage: setPage,
      setPageSize: setPageSize
    };
  }),
  withHandlers({
    onPageChange: ({ entities, reduxFormSelectedEntityIdMap }) => () => {
      const record = get(entities, "[0]");
      if (!record || (!record.id && record.id !== 0 && !record.code)) {
        reduxFormSelectedEntityIdMap.input.onChange({});
      }
    }
  })
)(PagingTool);

export default ConnectedPagingTool;
