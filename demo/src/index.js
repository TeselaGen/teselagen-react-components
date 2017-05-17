import './style.css';
import React from "react";
import { render } from "react-dom";
import DataTableDemo from './DataTableDemo';

let Demo = function () {
	return (
			<div>
				<DataTableDemo></DataTableDemo>
			</div>
	);
	
}

render(<Demo />, document.querySelector("#demo"));
