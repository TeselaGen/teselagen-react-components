import React from "react";
import {DownloadLink} from '../../../src';

export default class DownloadLinkDemo extends React.Component {
	render() {
		return (
			<div>
				<DownloadLink filename={'tmoney.txt'} fileString={'I am the file content'}>
					<button> Download Some Sheeee</button>
				</DownloadLink>

				or 

				<DownloadLink filename={'tmoney.txt'} getFileString={() => {
						return 'I am also the file content'
					}}>
					<button> Download Some Different Stuff</button>
				</DownloadLink>

			</div>
		);

	}
}
