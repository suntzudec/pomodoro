import React from 'react';

export default class NotFound extends React.Component {
	render(){
		return (
			<div id="not-found-container">
				<h1>
					{ "Error " } 
					<span>
						{ "404" }
					</span>
					{", Page not found..." }
				</h1>
			</div>	
		);
	}
};