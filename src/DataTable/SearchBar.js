import React from "react";
import { InputGroup, Button, Classes, Spinner } from "@blueprintjs/core";
import classNames from "classnames";
import { onEnterHelper } from "../utils/handlerHelpers";

const SearchBar = ({
  reduxFormSearchInput,
  setSearchTerm,
  loading,
  disabled
}) => {
  return (
    <InputGroup
      disabled={disabled}
      loading={loading}
      type="search"
      className={classNames("datatable-search-input", Classes.ROUND)}
      placeholder="Search..."
      {...reduxFormSearchInput.input}
      {...onEnterHelper(e => {
        e.preventDefault();
        setSearchTerm(reduxFormSearchInput.input.value);
      })}
      rightElement={
        loading ? (
          <Spinner size="18" />
        ) : (
          <Button
            minimal
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
