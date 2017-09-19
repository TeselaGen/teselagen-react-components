import React from "react";

export default class DownloadLink extends React.Component {
  propTypes: {
    filename: React.PropTypes.string,
    getFileString: React.PropTypes.func,
    fileString: React.PropTypes.string
  };

  getDefaultProps() {
    return {
      filename: "file.txt",
      fileString: "File text goes here"
    };
  }

  handleDownloadClick = event => {
    function magicDownload(text, fileName) {
      let blob = new Blob([text], {
        type: "text/csv;charset=utf8;"
      });

      // create hidden link
      let element = document.createElement("a");
      document.body.appendChild(element);
      element.setAttribute("href", window.URL.createObjectURL(blob));
      element.setAttribute("download", fileName);
      element.style.display = "";

      element.click();

      document.body.removeChild(element);
      event.stopPropagation();
    }
    const { getFileString, filename, fileString } = this.props;

    let fileType = event.target.innerText;

    let text = getFileString ? getFileString(fileType) : fileString;
    if (text instanceof Promise) {
      text.then(result => magicDownload(result, filename));
    } else {
      magicDownload(text, filename);
    }
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
