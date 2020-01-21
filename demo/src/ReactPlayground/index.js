import classNames from "classnames";
import React from "react";
import { Button, Classes } from "@blueprintjs/core";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import * as trc from "../../../src";
import "./prism.css";
import "./style.css";

const scope = {
  ...trc,
  Button
};

export default class Playground extends React.Component {
  render() {
    const { codeText, scope: extraScope, noLiveCode } = this.props;

    return (
      <LiveProvider
        code={codeText}
        scope={{
          ...scope,
          ...extraScope
        }}
        mountStylesheet={false}
        noInline={codeText.includes("render(")}
      >
        <div
          className={classNames(
            Classes.CARD,
            Classes.ELEVATION_2,
            this.props.exampleClassName
          )}
        >
          <LivePreview />
        </div>
        <LiveError />
        {!noLiveCode && <div className="tg-code-editor">
          <LiveEditor />
        </div>}
      </LiveProvider>
    );
  }
}
