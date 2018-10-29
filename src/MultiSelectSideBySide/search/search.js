import React from "react";

import PropTypes from "prop-types";
import { Icon } from "@blueprintjs/core";

import "./search.css";

const Search = ({ searchPlaceholder, searchIcon, onChange }) => {
  return (
    <div className={"mss-search"}>
      <input
        type="text"
        className={"mss-input"}
        placeholder={searchPlaceholder}
        onChange={onChange}
      />
      <div className={"mss-icon"}>
        <Icon icon={searchIcon} />
      </div>
    </div>
  );
};

export const SearchWithValue = ({
  searchPlaceholder,
  onChange,
  value,
  searchIcon
}) => {
  return (
    <div className={"mss-search"}>
      <input
        value={value}
        type="text"
        className={"mss-input"}
        placeholder={searchPlaceholder}
        onChange={onChange}
      />
      <div className={"mss-icon"}>
        <Icon icon={searchIcon} />
      </div>
    </div>
  );
};

Search.propTypes = {
  searchPlaceholder: PropTypes.string,
  searchIcon: PropTypes.string,
  onChange: PropTypes.func
};

Search.defaultProps = {
  searchPlaceholder: "Search...",
  searchIcon: "search"
};

export default Search;
