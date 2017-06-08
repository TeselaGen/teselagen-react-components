//@flow
import React from "react";
import type { Paging } from "../flow_types";
import { NumericInput, Button } from "@blueprintjs/core";
import { onEnterOrBlurHelper } from "../utils/handlerHelpers";

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

  onValueChange = value => {
    this.setState({
      value
    });
  };

  render() {
    const {
      paging: { pageSize, page, total },
      setPageSize,
      setPage,
      onRefresh
    } = this.props;
    const pageStart = (page - 1) * pageSize + 1;
    if (pageStart < 0) debugger;
    const pageEnd = (page - 1) * pageSize + pageSize < total
      ? (page - 1) * pageSize + pageSize
      : total;
    const backEnabled = page - 1 > 0;
    const forwardEnabled = page + 1 < (total + pageSize) / pageSize;
    return (
      <div className={"paging-toolbar-container"}>
        <span> Rows per page: </span>
        <NumericInput
          className={"paging-row-input"}
          value={this.state.value}
          onValueChange={value => {
            this.onValueChange(value);
            if (Math.abs(this.state.value - value) <= 1) {
              setPageSize(parseInt(value, 10));
            }
          }}
          {...onEnterOrBlurHelper(e => {
            this.onValueChange(e.target.value);
            setPageSize(parseInt(e.target.value, 10));
          })}
        />
        {onRefresh
          ? <Button iconName="refresh" onClick={() => onRefresh()} />
          : ""}
        <span
          onClick={() => {
            if (backEnabled) {
              setPage(page - 1);
            } else {
              toastr && toastr.warning("No more pages that way");
            }
          }}
          className={
            "pt-icon-standard pt-icon-arrow-left paging-arrow-left " +
              (!backEnabled && " pt-disabled")
          }
        />

        <span> {pageStart}-{pageEnd} of {total} </span>
        <span
          onClick={() => {
            if (forwardEnabled) {
              setPage(page + 1);
            } else {
              toastr && toastr.warning("No more pages that way");
            }
          }}
          className={
            "pt-icon-standard pt-icon-arrow-right paging-arrow-right " +
              (!forwardEnabled && " pt-disabled")
          }
        />

      </div>
    );
  }
  handleValueChange = (valueAsNumber: number, valueAsString: string) => {
    // console.log("Value as number:", valueAsNumber);
    // console.log("Value as string:", valueAsString);
  };
}
