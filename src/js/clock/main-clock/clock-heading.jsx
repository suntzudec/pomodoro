import React from 'react'

import { assembleTimeData, homeDisplayConditions } from '../world-clock/process-time-data.js'; 
import { formatTime, formatDate, formatSelectedList } from './format-clock-heading.js';

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
					props.alarm_present ? 
							<Alarm_Clock_Disp alarm_present={ props.alarm_present } 
											  snoozeDuration={ props.snoozeDuration }
							/>
					    : 
							null
						
				}
			<hr />
			<ul id="selected-list">
				{
					homeDisplayConditions(props.homeDisplay, props.homeIndex)
				}
				{
					props.localList.length ?
						props.localList.map((zone, i) => {
							const time_date = assembleTimeData(zone); 
							return formatSelectedList(time_date, i);
						})	
					: 
						null
				}
			</ul>
		</div>
	);
};

export default ClockHeading;