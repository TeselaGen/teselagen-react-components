import React from "react";
import PropTypes from "prop-types";

import "./selection_status.css";

const SelectionStatus = ({
  selected,
  clearAll,
  clearAllMessage,
  noneSelectedMessage,
  selectedMessage
}) => (
  <div className={"mss-selection_status"}>
    <div className={"mss-status"}>
      {selected.length > 0
        ? `${selected.length} ${selectedMessage}`
        : noneSelectedMessage}
    </div>
    <div className={"mss-clear_all"} onClick={clearAll}>
      {selected.length > 0 ? clearAllMessage : ""}
    </div>
  </div>
);

SelectionStatus.propTypes = {
  selected: PropTypes.array,
  clearAll: PropTypes.func,
  clearAllMessage: PropTypes.string,
  noneSelectedMessage: PropTypes.string,
  selectedMessage: PropTypes.string
};

SelectionStatus.defaultProps = {
  selected: [],
  clearAllMessage: "Clear All",
  noneSelectedMessage: "None Selected",
  selectedMessage: "selected"
};

export default SelectionStatus;
