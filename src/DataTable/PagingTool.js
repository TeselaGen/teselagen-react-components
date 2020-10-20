import React, { useState, useEffect, useRef } from "react";
import { withProps, withHandlers, compose } from "recompose";
import classNames from "classnames";
import { noop, get, toInteger } from "lodash";
import { Button, Classes } from "@blueprintjs/core";
import { onEnterOrBlurHelper } from "../utils/handlerHelpers";
import { defaultPageSizes } from "./utils/queryParams";
import getIdOrCodeOrIndex from "./utils/getIdOrCodeOrIndex";

function PagingInput({ disabled, onBlur, defaultPage }) {
  const [page, setPage] = useState(defaultPage);
  const defaultValue = useRef(defaultPage);

  useEffect(() => {
    if (page !== defaultPage && defaultValue.current !== defaultPage) {
      setPage(defaultPage);
    }
    defaultValue.current = defaultPage;
  }, [page, defaultPage]);

  return (
    <input
      style={{ marginLeft: 5, width: 35, marginRight: 8 }}
      value={page}
      disabled={disabled}
      onChange={e => {
        setPage(e.target.value);
      }}
      {...onEnterOrBlurHelper(onBlur)}
      className={Classes.INPUT}
    />
  );
}

class PagingTool extends React.Component {
  static defaultProps = {
    onPageChange: noop
  };

  state = {
    refetching: false
  };

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
    const { refetching } = this.state;
    const {
      paging: { pageSize, page, total },
      onRefresh,
      hideTotalPages,
      disabled,
      controlled_hasNextPage,
      disableSetPageSize,
      hideSetPageSize
    } = this.props;
    const pageStart = (page - 1) * pageSize + 1;
    if (pageStart < 0) throw new Error("We should never have page be <0");
    const backEnabled = page - 1 > 0;
    const forwardEnabled = page * pageSize < total;
    const lastPage = Math.ceil(total / pageSize);
    const options = [...(window.tgPageSizes || defaultPageSizes)];
    if (!options.includes(pageSize)) {
      options.push(pageSize);
    }
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
        {!hideSetPageSize && (
          <div
            title="Set Page Size"
            className={classNames(Classes.SELECT, Classes.MINIMAL)}
          >
            <select
              className="paging-page-size"
              onChange={this.setPageSize}
              disabled={disabled || disableSetPageSize}
              value={pageSize}
            >
              {[
                <option key="page-size-placeholder" disabled value="fake">
                  Size
                </option>,
                ...options.map(size => {
                  return (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  );
                })
              ]}
            </select>
          </div>
        )}
        <Button
          onClick={this.pageBack}
          disabled={!backEnabled || disabled}
          minimal
          className="paging-arrow-left"
          icon="chevron-left"
        />
        <div>
          {hideTotalPages ? (
            page
          ) : total ? (
            <div>
              <PagingInput
                disabled={disabled}
                onBlur={this.pageInputBlur}
                defaultPage={page}
              />
              of {lastPage}
            </div>
          ) : (
            "No Rows"
          )}
        </div>
        <Button
          style={{ marginLeft: 5 }}
          disabled={
            (controlled_hasNextPage === undefined
              ? !forwardEnabled
              : !controlled_hasNextPage) || disabled
          }
          icon="chevron-right"
          minimal
          className="paging-arrow-right"
          onClick={this.pageForward}
        />
      </div>
    );
  }
}

export default compose(
  withProps(props => {
    const {
      entityCount,
      page,
      pageSize,
      disabled,
      pagingDisabled,
      onRefresh,
      controlled_setPage,
      controlled_setPageSize,
      controlled_page,

      controlled_total,
      controlled_onRefresh,
      setPage,
      setPageSize
    } = props;
    return {
      paging: {
        total: controlled_total || entityCount,
        page: controlled_page || page,
        pageSize
      },
      disabled: disabled || pagingDisabled,
      onRefresh: controlled_onRefresh || onRefresh,
      setPage: controlled_setPage || setPage,
      setPageSize: controlled_setPageSize || setPageSize
    };
  }),
  withHandlers({
    onPageChange: ({ entities, keepSelectionOnPageChange, change }) => () => {
      const record = get(entities, "[0]");
      if (
        !keepSelectionOnPageChange &&
        (!record || !getIdOrCodeOrIndex(record))
      ) {
        change("reduxFormSelectedEntityIdMap", {});
      }
    }
  })
)(PagingTool);
