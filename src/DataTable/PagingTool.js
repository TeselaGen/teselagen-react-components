//@flow
import React from "react";
import { withProps, withHandlers, compose } from "recompose";
import classNames from "classnames";
import { noop, get, toInteger } from "lodash";
import { Button, Classes } from "@blueprintjs/core";
import type { Paging } from "../flow_types";
import { onEnterOrBlurHelper } from "../utils/handlerHelpers";
import { defaultPageSizes } from "./utils/queryParams";
import getIdOrCodeOrIndex from "./utils/getIdOrCodeOrIndex";

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
    selectedPage: 1,
    refetching: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      paging: { page }
    } = nextProps;
    this.setState({
      selectedPage: page
    });
  }

  onRefresh = async () => {
    this.setState({
      refetching: true
    });
    await this.props.onRefresh();
    this.setState({
      refetching: false
    });
  };

  setPage = page => {
    this.props.setPage(page);
    this.props.onPageChange(page);
  };

  setPageSize = e => {
    this.props.setPageSize(parseInt(e.target.value, 10));
  };

  pageBack = () => {
    const {
      paging: { page }
    } = this.props;
    this.setPage(parseInt(page, 10) - 1);
  };

  pageForward = () => {
    const {
      paging: { page }
    } = this.props;
    this.setPage(parseInt(page, 10) + 1);
  };

  setSelectedPage = e => {
    this.setState({
      selectedPage: e.target.value
    });
  };

  pageInputBlur = e => {
    const {
      paging: { pageSize, total }
    } = this.props;
    const lastPage = Math.ceil(total / pageSize);
    const pageValue = parseInt(e.target.value, 10);
    const selectedPage =
      pageValue > lastPage
        ? lastPage
        : pageValue < 1 || isNaN(pageValue)
        ? 1
        : pageValue;

    this.setState({
      selectedPage
    });
    this.setPage(selectedPage);
  };
  componentDidMount() {
    //set a
    const additionalPageSize =
      window.frontEndConfig && window.frontEndConfig.additionalPageSize
        ? [toInteger(window.frontEndConfig.additionalPageSize)]
        : [];
    window.tgPageSizes = [...defaultPageSizes, ...additionalPageSize];
  }

  render() {
    const { selectedPage, refetching } = this.state;
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
      <div className="paging-toolbar-container">
        {onRefresh && (
          <Button
            minimal
            loading={refetching}
            icon="refresh"
            disabled={disabled}
            onClick={this.onRefresh}
          />
        )}
        <div
          title="Set Page Size"
          className={classNames(Classes.SELECT, Classes.MINIMAL)}
        >
          <select
            className="paging-page-size"
            onChange={this.setPageSize}
            disabled={disabled}
            value={pageSize}
          >
            {[
              <option key="page-size-placeholder" disabled value="fake">
                Size
              </option>,
              ...(window.tgPageSizes || defaultPageSizes).map(size => {
                return (
                  <option key={size} value={size}>
                    {size}
                  </option>
                );
              })
            ]}
          </select>
        </div>
        <Button
          onClick={this.pageBack}
          disabled={!backEnabled || disabled}
          minimal
          className="paging-arrow-left"
          icon="chevron-left"
        />
        <div>
          {total ? (
            <div>
              <input
                style={{ marginLeft: 5, width: 35, marginRight: 8 }}
                value={selectedPage}
                disabled={disabled}
                onChange={this.setSelectedPage}
                {...onEnterOrBlurHelper(this.pageInputBlur)}
                className={Classes.INPUT}
              />
              of {lastPage}
            </div>
          ) : (
            "No Rows"
          )}
        </div>
        <Button
          style={{ marginLeft: 5 }}
          disabled={!forwardEnabled || disabled}
          icon="chevron-right"
          minimal
          className="paging-arrow-right"
          onClick={this.pageForward}
        />
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
    onPageChange: ({ entities, change }) => () => {
      const record = get(entities, "[0]");
      if (!record || !getIdOrCodeOrIndex(record)) {
        change("reduxFormSelectedEntityIdMap", {});
      }
    }
  })
)(PagingTool);

export default ConnectedPagingTool;
