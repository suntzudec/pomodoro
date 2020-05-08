import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeToMin, changeMoveToMin, removeAlarm, addAlarm, 
		 selectRingTone, setAlarmChange, updateCurrentAlarm, 
		 listPowerChangeState, changeBooleanListProps, listLabelChangeState,
		 selectRepeatDays, editAlarmTime, setAlarmEdit, initRinging, 
		 setAlarmPresent, setDismiss, initSnooze, 
		 isRingingChange, ringingVolumeChange, indexToNull } from './action-creators.js';
		 
import AppAlarmClock from '../app-alarm-clock.jsx';

import { recordPrevHash } from '../../settings/redux/action-creators.js'; 

const mapDispatchToProps = (dispatch) => ({
	toMinState: (value) => dispatch(changeToMin(value)),
	moveToMinState: (value) => dispatch(changeMoveToMin(value)),
	removeAlarmState: (index) => dispatch(removeAlarm(index)), 
	setAlarmEditState: (value) => dispatch(setAlarmEdit(value)), 
	replaceAlarmTime: () => dispatch(editAlarmTime()), 
	addAlarmState: (obj) => dispatch(addAlarm(obj)), 
	selectRepeatDaysState: (index, liIndex) => dispatch(selectRepeatDays(index, liIndex)),
	powerChangeState: (index, value) => dispatch(listPowerChangeState(index, value)), 
	selectRingtoneState: (index, liIndex) => dispatch(selectRingTone(index, liIndex)),
	booleanPropsChange: (index, prop) => dispatch(changeBooleanListProps(index, prop)), 
	labelChangeState: (index, str) => dispatch(listLabelChangeState(index, str)),
	setAlarmState: () => dispatch(setAlarmChange()),
	currentAlarmState: (value, index) => dispatch(updateCurrentAlarm(value, index)),
	initRingingState: (serial, bool, ended) => dispatch(initRinging(serial, bool, ended)), 
	setAlarmPresentState: (index) => dispatch(setAlarmPresent(index)), 
	setDismissState: (index, bool) => dispatch(setDismiss(index, bool)), 
	initSnoozeState: (index) => dispatch(initSnooze(index)), 
	indexToNullState: () => dispatch(indexToNull()),
	
	ringingVolumeChangeState: (value) => dispatch(ringingVolumeChange(value)), 
	recordPrevHashState: (hash) => dispatch(recordPrevHash(hash))	
});

const mapStateToProps = (state) => {
	return {
		alarmList: state['alarmClockReducer']['alarm-list'].slice(),
		currentAlarm: state['alarmClockReducer']['current-alarm'].slice(),
		alarmEditIndex: state['alarmClockReducer']['alarmEditIndex'],
		setAlarm: state['alarmClockReducer']['setAlarm'],
		toMin: state['alarmClockReducer']['toMin'],
		moveToMin: state['alarmClockReducer']['moveToMin'],
		alarmListIndexChanged: state['alarmClockReducer']['alarmListIndexChanged'], 
		isRinging: state['alarmClockReducer']['isRinging'],
		volChange: state['alarmClockReducer']['vol-change'],			
		
		defRingtone: state['settingsReducer']['indices']['alarm'], 
		volume: state['settingsReducer']['values']['alarm-vol'],
		snoozeDuration: state['settingsReducer']['values']['snooze'],
		
		increaseVol: state['settingsReducer']['values']['increase-vol'], 
		silenceAfter: state['settingsReducer']['indices']['silence'], 
		increaseVolBool: state['settingsReducer']['increase-vol'],
		weekStart: state['settingsReducer']['indices']['week-start'] 	
	};
};

const AppAlarmClockConnect = withRouter(
	connect(mapStateToProps, mapDispatchToProps)(AppAlarmClock)
);

export default AppAlarmClockConnect;