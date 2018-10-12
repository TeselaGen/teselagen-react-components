import React from "react";
import PropTypes from "prop-types";

import "./no_items.css";

const NoItems = ({ noItemsMessage }) => (
  <div className={"mss-no_items"}>{noItemsMessage}</div>
);

NoItems.propTypes = {
  noItemsMessage: PropTypes.string
};

NoItems.defaultProps = {
  noItemsMessage: "No Items..."
};

export default NoItems;
