import React from "react";
import { Dialog, Tab, Tabs, KeyCombo/*, Tooltip*/ } from "@blueprintjs/core";
// import { startCase } from "lodash";
import { getHotkeyProps/*, hotkeysById, comboToLabel*/ } from "../utils/hotkeyUtils";

import "./style.css";

export default function HotkeysDialog(props) {
  if (!props.hotkeySets) {
    console.error('Missing hotkeySets in HotkeysDialog')
    return null;
  }
  const sections = Object.keys(props.hotkeySets);
  return (
    <Dialog
      icon="heat-grid"
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Keyboard Shortcuts"
    >
      <Tabs className="hotkeys-dialog">
        {sections.map(name => (
          <Tab
            key={name}
            id={name}
            title={name}
            panel={
              <div className="table-wrapper">
                <table className="pt-table pt-striped pt-bordered">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Shortcut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(props.hotkeySets[name]).map(id => {
                      const def = getHotkeyProps(props.hotkeySets[name][id], id);
                      return (
                        <tr key={id}>
                          <td>{def.label}</td>
                          <td>
                            <KeyCombo combo={def.combo} />
                            {/* <Tooltip
                              content={comboToLabel(def.combo, false)}
                            >
                              {comboToLabel(def.combo)}
                            </Tooltip> */}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            }
          />
        ))}
      </Tabs>
    </Dialog>
  );
}
