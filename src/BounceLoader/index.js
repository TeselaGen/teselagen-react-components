/* taken from http://tobiasahlin.com/spinkit/ */
import React from "react";
import classNames from "classnames";
import "./style.css";

export default function BounceLoader({ style, className }) {
  return (
    <div className={classNames("tg-bounce-loader", className)} style={style}>
      <div class="rect1" />
      <div class="rect2" />
      <div class="rect3" />
      <div class="rect4" />
      <div class="rect5" />
    </div>
  );
}
