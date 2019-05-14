/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import Color from "color";
import React, { Component } from "react";
import { Icon } from "@blueprintjs/core";
import { last } from "lodash";
import "./style.css";

class AvatarIcon extends Component {
  render() {
    const { user, size = 40, style = {}, className, ...rest } = this.props;
    const { avatarFile, id, firstName = "", lastName = "" } = user || {};
    const { path } = avatarFile || {};
    const trimmedPath =
      localStorage.getItem("serverURI") +
      "/user_uploads/" +
      last((path || "").split("/"));

    const styleToPass = {
      width: size,
      height: size,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style
    };

    const initials =
      firstName.length > 0 && lastName.length > 0
        ? firstName[0] + lastName[0]
        : null;

    return (
      <div className={"tg-avatar-button " + className} {...rest}>
        {path ? (
          <img style={{ ...styleToPass }} alt="avatar" src={trimmedPath} />
        ) : (
          <div
            className="tg-flex align-center justify-center"
            style={{
              ...styleToPass,
              fontSize: size / 2.7,
              backgroundColor: genColor(id),
              color: "white",
              cursor: "pointer"
            }}
          >
            {initials || <Icon icon="person" iconSize={14} />}
          </div>
        )}
      </div>
    );
  }
}

export default AvatarIcon;

function genColor(seed) {
  let color = Math.floor(Math.abs(Math.sin(seed) * 16777215) % 16777215);
  color = color.toString(16);
  // pad any colors shorter than 6 characters with leading 0s
  while (color.length < 6) {
    color = "0" + color;
  }
  //NOTE: SD use these "Qualitative colors" instead (from blueprint)??
  // ["#2965CC", "#29A634", "#D99E0B", "#D13913", "#8F398F", "#00B3A4", "#DB2C6F", "#9BBF30", "#96622D", "#7157D9"]
  color = "#" + color;
  color = Color(color);
  if (color.isLight()) {
    color = color.negate();
  }

  return color.hsl().string();
}

// function getHexColor(seed) {
//   const newHex = Math.floor((Math.abs(Math.sin(seed) * 16777215)) % 16777215).toString(16);
//   console.log('newHex:', newHex)
//   return newHex.toString()
// }
