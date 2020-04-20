import React, { PureComponent } from 'react';

import { alarmWorker } from './app-alarm-clock.jsx';
import ringtoneArray from './alarm/ringtone-array.js';

export default class Ringing extends React.PureComponent { 
	constructor(props){
		super(props);
		
		this.type = true;
		this.loop = 0;
	}
	
	componentDidMount(){
		this.ringtone.play();
	}
	
	componentDidUpdate(){
		const notNull = this.props.alarmListIndexChanged !== null;
		const notAlarmPath = window.location.hash !== "#/alarm-clock";
		
		if(notNull && notAlarmPath){
			let item;
			
			if(typeof this.props.alarmListIndexChanged === "number"){
				item = this.props.alarmList[this.props.alarmListIndexChanged];
			}
			else {
				item = this.props.alarmListIndexChanged;
			}
			
			alarmWorker.postMessage(
				 JSON.stringify(
					item
				)
			); 
		}
	}
	
	pauseAndResetAlarm(){
		this.ringtone.pause();
	}
	
	loopAudio(){
		if(this.loop === 49){
			this.pauseAndResetAlarm();
		}
		else {
			this.loop++;
			this.ringtone.play();
		}
	}
	
	snoozeAlarm(){
		this.props
			.initSnoozeState(
				this.props.isRinging
		);
		this.type = false;
		this.pauseAndResetAlarm();
	}
	
	dismissAlarm(){
		this.type = true;
		this.pauseAndResetAlarm();
	}
	
	render(){			
		return (
			<main className="box-shadow ringing-comp">
				<audio id="ringtone"
					   src={ ringtoneArray[this.props.alarmList[this.props.isRinging]['ringtone']].src }
					   type="audio/mp3"
					   onPause={ (e) => e.target.currentTime !== e.target.duration ? 
								this.props.initRingingState(
									this.props.alarmList[this.props.isRinging]['serial'], 
									false, this.type
								) 
							: 
								this.loopAudio() } 
					   ref={ (elem) => this.ringtone = elem }>
					{ "Your Browser Doesn't Support Audio Tags" }	
				</audio>
				<button id="snooze-button"
						className="box-shadow"
						onMouseUp={ () => this.snoozeAlarm() }>
					{ "snooze" }
				</button>
				<button id="dismiss-button" 
						className="box-shadow"
						onMouseUp={ () => this.dismissAlarm() }>
					{ "dismiss" }
				</button>
			</main>
		);
	}
};