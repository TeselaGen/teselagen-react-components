import React from "react";
import { isEqual } from "lodash";
import { withQuery as _withQuery } from "@teselagen/apollo-methods";
import Loading from "../../Loading";

const withLoadingHoc = options => WrappedComponent => {
  return class WithLoadingComp extends React.Component {
    UNSAFE_componentWillReceiveProps(nextProps) {
      const { showError, queryNameToUse } = options;
      if (
        showError &&
        nextProps.data &&
        this.props.data &&
        !isEqual(nextProps.data.error, this.props.data.error)
      ) {
        const error = nextProps.data.error;
        if (this.props.loggedIn) {
          console.error("error:", error);
          window.toastr.error(`Error loading ${queryNameToUse}`);
        } else {
          console.warn("Error supressed, not logged in");
        }
      }
    }
    render() {
      const { showLoading, inDialog } = options;
      const { data = {} } = this.props;
      const { loading } = data;
      if (loading && showLoading) {
        const bounce = inDialog || showLoading === "bounce";
        return <Loading inDialog={inDialog} bounce={bounce} />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default function withQuery(fragment, options = {}) {
  //passing a default LoadingComponent to withQuery
  return _withQuery(fragment, {
    ...options,
    withLoadingHoc: withLoadingHoc,
    LoadingComp: props => <Loading {...props} />
  });
}
