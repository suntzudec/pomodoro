import React from 'react';

import { addMinuteLabel } from '../display/select-functions.js';
import { weekStart } from '../display/settings-data.js';

const AlarmSettings = (props) => {
	return (
		<li>
			<h3>
				{ "alarms" }
			</h3>
			<ul id="alarm-settings-list" 
					className="check-box-list">
				<li>
					<h4>
						{ "Default ringtone" }
					</h4>
					<button onMouseUp={ () => props.changeSelectState('alarm') }>
						{ props.tone.name }
					</button>
					<hr />
				</li>
				<li>   
					<h4>
						{ "Silence after" }
					</h4>
					<button onMouseUp={ () => props.changeSelectState('silence') }>
						{ addMinuteLabel(props.silence) }
					</button>
					<hr />
				</li>
				<li>
					<h4>
						{ "Snooze duration" }
					</h4>
					<button onMouseUp={ () => props.changeSelectState('snooze') }>
						{ addMinuteLabel(+props.valueObj['snooze']) }
					</button>
					<hr />	
				</li>
				<li>
					<h4>
						{ "Alarm volume" }
					</h4>
					<button onMouseUp={ () => props.changeSelectState('alarm-vol') }>
						{ props.valueObj['alarm-vol'] }
					</button>
					<hr />
				</li>    
				<li>
					<h4 id="incr-vol-alarm" 
							className={ `checkbox-heading${ props.incr_vol === true ? '' : ' grey' }` }>
						{ "Increase volume every" }
					</h4>
					<input type="checkbox" 
						   defaultChecked={ props.incr_vol }
						   onChange={ () => props.increaseVolumeState('alarm') } 
					/>
					<br />
					<button id="grey-button-alarm"
							onMouseUp={ () => props.changeSelectState('increase-vol') }
							className={ props.incr_vol === true ? null : "grey" }
							disabled={ props.incr_vol === false }>
						{ `${ props.valueObj['increase-vol'] } seconds` }
					</button>
					<hr />
				</li>
				<li>
					<h4>
						{ "Start week on" }
					</h4>
					<button onMouseUp={ () => props.changeSelectState('week-start') }>
						{ weekStart[props.indexObj['week-start']] }
					</button>
				</li>
			</ul>
		</li>	
	);
};

export default AlarmSettings;