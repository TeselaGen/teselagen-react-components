import React from "react";
import "./style.css";
export default function Loading({ loading, children /* ...rest */ }) {
  if (loading) {
    return (
      <div className={"tg-flex justify-center"}>
        <br />`` ... Loading ...
        <br />
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
