import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import isMobile from "is-mobile";

import "./style.css";
import { Button } from "@blueprintjs/core";

export default ({ demos }) => {
  const [isOpen, setIsOpen] = useState(!isMobile());

  if (!isOpen)
    return (
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        style={{ height: "fit-content",}}
        minimal
        intent="primary"
        icon="menu"
      ></Button>
    );
  return (
    <div className="demo-nav-container">
      <div
        style={{
         
          display: "flex",
          justifyContent: "flex-end",
          width: "100%"
        }}
      >
        <Button
          onClick={() => {
            setIsOpen(false);
          }}
          minimal
          icon="cross"
        ></Button>
      </div>
      <h4>Components</h4>
      {Object.keys(demos).map(function(name, index) {
        const childLinks = demos[name].childLinks || {};
        return (
          <React.Fragment key={index}>
            <NavLink
              exact
              to={`/${name}`}
              activeClassName="demo-nav-link-active"
              className="demo-nav-link"
            >
              {name}
            </NavLink>
            {Object.keys(childLinks).map(childKey => {
              return (
                <NavLink
                  exact
                  key={childKey}
                  to={`/${name}/${childKey}`}
                  activeClassName="demo-nav-link-active"
                  className="demo-nav-link nested"
                >
                  {childKey}
                </NavLink>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
