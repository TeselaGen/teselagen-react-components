import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

class DemoNav extends Component {
  render() {
    const { demos } = this.props;
    return (
      <div className="demo-nav-container">
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
  }
}

export default DemoNav;
