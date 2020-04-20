import React from 'react'

import assembleTimeData from '../world-clock/process-time-data.js'; 
import { formatTime, formatDate } from './format-clock-heading.js';

import Alarm_Clock_Disp from './alarm-clock-disp.jsx';

const ClockHeading = (props) => {	
	return (
		<div id="heading-container">
			<h1 id="heading-time">
				{ formatTime(props.time) }
			</h1>
			<h3 id="heading-date">
				{ formatDate(props.time) }
			</h3>
				{
					props.alarm_present ? (
							<Alarm_Clock_Disp alarm_present={ props.alarm_present } />
						) : (
							null
						)
				}
			<hr />
			<ul id="selected-list">
				{
					props.localList.length ?
						props.localList.map((zone, i) => {
							const time_date = assembleTimeData(zone);
							return (
								<li key={ i }>
									{ time_date[0] }&#32;&#32;{ time_date[1] }&#32;&#32;{ time_date[2] }, { time_date[3] }
								</li>
							);
						})	
					: 
						null
				}
			</ul>
		</div>
	);
};

export default ClockHeading;
