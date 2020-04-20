import React from 'react';

import { getTimer, tag } from './time-display.js'; 

const PomodoroDisplay = (props) => {
	const { session, breaks, timer } = props;
	
    if(!timer[0] && !timer[1]){
		tag("beep").play();
	} 

	return (
		<div id="display-container">
			<div id="pomo-display"
				 className={ timer[0] === 0 ? "low" : null }>
				<h3 id="timer-label">
					{ timer[2] }
				</h3>
				<h3 id="time-left">
					{ getTimer(timer) }
				</h3>
			</div>
		</div>
	);
};

export default PomodoroDisplay;