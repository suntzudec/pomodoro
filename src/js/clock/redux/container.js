import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppClock from '../app-clock.jsx';
import { showListing, selectTimeZones, updateCurrentTime, callFlagChange, scrollNumber } from './action-creators.js';

import { initRinging, initSnooze, ringingVolumeChange } from '../../alarm-clock/redux/action-creators.js'; 

import { recordPrevHash } from '../../settings/redux/action-creators.js'; 

const mapDispatchToPropsClock = (dispatch) => ({
	update: (type, value, instr) => {
		const actionSelect = {
			"listing": showListing,
			"time": updateCurrentTime,
			"select": selectTimeZones
		}[type];
							
		dispatch(actionSelect(value, instr));					
	}, 
	initRingingState: (serial, bool, ended) => dispatch(initRinging(serial, bool, ended)), 
	initSnoozeState: (index) => dispatch(initSnooze(index)),
	ringingVolumeChangeState: (value) => dispatch(ringingVolumeChange(value)), 
	
	recordPrevHashState: (hash) => dispatch(recordPrevHash(hash))	
});

const mapStateToPropsClock = (state) => {
	return {
		time: state['clockReducer']['stamp'],
		selected: state['clockReducer']['indices'].slice(),
		listing: state['clockReducer']['listing'],
		
		alarm_present: state['alarmClockReducer']['alarm_present'],  
		alarmListIndexChanged: state['alarmClockReducer']['alarmListIndexChanged'],  
		alarmList: state['alarmClockReducer']['alarm-list'].slice(),
		isRinging: state['alarmClockReducer']['isRinging'],
	
		volChange: state['alarmClockReducer']['vol-change'],
		increaseVolBool: state['settingsReducer']['increase-vol'], 
		
		homeIndex: state['settingsReducer']['indices']['home'],
		homeDisplay: state['settingsReducer']['home-display'],
		volume: state['settingsReducer']['values']['alarm-vol'],
		snoozeDuration: state['settingsReducer']['values']['snooze']	
	};
};

const AppClockConnect = withRouter(
	connect(mapStateToPropsClock, mapDispatchToPropsClock)(AppClock)
);

export default AppClockConnect;