import React from 'react';
import ringtoneArray from './ringtone-array.js';

const AlarmRingtoneSelect = (props) => {
	
	let ringindex = props.alarmObj['ringtone'];
	
	const selectRingTone = () => {
		if(ringindex > -1){
			props.selectRingtoneState(ringindex, props.i);
			props.booleanPropsChange(props.i, 'ringtoneSelect');
		}
	};
		
	return (
		<div id="ringtone-cont">
			<span id="ringtone-x"
				  onMouseUp={ () => props.booleanPropsChange(props.i, 'ringtoneSelect') }>
				{ "X" }
			</span>
			<ul id="ringtone-ul">
				{
					ringtoneArray.map((rtone, i) => {
						return (
							<li key={ `rtone${ i }` }>
								<input id={ `rtone${ i }-radio` } 
									   name="rtone-group" 
									   type="radio" 
									   defaultChecked={ i === props.alarmObj['ringtone'] }
									   onChange={ () => ringindex = i }
								/>
								<label htmlFor={ `rtone${ i }-radio` }>
									{ rtone["name"] }
								</label>
							</li>
						);
					}) 
				}
			</ul>
			<button className="box-shadow"
					onMouseUp={ () => selectRingTone() }>
				{ "okay" }
			</button>
		</div>
	);
};

export default AlarmRingtoneSelect;