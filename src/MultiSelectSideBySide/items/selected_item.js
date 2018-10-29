import React from "react";
import PropTypes from "prop-types";

import { Button } from "@blueprintjs/core";
import ItemLabel from "./item_label";

import "./selected_item.css";

const SelectedItem = ({ item, height }) => (
  <div className={"mss-selected_item"} style={{ height }}>
    <ItemLabel label={item.label} />
    <Button style={{ marginRight: 10 }} minimal icon="cross" />
  </div>
);

SelectedItem.propTypes = {
  item: PropTypes.object,
  height: PropTypes.number
};

SelectedItem.defaultProps = {
  item: {},
  height: 40
};

export default SelectedItem;
