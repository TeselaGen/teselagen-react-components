import React from "react";
import { Dialog, Tab, Tabs, KeyCombo, Classes /*, Tooltip*/
} from "@blueprintjs/core";
// import { startCase } from "lodash";
import { getHotkeyProps /*, hotkeysById, comboToLabel*/
} from "../utils/hotkeyUtils";
import classNames from "classnames";

import "./style.css";

export default function HotkeysDialog(props) {
  if (!props.hotkeySets) {
    console.error("Missing hotkeySets in HotkeysDialog");
    return null;
  }
  var sections = Object.keys(props.hotkeySets);
  return React.createElement(
    Dialog,
    {
      icon: "heat-grid",
      isOpen: props.isOpen,
      onClose: props.onClose,
      title: "Keyboard Shortcuts"
    },
    React.createElement(
      Tabs,
      { className: "tg-hotkeys-dialog" },
      sections.map(function (name) {
        return React.createElement(Tab, {
          key: name,
          id: name,
          title: name,
          panel: React.createElement(
            "div",
            { className: "tg-table-wrapper" },
            React.createElement(
              "table",
              {
                className: classNames(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE_BORDERED)
              },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  React.createElement(
                    "th",
                    null,
                    "Action"
                  ),
                  React.createElement(
                    "th",
                    null,
                    "Shortcut"
                  )
                )
              ),
              React.createElement(
                "tbody",
                null,
                Object.keys(props.hotkeySets[name]).map(function (id) {
                  var def = getHotkeyProps(props.hotkeySets[name][id], id);
                  return React.createElement(
                    "tr",
                    { key: id },
                    React.createElement(
                      "td",
                      null,
                      def.label
                    ),
                    React.createElement(
                      "td",
                      null,
                      React.createElement(KeyCombo, { combo: def.combo })
                    )
                  );
                })
              )
            )
          )
        });
      })
    )
  );
}