import React from "react";
import moment from "moment";
import { Classes } from "@blueprintjs/core";
import classNames from "classnames";

function TimelineEvent({ date, children }) {
  return (
    <div className="tg-timeline-event">
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="tg-timeline-circle" />
        {children}
        <div
          style={{ marginLeft: 5 }}
          className={classNames(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}
        >
          ({moment(date).fromNow()})
        </div>
      </div>
    </div>
  );
}

export default TimelineEvent;
