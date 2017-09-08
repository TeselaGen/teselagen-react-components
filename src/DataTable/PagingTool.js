//@flow
import React from "react";
import classNames from "classnames";
import type { Paging } from "../flow_types";
import { Button, Classes } from "@blueprintjs/core";
import { pageSizes } from "./utils/queryParams";

export default class PagingTool extends React.Component {
  props: {
    paging: Paging,
    setPageSize: Function,
    onRefresh?: Function,
    setPage: Function
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.paging.pageSize
    };
  }

  render() {
    const {
      paging: { pageSize, page, total },
      setPageSize,
      setPage,
      onRefresh
    } = this.props;
    const pageStart = (page - 1) * pageSize + 1;
    if (pageStart < 0) throw new Error("We should never have page be <0");
    const pageEnd =
      (page - 1) * pageSize + pageSize < total
        ? (page - 1) * pageSize + pageSize
        : total;
    const backEnabled = page - 1 > 0;
    const forwardEnabled = page * pageSize + 1 < total;
    return (
      <div className={"paging-toolbar-container"}>
        {onRefresh && (
          <Button
            iconName="refresh"
            style={{
              marginRight: 10
            }}
            className={classNames(Classes.SMALL, Classes.MINIMAL)}
            onClick={() => onRefresh()}
          />
        )}
        <div className="pt-select">
          <select
            style={{ width: 55 }}
            onChange={e => {
              setPageSize(parseInt(e.target.value, 10));
            }}
            value={pageSize}
          >
            {[
              <option key="wfafwwf" disabled value={"fake"}>
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
        <Button
          onClick={() => {
            setPage(parseInt(page, 10) - 1);
          }}
          disabled={!backEnabled}
          iconName="arrow-left"
          className={classNames(
            Classes.SMALL,
            Classes.MINIMAL,
            "paging-arrow-left"
          )}
        />

        <span>
          {" "}
          {parseInt(pageStart, 10)}-{parseInt(pageEnd, 10)} of {total}{" "}
        </span>
        <Button
          disabled={!forwardEnabled}
          iconName="arrow-right"
          onClick={() => {
            setPage(parseInt(page, 10) + 1);
          }}
          className={classNames(
            Classes.SMALL,
            Classes.MINIMAL,
            "paging-arrow-right"
          )}
        />
      </div>
    );
  }
  handleValueChange = (valueAsNumber: number, valueAsString: string) => {
    // console.log("Value as number:", valueAsNumber);
    // console.log("Value as string:", valueAsString);
  };
}
