import {debounce} from 'lodash'

export default function rerenderOnWindowResize(that) {
  that.updateDimensions = debounce(() => {
    if (that.props.disabled) return
    that.setState({ randomRerenderTrigger: Math.random() });
  }, 100);
  const componentDidMount = that.componentDidMount
  const componentWillUnmount = that.componentWillUnmount
  
  that.componentDidMount = (...args)=> {
    componentDidMount(...args)
    window.addEventListener("resize", that.updateDimensions);
  }

  that.componentWillUnmount = (...args)=> {
    componentWillUnmount(...args)
    window.removeEventListener("resize", that.updateDimensions);
  }
} 
