import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppPomodoro from  '../app-pomodoro.jsx';
import { changeBreak, refreshSession, changeSession, playSession  } from './action-creators.js';

import { initRinging, initSnooze } from '../../alarm-clock/redux/action-creators.js'; 

import { recordPrevHash } from '../../settings/redux/action-creators.js';

const mapDispatchToProps = (dispatch) => ({
	change: (num, type) => {
		const actionSelect = {
			'break': changeBreak,
			'session': changeSession,
			'play': playSession,
			'refresh': refreshSession
		}[type];
		
		dispatch(actionSelect(num));
	},
	initRingingState: (serial, bool, ended) => dispatch(initRinging(serial, bool, ended)), 
	initSnoozeState: (index) => dispatch(initSnooze(index)),
	recordPrevHashState: (hash) => dispatch(recordPrevHash(hash))	
});

const mapStateToProps = (state) => {
	return {
		session: state['pomodoroReducer']['session'],
		breaks: state['pomodoroReducer']['break'],
		timer: state['pomodoroReducer']['timer'].slice(),
		alarmListIndexChanged: state['alarmClockReducer']['alarmListIndexChanged'],  
		alarmList: state['alarmClockReducer']['alarm-list'].slice(),
		isRinging: state['alarmClockReducer']['isRinging'] 	
	};
}; 

const AppPomodoroConnect = withRouter(
	connect(mapStateToProps, mapDispatchToProps)(AppPomodoro)
); 

export default AppPomodoroConnect;

