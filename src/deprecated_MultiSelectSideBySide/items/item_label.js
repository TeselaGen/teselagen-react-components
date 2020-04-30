import React from "react";
import PropTypes from "prop-types";
import ReactOverflowTooltip from "react-overflow-tooltip";

import "./item_label.css";

const ItemLabel = ({ label }) => (
  <ReactOverflowTooltip title={label}>
    <div className={"mss-label"}>{label}</div>
  </ReactOverflowTooltip>
);

ItemLabel.propTypes = {
  label: PropTypes.string
};

ItemLabel.defaultProps = {
  label: ""
};

export default ItemLabel;
