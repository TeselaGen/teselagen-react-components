import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import "./style.css";
import {
  Popover,
  Position,
  Menu,
  PopoverInteractionKind
} from "@blueprintjs/core";

// {Object.keys(childLinks).map(function(linkName, index) {
//   return (
//     <NavLink
//       key={index}
//       to={`/${name}/${linkName}`}
//       style={{ color: "inherit", textDecoration: "none" }}
//     >
//       <div
//         style={{ borderLeft: index !== 0 && "2px solid grey" }}
//         className={"pt-popover-dismiss pt-menu-item"}
//       >
//         {linkName} demo
//       </div>
//     </NavLink>
//   );
// })}

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
                to={`/${name}/index`}
                activeClassName="demo-nav-link-active"
                className="demo-nav-link"
              >
                {name}
              </NavLink>
              {Object.keys(childLinks).map(childKey => {
                return (
                  <NavLink
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
