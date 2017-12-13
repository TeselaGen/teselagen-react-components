import React from "react";
import _withQuery from "./withQuery";
import Loading from "../../Loading";

export default function withQuery(fragment, options = {}) {
  //passing a default LoadingComponent to withQuery
  return _withQuery(fragment, {
    ...options,
    LoadingComp: props => <Loading {...props} />
  });
}
