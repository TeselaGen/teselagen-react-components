import React from "react";
import magicDownload from "./magicDownload";

export default class DownloadLink extends React.Component {
  handleDownloadClick = event => {
    const { getFileString, filename, fileString } = this.props;

    let fileType = event.target.innerText;

    let text = getFileString ? getFileString(fileType) : fileString;
    if (text instanceof Promise) {
      text.then(result => magicDownload(result, filename));
    } else {
      magicDownload(text, filename);
    }
    event.stopPropagation();
  };

  render() {
    const { children, filename, getFileString, file, ...rest } = this.props;
    return (
      <a onClick={this.handleDownloadClick} {...rest}>
        {children}
      </a>
    );
  }
}
