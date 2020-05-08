import React from 'react';
import PropTypes from 'prop-types';

import SetAlarm from './set-alarm/set-alarm.jsx';
import Alarm from './alarm/alarm.jsx';
import Ringing from './ringing.jsx'; 

import alarmWorkerScript from './alarm-worker.js';
import codeToObjectURL from '../workers/web/to-object-url.js';

import setAlarmButtonStyle from './alarm-clock-styles/set-alarm-button.js';

import { alarmSilenceArr } from '../settings/display/settings-data.js'; 

let serialNumber = 0; 

export const alarmWorker = typeof Worker !== "undefined" ? 
				codeToObjectURL(alarmWorkerScript) 
			: 
				undefined;

export default class AppAlarmClock extends React.PureComponent {
	constructor(props){
		super(props);
	}
	
	createAlarmObj(){
		const alarmObj = {
			'serial': serialNumber,
			'time': null, 
			'power': 'on', 
			'label': null, 
			'repeat': false,
			'setRepeat': false,
			'repeat-days': [ 0, 1, 2, 3, 4, 5, 6 ],	
			'vibrate': false, 
			'collapsed': true, 
			'ringtone': this.props.defRingtone,
			'ringtoneSelect': false,
			'ringing': false,
			'dismiss': false, 
			'snooze': null
		};
		
		serialNumber++;
		this.props.addAlarmState(alarmObj);
	}
	
	turnAlarmOFF(obj){				
		const indexOFF = this.props.alarmList.findIndex(item => item.serial === obj.OFF);	
		this.props.powerChangeState(indexOFF, "off");
	}
	
	setAlarmPresent(obj){ 
		let indexAlarmPresent = this.props.alarmList.findIndex(item => item.serial === obj.ALARM_PRESENT);
		
		if(indexAlarmPresent === -1){
			indexAlarmPresent = null;
		}
		
		this.props.setAlarmPresentState(indexAlarmPresent);
	}
	
	setDismissFunction(obj){
		this.props.alarmList.forEach((item, i) => {
			if(item.serial === obj.serial){
				this.props.setDismissState(i, true);
			}
			return item;
		});
	}
	
	loopDismissArray(dismiss){
		dismiss.forEach(item => this.setDismissFunction(item));
	}
	
	workerHandler(){
		alarmWorker.onmessage = (message) => {
			const obj = JSON.parse(message.data);							console.log(obj, "obj")
			if("VOL" in obj){
				return this.props.ringingVolumeChangeState(0.1);
			}
			else if("FORCE_END" in obj){
				return this.props.initRingingState(
					obj["FORCE_END"], 
					false, 
					true
				);
			}   
			else if("OFF" in obj){
				return this.turnAlarmOFF(obj);
			}
			else if("DISMISS" in obj){	
				return this.loopDismissArray(obj["DISMISS"]);
			}
			else if("ALARM_PRESENT" in obj){
				return this.setAlarmPresent(obj);
			}													
			this.props.initRingingState(
				obj.serial, 
				true, 
				false
			); 
		};
			
		alarmWorker.onerror = (error) => {
			console.log(error);
		};
	}
	
	postMessage(obj){
		alarmWorker.postMessage(
			JSON.stringify(
				obj
			)
		);
	}
	
	workerAlarmSettings(){
		let silence = alarmSilenceArr[this.props.silenceAfter];
		
		if(typeof silence === "number"){
			silence *= 60;
		}
		
		//alarmWorker.postMessage(
			//JSON.stringify(
			this.postMessage(
				{
					'silence': silence,
					'increase-vol': +this.props.increaseVol,
					'increase-bool': this.props.increaseVolBool,
					'snooze-duration': +this.props.snoozeDuration * 60,	
					'alarm-vol': +this.props.volume
				}
			)
			//)
		//);
	}
	
	componentDidMount(){ 
		this.props.recordPrevHashState(window.location.hash);
		
		if(alarmWorker !== undefined){
			this.workerAlarmSettings(); 
			this.workerHandler();
		}
	}
	
	componentDidUpdate(){				console.log("compdidupdate")
		if(this.props.alarmListIndexChanged !== null){
			let item;
			
			if(typeof this.props.alarmListIndexChanged === "number"){
				item = this.props.alarmList[this.props.alarmListIndexChanged];
			}
			else {
				item = this.props.alarmListIndexChanged;
			}
			
			this.props.indexToNullState(); 
			
			/* alarmWorker */this.postMessage(
				 //JSON.stringify(
					item
				//)
			); 
		}
	}
	
	alarmToList(create){ 
		if(create === true){
			this.createAlarmObj(); 
		}
		else if(create === false){
			this.props.replaceAlarmTime();
			this.props.setAlarmEditState(null);
		}
		
		this.props.setAlarmState();
	}
	
	checkForRingtoneSelect(alarmList){
		return alarmList.find(alarm => {
			return alarm['ringtoneSelect'] === true || alarm['setRepeat'] === true;
		});
	}
	
	render(){
		return (
			<div id="alarm-clock-container">
				{ 
					typeof this.props.isRinging === "number" ? 
							<Ringing alarmListIndexChanged={ this.props.alarmListIndexChanged }	
									 isRinging={ this.props.isRinging } 
									 alarmList={ this.props.alarmList } 
									 initRingingState={ this.props.initRingingState }
									 initSnoozeState={ this.props.initSnoozeState }
									 volume={ this.props.volume } 
									 volChange={ this.props.volChange }
									 ringingVolumeChange={ this.props.ringingVolumeChangeState }
									 increaseVolBool={ this.props.increaseVolBool }
							/>
						:
							null    
				} 
				<ul id="alarm-ul" 
					style={ this.props.setAlarm ? 
							{ visibility: "hidden" } 
						: 
							this.checkForRingtoneSelect(this.props.alarmList) ? 
									{ overflowY: "hidden" }  
								: 
									null }>
					{
						this.props.alarmList.map((alarm, i) => {
							return (
								<Alarm key={ `alarm-li-${ i }` }
									   alarmObj={ alarm } 
									   moveToMin={ this.props.moveToMin }
									   i={ i }
									   powerChangeState={ this.props.powerChangeState }
									   removeAlarmState={ this.props.removeAlarmState }	
									   replaceAlarmTime={ this.props.replaceAlarmTime }
									   selectRingtoneState={ this.props.selectRingtoneState }
									   booleanPropsChange={ this.props.booleanPropsChange }
									   labelChangeState={ this.props.labelChangeState }
									   selectRepeatDaysState={ this.props.selectRepeatDaysState }
									   checkForRingtoneSelect={ this.checkForRingtoneSelect }
									   alarmList={ this.props.alarmList }
									   setAlarmEditState={ this.props.setAlarmEditState }
									   initRingingState={ this.props.initRingingState }
									   setAlarm={ this.props.setAlarm }
									   setDismissState={ this.props.setDismissState }
									   isRinging={ this.props.isRinging }
									   weekStart={ this.props.weekStart }
								/>
							);
						})
					}
				</ul>
				
				{
					this.props.setAlarm ?
							<SetAlarm setAlarm={ this.props } />
						:
							null
				}
				<button id="new-alarm"
						className={ this.props.setAlarm ? "far fa-bell" : null }
						style={ setAlarmButtonStyle(this.props.setAlarm) }
						onMouseUp={ () => !this.props.setAlarm ? 
							this.props.setAlarmState() 
						: 
							this.alarmToList(
								typeof this.props.alarmEditIndex !== "number"
							) }	
						disabled={ this.checkForRingtoneSelect(this.props.alarmList) || typeof this.props.isRinging === "number" }>
					{ !this.props.setAlarm ? "+" : null  }		
				</button>
			</div>
		);
	}
};

AppAlarmClock.propTypes = {
	alarmList: PropTypes.arrayOf(
		PropTypes.object
	).isRequired,
	currentAlarm: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.number.isRequired,
			PropTypes.number.isRequired,
			PropTypes.string.isRequired
		])
	).isRequired,
	setAlarm: PropTypes.bool.isRequired,
	toMin: PropTypes.bool.isRequired,
	moveToMin: PropTypes.bool.isRequired,
	alarmEditIndex: PropTypes.any,
	alarmListIndexChanged: PropTypes.any,
	alarm_present: PropTypes.any,
	isRinging: PropTypes.any
}