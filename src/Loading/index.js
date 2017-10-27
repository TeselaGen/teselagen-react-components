import React from "react";
import DNALoader from "../DNALoader";
import "./style.css";

export default function Loading({
  loading,
  style,
  className,
  children /* ...rest */
}) {
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
    // return ( //tnr: commenting this out for the time being. Going with a simple static loading message
    //   <Spinner
    //     intent={Intent.PRIMARY}
    //     className={"tg-loading-spinner"}
    //     {...rest}
    //   />
    // );
  } else {
    return children || null;
  }
}
