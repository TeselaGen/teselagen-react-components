import React from "react";
import Loading from '../../../src';

export default class LoadingComponentDemo extends React.Component {
	render() {
		var {loading} = this.state || {}

		return (
			<div>
				<button onClick={()=>{
					this.setState({loading: false})
				}}>
					stop loading
				</button>
			<Loading loading={loading}>
				<button onClick={()=>{
					this.setState({loading: true})
				}}> start loading</button>
			</Loading>
			</div>
		);

	}
}
