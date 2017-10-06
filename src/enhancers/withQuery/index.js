import _withQuery from "./withQuery";
import Loading from "../../Loading";

export default function withQuery(fragment, options = {}) {
  //passing a default LoadingComponent to withQuery
  //we need to be able to use withQuery on the backend so can't have the loading component importing .css files
  return _withQuery(fragment, { ...options, LoadingComp: Loading });
}
