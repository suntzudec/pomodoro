import * as types from './action-types.js';
import { State } from '../../state.js';

import { checkForDismissOnReplaceCase } from '../alarm/alarm-helpers.js'; 
										
const alarmClockReducer = (state = State['alarm-clock'], action) => {
	
	const alarmListIndexChanged = (value) => {				console.log("alarmListIndexChanged:", value)
		state['alarmListIndexChanged'] = value; 
	};
	
	const isRingingChange = (value, ended) => {
		if(value === null && ended === true){
			const index = state['isRinging'];
			state['alarm-list'][index]['snooze'] = null;
			
			alarmListIndexChanged({
				"RINGING_ENDED": state['alarm-list'][index]
			});
		} 
		else {		
			alarmListIndexChanged(null);
		}		
		
		state['isRinging'] = value;					console.log('isRinging: ', state['isRinging'])
	};
	
	switch(action.type){
		case types.SNOOZE:
			state['alarm-list'][action.index]['snooze'] = +(Date.now() / 1000).toFixed(0);
			
			alarmListIndexChanged(action.index); 
			
			break;
		
		case types.DISMISS:				
				
		console.log("DISMISS", action.index, action.bool)
			state['alarm-list'][action.index]['dismiss'] = action.bool;
			
			if(!action.bool){
				alarmListIndexChanged({ 
					"DISMISS": state['alarm-list'][action.index].serial 
				});
			}
			else {
				alarmListIndexChanged(action.index);
			}	
			
			break;
		
		case types.ALARM_PRESENT:							console.log("ALARM_PRESENT", action.index)
			state['alarm_present'] = state['alarm-list'][action.index] || null;
			
			alarmListIndexChanged(null);
			
			break;
		
		case types.ADDALARM: 								console.log("ADDALARM")
			action.obj['time'] = state['current-alarm'].slice(); 
			state['alarm-list'] = [ ...state['alarm-list'], action.obj ];
			
			alarmListIndexChanged(state['alarm-list'].length - 1);
			
			break; 
		
		case types.EDITALARMTIME:  							console.log("EDITALARMTIME")
		
			if(typeof state['alarmEditIndex'] === "number"){
				const i = state['alarmEditIndex'];
				
				state['alarm-list'][i]['time'] = state['current-alarm'].slice();
				state['alarm-list'][i]['snooze'] = null;
				
				if(state['alarm-list'][i]['dismiss'] === true){
					state['alarm-list'][i]['dismiss'] = checkForDismissOnReplaceCase(state['alarm-list'][i]['time']);
				}
				
				alarmListIndexChanged({
					"REPLACE": state['alarm-list'][i] 
				}); 
			}
			
			break;  
			
		case types.SETALARMEDIT: 							console.log("SETALARMEDIT")
			state['alarmEditIndex'] = action.value;// console.log(action, "for AlarmEditIndex !!")
			
			if(typeof action.value === "number"){
				state['setAlarm'] = true;
				state['current-alarm'] = state['alarm-list'][action.value]['time'].slice();
			}
		
			break;
		 
		case types.REPEATDAYS: 								//console.log("REPEATDAYS")
			let repeatDays = state['alarm-list'][action.index]['repeat-days'];
			let target = repeatDays.indexOf(action.liIndex);
			
				state['alarm-list'][action.index]['repeat-days'] = target !== -1 ? 
						repeatDays.slice(0, target)
							.concat(repeatDays.slice(target + 1))
					:
						repeatDays.concat([ 
							action.liIndex 
						]).sort();
			
				alarmListIndexChanged(action.index); 
				
			break;

		case types.LISTPOWERCHANGE: 							//console.log("LISTPOWERCHANGE")
			state['alarm-list'][action.index]["power"] = action.value;
			
			const obj = state['alarm-list'][action.index];
			obj['snooze'] = null;
			
			if(obj["dismiss"] === true){
				state['alarm-list'][action.index]["dismiss"] = false;
			}
			
			alarmListIndexChanged(action.index);
			break;

		case types.TOMIN: 										//console.log("TOMIN")
			state['toMin'] = typeof action.value === "boolean" ? 
					action.value 
				: 
					!state['toMin'];
					
			alarmListIndexChanged(null);
			
			break;

		case types.SETALARM: 								//	console.log("SETALARM")
			state['setAlarm'] = !state['setAlarm'];
			
			if(state['setAlarm'] === false && typeof state['alarmEditIndex'] === "number"){
				state['alarmEditIndex'] = null;
			}
			if(state['setAlarm'] === true){
				alarmListIndexChanged(null);
			}
			
			break;

		case types.REMOVEALARM: 								//console.log("REMOVEALARM")
			const serial = state['alarm-list'][action.index].serial;
			
			state['alarm-list'] = state['alarm-list']
				.slice(0, action.index)
				.concat(state['alarm-list']
				.slice(action.index + 1));	
			
			alarmListIndexChanged({ 
				"REMOVE": serial 
			});
			
			break;

		case types.MOVETOMIN: 									//console.log("MOVETOMIN")
			state['moveToMin'] = typeof action.value === "boolean" ? 
					action.value 
				: 
					!state['moveToMin'];
					
			alarmListIndexChanged(null);
			break;

		case types.SELECTRINGTONE: 								//console.log("SELECTRINGTONE")
			state['alarm-list'][action.liIndex]['ringtone'] = action.index;
			
			alarmListIndexChanged(null);
			break;
		
		case types.BOOLEANLISTPROPS: 							//console.log("BOOLEANLISTPROPS")
			const excludedProps = [ 
				"collapsed", "vibrate", 
				"setRepeat", "ringtoneSelect" 
			];
			
			state['alarm-list'][action.index][action.prop] = !state['alarm-list'][action.index][action.prop];
			
			if(action.prop === "setRepeat"){
				let repeat = state['alarm-list'][action.index]['repeat'];
				let repDays = state['alarm-list'][action.index]['repeat-days'];
				
				if(repeat === true && !repDays.length){
					state['alarm-list'][action.index]['repeat'] = false;
				}
			} 
			if(excludedProps.indexOf(action.prop) === -1){
				alarmListIndexChanged(action.index); 
			}
			else {
				alarmListIndexChanged(null); 
			}
			
			break;
			
		case types.LABELCHANGE:									//console.log("LABELCHANGE")
			state['alarm-list'][action.index]['label'] = action.str; 
			
			alarmListIndexChanged(null);
			break;
		
		case types.CURRENTALARM:								console.log("CURRENTALARM")
			state['current-alarm'][action.index] = action.value; 
			
			alarmListIndexChanged(null);
			break;
			
		case types.RINGING:										console.log("RINGING")
			const indx = state['alarm-list'].findIndex(obj => obj.serial === action.serial);
			const node = state['alarm-list'][indx];
			node['ringing'] = action.bool;
			
			if(!action.bool){
				if(action.ended){		
					node['dismiss'] = action.bool;		//console.log(node['dismiss'], state['alarm-list'][indx]['dismiss'], "dismissed")
				}		
				else {
					node['dismiss'] = !action.ended;
				} 
				
				isRingingChange(null, action.ended);
			}
			else {
				isRingingChange(indx);	
			}
			
			break;
		
		default: 
			return state;
	}
	
	return Object.assign(
		{ }, 
		state,
		state['alarm-list']	
	);
};

export default alarmClockReducer;