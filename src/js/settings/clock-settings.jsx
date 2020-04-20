import React from 'react';
import maintObj from '../clock/time-maintenance.js';

import { gmtZonePresentation } from './gmt-display.js'; 

const ClockSettings = (props) => {
	return (
		<li id="clock-div">
			<h3 id="clock-title">
				{ "clock" }
			</h3>
			<ul id="clock-settings-list" className="check-box-list">
				<li>
					<h4 id="disp-home-clock" className="checkbox-heading">
						{ "Display home clock" }
					</h4>
					<input type="checkbox" 
						   defaultChecked={ props.cs.homeDisplay }
						   onChange={ () => props.cs.changeHomeClockDispState() }
					/>
					<br />
					<span id="home-clock-desc">
						{ "Display home clock when in different timezone" }
					</span>
					<hr />
				</li>
				<li>
					<h4 id="h-timezone"
						className={ props.cs.homeDisplay === true ? null : "grey" }>
						{ "Home timezone" }
					</h4>
					<button id="grey-button-clock"
							onMouseUp={ () => props.cs.changeSelectState('home') }
						    className={ props.cs.homeDisplay === true ? null : "grey" }
							disabled={ props.cs.homeDisplay === false }>
						{ 
							gmtZonePresentation(
								maintObj.getGeneral("zonesAndGMT")[props.cs.indexObj['home']]
							) 
						}
					</button>
					
				</li>
			</ul>
		</li>
	);
};

export default ClockSettings;