/* eslint react/jsx-no-bind: 0 */
import React from "react";
import { Loading } from "../../../src";
import renderToggle from "../renderToggle";

export default class LoadingComponentDemo extends React.Component {
  state = {
    loading: false,
    bounce: false
  };

  render() {
    const { loading, bounce } = this.state;

    return (
      <div>
        {renderToggle(this, "bounce")}
        <button
          onClick={() => {
            this.setState({ loading: false });
          }}
        >
          stop loading
        </button>
        <Loading loading={loading} bounce={bounce}>
          <button
            onClick={() => {
              this.setState({ loading: true });
            }}
          >
            start loading
          </button>
        </Loading>
      </div>
    );
  }
}
