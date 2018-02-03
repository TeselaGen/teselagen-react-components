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
          const childLinks = demos[name].childLinks;
          let menu;
          if (childLinks) {
            menu = (
              <Menu>
                {Object.keys(childLinks).map(childKey => {
                  return (
                    <Link
                      key={childKey}
                      to={`/${name}/${childKey}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <div className={"pt-popover-dismiss pt-menu-item"}>
                        {childKey}
                      </div>
                    </Link>
                  );
                })}
              </Menu>
            );
          }
          console.log("!menu:", !menu);
          return (
            <Popover
              key={index}
              isDisabled={!menu}
              interactionKind={PopoverInteractionKind.HOVER}
              position={Position.RIGHT}
              className="demo-nav-popover"
              content={menu}
            >
              <NavLink
                to={`/${name}/index`}
                activeClassName="demo-nav-link-active"
                className="demo-nav-link"
              >
                {name}
              </NavLink>
            </Popover>
          );
        })}
      </div>
    );
  }
}

export default DemoNav;
