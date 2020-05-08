import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppClock from '../app-clock.jsx';
import { showListing, selectTimeZones, updateCurrentTime, callFlagChange, scrollNumber } from './action-creators.js';

import { initRinging, initSnooze, ringingVolumeChange /*TEST*/ } from '../../alarm-clock/redux/action-creators.js'; 

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
	ringingVolumeChangeState: (value) => dispatch(ringingVolumeChange(value)), //TEST
	
	recordPrevHashState: (hash) => dispatch(recordPrevHash(hash))	//TEST
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
		//TEST
		volChange: state['alarmClockReducer']['vol-change'],
		
		increaseVolBool: state['settingsReducer']['increase-vol'], 
		//TEST
		homeIndex: state['settingsReducer']['indices']['home'],
		homeDisplay: state['settingsReducer']['home-display'],
		volume: state['settingsReducer']['values']['alarm-vol'],
		snoozeDuration: state['settingsReducer']['values']['snooze']	//TEST
	};
};

const AppClockConnect = withRouter(
	connect(mapStateToPropsClock, mapDispatchToPropsClock)(AppClock)
);

export default AppClockConnect;