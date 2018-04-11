//@flow
import React, { Component } from "react";
import { Button, Classes, Icon } from "@blueprintjs/core";
import classNames from "classnames";
import "./style.css";

type Props = {
  title: string,
  icon: string,
  openTitleElements: boolean
};

type State = {
  open: boolean
};

export default class CollapsibleCard extends Component {
  state = {
    open: true
  };

  renderOpenCard() {
    return this.props.children;
  }

  toggleCardInfo = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    const { open }: State = this.state;
    const {
      title,
      icon,
      openTitleElements,
      noCard = false,
      className,
      style
    }: Props = this.props;
    return (
      <div
        className={classNames({ "tg-card": !noCard, open }, className)}
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 15,
          paddingRight: 15,
          ...style
        }}
      >
        <div className="tg-card-header" style={{ marginBottom: 8 }}>
          <div className="tg-card-header-title">
            {icon && <Icon icon={icon} />}
            <h6
              style={{
                marginBottom: 0,
                marginRight: 10,
                marginLeft: 10
              }}
            >
              {title}
            </h6>
            <div>{open && openTitleElements}</div>
          </div>
          <div>
            <Button
              icon={open ? "minimize" : "maximize"}
              className={classNames(Classes.MINIMAL, "info-btn")}
              onClick={this.toggleCardInfo}
            />
          </div>
        </div>
        {open && this.renderOpenCard()}
      </div>
    );
  }
}
