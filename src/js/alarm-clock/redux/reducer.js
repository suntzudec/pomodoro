import * as types from './action-types.js';
import { State } from '../../state.js';

import { checkForDismissOnReplaceCase, checkForDismissOnRepeatDaysChange } from '../alarm/alarm-helpers.js'; 
										
const alarmClockReducer = (state = State['alarm-clock'], action) => {
	const alarmListIndexChanged = function(value){	
		state['alarmListIndexChanged'] = value; 
	};
	
	const isRingingChange = function(value, ended){
		if(value === null && ended){
			const index = state['isRinging'];
			state['alarm-list'][index]['snooze'] = null;
		} 	
		
		state['isRinging'] = value;
	};
	
	switch(action.type){
		case types.TO_NULL:
			state['alarmListIndexChanged'] = null;
			
			break;
		
		case types.VOL_CHANGE:
			if(action.value > 0){
				state['vol-change'] += action.value;
				state['vol-change'] = Math.round(state['vol-change'] * 100) / 100;
			}
			else {
				state['vol-change'] = action.value;
			}
			
			break; 
		
		case types.SNOOZE:	console.log("SNOOZE")
			state['alarm-list'][action.index]['snooze'] = +(Date.now() / 1000).toFixed(0);
			state['alarm-list'][action.index]['ringing'] = false; 
			
			alarmListIndexChanged(
				action.index
			); 
			
			break;
		
		case types.DISMISS:							console.log("DISMISS " + action.bool)
			state['alarm-list'][action.index]['dismiss'] = action.bool;
			
			if(!action.bool){
				alarmListIndexChanged({ 
					"DISMISS": state['alarm-list'][action.index].serial 
				});
			}
			else {
				alarmListIndexChanged(
					action.index
				);
			}	
			
			break;
		
		case types.ALARM_PRESENT:							console.log("ALARM_PRESENT", action.index)
			state['alarm_present'] = state['alarm-list'][action.index] || null;
			
			break;
		
		case types.ADDALARM: 								console.log("ADDALARM")
			action.obj['time'] = state['current-alarm'].slice(); 
			state['alarm-list'] = [ 
				...state['alarm-list'], 
				action.obj 
			];
			
			alarmListIndexChanged(
				state['alarm-list'].length - 1
			);
			
			break; 
		
		case types.EDITALARMTIME:  							console.log("EDITALARMTIME")
			if(typeof state['alarmEditIndex'] === "number"){
				const i = state['alarmEditIndex'];
				
				state['alarm-list'][i]['time'] = state['current-alarm'].slice();
				state['alarm-list'][i]['snooze'] = null;
				state['alarm-list'][i]['power'] = 'on';
				
				if(state['alarm-list'][i]['dismiss'] === true){
					state['alarm-list'][i]['dismiss'] = checkForDismissOnReplaceCase(state['alarm-list'][i]['time']);
				}
				
				alarmListIndexChanged({
					"REPLACE": state['alarm-list'][i] 
				}); 
			}
			
			break;  
			
		case types.SETALARMEDIT: 							console.log("SETALARMEDIT")
			state['alarmEditIndex'] = action.value;
			
			if(typeof action.value === "number"){
				state['setAlarm'] = true;
				state['current-alarm'] = state['alarm-list'][action.value]['time'].slice();
			}
		
			break;
		 
		case types.REPEATDAYS: 								console.log("REPEATDAYS")
			let repeatDays = state['alarm-list'][action.index]['repeat-days'];
			let target = repeatDays.indexOf(action.liIndex);
			
			state['alarm-list'][action.index]['repeat-days'] = target !== -1 ? 
					repeatDays.slice(0, target)
						.concat(repeatDays.slice(target + 1))
				:
					repeatDays.concat([ 
						action.liIndex 
					]).sort();
		
			alarmListIndexChanged(
				action.index
			); 
				
			break;

		case types.LISTPOWERCHANGE: 							console.log("LISTPOWERCHANGE")
			state['alarm-list'][action.index]["power"] = action.value;
			
			const obj = state['alarm-list'][action.index];
			obj['snooze'] = null;
			
			if(obj["dismiss"] === true){
				obj["dismiss"] = false;
			}
			
			alarmListIndexChanged(
				action.index
			);
			
			break;

		case types.TOMIN: 										console.log("TOMIN")
			state['toMin'] = typeof action.value === "boolean" ? 
					action.value 
				: 
					!state['toMin'];
			
			break;

		case types.SETALARM: 								console.log("SETALARM")
			state['setAlarm'] = !state['setAlarm'];
			
			if(state['setAlarm'] === false && typeof state['alarmEditIndex'] === "number"){
				state['alarmEditIndex'] = null;
			}
			
			break;

		case types.REMOVEALARM: 								console.log("REMOVEALARM")
			const serial = state['alarm-list'][action.index].serial;
			
			state['alarm-list'] = state['alarm-list']
				.slice(0, action.index)
				.concat(state['alarm-list']
				.slice(action.index + 1));	
			
			alarmListIndexChanged({ 
				"REMOVE": serial 
			});
			
			break;

		case types.MOVETOMIN: 									console.log("MOVETOMIN")
			state['moveToMin'] = typeof action.value === "boolean" ? 
					action.value 
				: 
					!state['moveToMin'];
					
			break;

		case types.SELECTRINGTONE: 								console.log("SELECTRINGTONE")
			state['alarm-list'][action.liIndex]['ringtone'] = action.index;
			
			break;
		
		case types.BOOLEANLISTPROPS: 							console.log("BOOLEANLISTPROPS")
			const excludedProps = [ 
				"collapsed", 
				"vibrate", 
				"ringtoneSelect" 
			];
			
			const alarm = state['alarm-list'][action.index];
			
			alarm[action.prop] = !alarm[action.prop]; 
			if(action.prop === "setRepeat"){
				let repeat = alarm['repeat'],
				    repeatDays = alarm['repeat-days'];
				
				if(repeat === true && !repeatDays.length){
					alarm['repeat'] = false;
				}
				
				if(repeat === true && alarm['dismiss'] === true && !alarm.snooze){
					checkForDismissOnRepeatDaysChange(
						repeatDays, 
						alarm
					)
				}
				
			} 
			if(excludedProps.indexOf(action.prop) === -1){
				alarmListIndexChanged(action.index); 
			}
			
			break;
			
		case types.LABELCHANGE:									console.log("LABELCHANGE")
			state['alarm-list'][action.index]['label'] = action.str; 
			
			break;
		
		case types.CURRENTALARM:								console.log("CURRENTALARM", action.index, action.value)
			state['current-alarm'][action.index] = action.value; 
			
			break;
			
		case types.RINGING:										console.log("RINGING")
			const indx = state['alarm-list'].findIndex(obj => obj.serial === action.serial),
			      node = state['alarm-list'][indx];	
				
			node['ringing'] = action.bool;
			
			if(!action.bool){
				if(action.ended){		
					node['dismiss'] = action.bool;
				}		
				else {
					node['dismiss'] = !action.ended;
				} 
				
				isRingingChange(
					null, 
					action.ended
				);
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