import React from 'react';

const TimerSettings = (props) => {
	return (
		<li>
			<h3>
				{ "timers" }
			</h3>
			<ul id="timer-settings-list">
				<li>
					<h4>
						{ "Default ringtone" }
					</h4>
					<button onMouseUp={ () => props.changeSelectState('timers') }>
						{ props.tone.name }
					</button>
					<hr />
				</li>
				<li>
				</li>
			</ul>
		</li>	
	);
};

export default TimerSettings;