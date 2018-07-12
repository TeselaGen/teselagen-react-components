import React from "react";
import { InputGroup, Button, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { onEnterHelper } from "../utils/handlerHelpers";

const SearchBar = ({
  reduxFormSearchInput,
  setSearchTerm,
  maybeSpinner,
  disabled
}) => {
  return (
    <InputGroup
      disabled={disabled}
      className={classNames(Classes.ROUND, "datatable-search-input")}
      placeholder="Search..."
      {...reduxFormSearchInput.input}
      {...onEnterHelper(e => {
        e.preventDefault();
        setSearchTerm(reduxFormSearchInput.input.value);
      })}
      rightElement={
        maybeSpinner || (
          <Button
            className={Classes.MINIMAL}
            icon="search"
            onClick={() => {
              setSearchTerm(reduxFormSearchInput.input.value);
            }}
          />
        )
      }
    />
  );
};

export default SearchBar;
