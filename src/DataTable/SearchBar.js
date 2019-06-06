import React from "react";
import { Button, Classes, Spinner } from "@blueprintjs/core";
import classNames from "classnames";
import { onEnterHelper } from "../utils/handlerHelpers";
import { InputField } from "../FormComponents";

const SearchBar = ({
  reduxFormSearchInput,
  setSearchTerm,
  loading,
  searchMenuButton,
  disabled
}) => {
  return (
    <InputField
      autoFocus
      disabled={disabled}
      loading={loading}
      type="search"
      name="reduxFormSearchInput"
      className={classNames("datatable-search-input", Classes.ROUND)}
      placeholder="Search..."
      {...onEnterHelper(e => {
        e.preventDefault();
        setSearchTerm(reduxFormSearchInput);
      })}
      rightElement={
        loading ? (
          <Spinner size="18" />
        ) : (
          searchMenuButton || (
            <Button
              minimal
              icon="search"
              onClick={() => {
                setSearchTerm(reduxFormSearchInput);
              }}
            />
          )
        )
      }
    />
  );
};

export default SearchBar;
