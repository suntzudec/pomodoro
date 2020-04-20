import React from 'react';
import { alarmDaysLabel } from '../../alarm-clock/alarm/alarm-helpers.js';

const format_alarm_present = (alarm_present) => {
	let min = alarm_present[1].toString().length === 1 ? 
			`0${ alarm_present[1] }`
		:
			alarm_present[1];
	return `${ alarm_present[0] }:${ min } ${ alarm_present[2] }`;		
};

const Alarm_Clock_Disp = (props) => {
	return (
		<h3 id="alarm_pres">
			{ format_alarm_present(props.alarm_present['time']) }&#32;{ alarmDaysLabel(props.alarm_present, true) }
			<span className="fas fa-bell" />
		</h3>
	);
};

export default Alarm_Clock_Disp;