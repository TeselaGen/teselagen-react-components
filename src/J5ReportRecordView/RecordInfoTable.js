/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */

import React from "react";
import PropTypes from "prop-types";

import "./style.css";

/* NOTE taken from lims */
/* TODO export this and import it from the apps */
class RecordInfoTable extends React.Component {
  static propTypes = {
    /**
     * Array of columns we want to render. Each column is an array of 2-tuples. The
     * first element in the 2-tuple is the label and the second element is the value.
     */
    sections: PropTypes.arrayOf(PropTypes.array).isRequired
  };

  render() {
    const { sections } = this.props;
    const rows = [];
    sections.forEach(recordInfoSection => {
      recordInfoSection.forEach((labelAndValue, i) => {
        if (!labelAndValue) return;
        const [label, value] = labelAndValue;
        rows.push(
          <tr key={label} className={i === 0 ? "section-start" : ""}>
            <td>{label}</td>
            <td>{value}</td>
          </tr>
        );
      });
    });

    return (
      <table className="record-info-table">
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default RecordInfoTable;
