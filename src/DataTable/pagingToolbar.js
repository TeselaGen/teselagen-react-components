//@flow
import React from "react";
import type { Paging } from "../flow_types";
import { NumericInput, Intent } from "@blueprintjs/core";
// queryParams: {
//   filters: {},
//   sorting: [],
//   paging: {},
//   columns: [],
//   trackingInfo: {},
//   responseId: {}
// }
class PagingToolbar extends React.Component {
  props: {
    paging: Paging,
    setPaging: Function
  };

  render() {
    const { paging: { pageSize, page, total }, setPaging } = this.props;
    const pageStart = (page - 1) * pageSize + 1;
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
          value={pageSize}
          onValueChange={value => {
            setPaging({
              page,
              pageSize: value
            });
          }}
        />
        <span
          onClick={() => {
            if (backEnabled) {
              setPaging({
                pageSize,
                page: page - 1
              });
            } else {
              toastr && toastr.warning('No more pages that way')
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
              setPaging({
                pageSize,
                page: page + 1
              });
            } else {
              toastr && toastr.warning('No more pages that way')
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
    console.log("Value as number:", valueAsNumber);
    console.log("Value as string:", valueAsString);
  };
}

export default PagingToolbar;
