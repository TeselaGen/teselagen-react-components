import React, { useState } from "react";
import { Switch, Button } from "@blueprintjs/core";
import InfoHelper from "../../src/InfoHelper";
import { lifecycle, mapProps } from "recompose";
import { omit } from "lodash";
import ReactMarkdown from "react-markdown";
import { popoverOverflowModifiers } from "../../src";

const omitProps = keys => mapProps(props => omit(props, keys));
const _Switch = omitProps(["didMount"])(Switch);
const EnhancedSwitch = lifecycle({
  componentDidMount() {
    return this.props.didMount();
  }
})(_Switch);

export default function renderToggle({ that, type, ...rest }) {
  const setToggle = val =>
    that.setState({
      [type]: val
    });
  const isToggledOn = (that.state || {})[type];
  return renderToggleInner({
    type,
    setToggle,
    isToggledOn,
    ...rest
  });
}

export function renderToggleInner({
  isButton,
  setToggle,
  isToggledOn,
  type,
  label,
  onClick,
  info,
  description,
  hook,
  ...rest
}) {
  let toggleOrButton;
  const labelOrText = label ? <span>{label}</span> : type;
  const sharedProps = {
    "data-test": type || label,
    style: { marginTop: 4 },
    label: labelOrText,
    text: labelOrText,
    ...rest
  };
  if (isButton) {
    toggleOrButton = (
      <Button
        {...{
          ...sharedProps,
          onClick: onClick || hook
        }}
      />
    );
  } else {
    toggleOrButton = (
      <EnhancedSwitch
        {...{
          ...sharedProps,
          didMount: () => {
            hook && hook(!!isToggledOn);
          },
          checked: isToggledOn,
          onChange: () => {
            hook && hook(!isToggledOn);
            setToggle(!isToggledOn);
          }
        }}
      />
    );
  }
  return (
    <div style={{ display: "flex" }} className="toggle-button-holder">
      {toggleOrButton}
      {(description || info) && (
        <InfoHelper
          isPopover
          popoverProps={{
            modifiers: popoverOverflowModifiers
          }}
          style={{ marginRight: -15, marginTop: 5, marginLeft: 5 }}
        >
          <ReactMarkdown source={description || info} />
        </InfoHelper>
      )}
    </div>
  );
}

export function useToggle({ type, ...rest }) {
  const [isToggledOn, setToggle] = useState(false);
  const comp = renderToggleInner({
    type,
    setToggle,
    isToggledOn,
    ...rest
  });
  return [isToggledOn, comp];
}
