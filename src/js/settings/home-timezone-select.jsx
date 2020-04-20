import React from 'react';

import maintObj from '../clock/time-maintenance.js';

import gmtZonePresentation from './gmt-display.js';

const HomeTimezoneSelect = (props) => {
	return (
		<section id="time-zone-section">
			<ul id="time-zone-list">
				{
					maintObj.getGeneral('zonesAndGMT').map((zone, i) => {
						return (
							<li key={ `settings-zone-${ i }-li`}>
								<input type="radio" 
									   defaultChecked={ i === props.tz.homeIndex } 
								/>
								<label key={ `settings-zone-${ i }-label` }>	   
									{
										gmtZonePresentation(zone)
									}
								</label>	
							</li>
						);
					})
				}
			</ul>
			<button onMouseUp={ () => props.tz.changeHomeSelectState() }>
				{ "okay" }
			</button>
		</section>
	);
};

export default HomeTimezoneSelect;