import './style.css';
import React from "react";
import { render } from "react-dom";
import DataTableDemo from './DataTableDemo/index.js';

let Demo = function () {
	return (
			<div>
			<div>yup</div>
				<DataTableDemo></DataTableDemo>
			</div>
	);
	
}

render(<Demo />, document.querySelector("#demo"));
