import React from "react";
import DNALoader from "../DNALoader";
import "./style.css";

export default class Loading extends React.Component {
  state={
    longerThan200MS: false
  }
  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({
        longerThan200MS: true
      })
    }, 200);
  }
  
  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  render () {
    const { loading, style, className, children } = this.props
    const {longerThan200MS} = this.state
    if (loading || !children) {
      if (!longerThan200MS) {
        return <div className={'tg-flex justify-center align-center'}></div>
      }
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
}
