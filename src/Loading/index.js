import React from "react";
import DNALoader from "../DNALoader";
import "./style.css";

export default function Loading({ loading, style, className, children }) {
  if (loading) {
    return (
      <div
        className={
          "tg-dna-loader-container tg-flex justify-center align-center"
        }
      >
        <DNALoader style={style} className={className} />
      </div>
    );
  } else {
    return children || null;
  }
}
