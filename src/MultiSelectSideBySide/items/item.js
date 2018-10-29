import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { Checkbox } from "@blueprintjs/core";
import ItemLabel from "./item_label";

import "./item.css";

const Item = ({
  item,
  height,
  onClick,
  withBorder,
  checked,
  indeterminate,
  disabled
}) => (
  /* eslint-disable no-useless-computed-key*/

  <div
    className={classnames("mss-item", {
      ["mss-with_border"]: withBorder,
      ["mss-selected"]: checked,
      ["mss-disabled"]: disabled
    })}
    style={{ height }}
    onClick={e => {
      if (onClick) {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }
    }}
    /* eslint-enable no-useless-computed-key*/
  >
    <Checkbox
      style={{
        marginTop: "10px",
        marginLeft: "10px"
      }}
      type="checkbox"
      color="primary"
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
    />
    <ItemLabel label={item.label} />
  </div>
);

Item.propTypes = {
  item: PropTypes.object,
  height: PropTypes.number,
  withBorder: PropTypes.bool,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool
};

Item.defaultProps = {
  item: {},
  height: 40,
  withBorder: false,
  checked: false,
  indeterminate: false,
  disabled: false
};

export default Item;
