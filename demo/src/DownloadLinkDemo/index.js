import React from "react";
import {} from '@blueprintjs/core';
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

					<span>
						* Note that the underlying function magicDownload can also be imported and used like: 
						import magicDownload from 'teselagen-react-components'
						magicDownload('I am some content','file1.csv')
					</span>
			</div>
		);

	}
}
