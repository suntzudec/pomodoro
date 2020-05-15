import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeRunning, addCurrentLapToList, setCurrentTime, 
		 resetMainStateValues, setRemountValues } from './action-creators.js';
import AppStopWatch	from '../app-stopwatch.jsx';

import { initRinging, initSnooze, ringingVolumeChange  } from '../../alarm-clock/redux/action-creators.js'; 

import { recordPrevHash } from '../../settings/redux/action-creators.js';

const mapDispatchToProps = (dispatch) => ({
	setRunning: (bool) => dispatch(changeRunning(bool)),
	addLapToList: (lapArr) => dispatch(addCurrentLapToList(lapArr)),
	currentTimeSet: (timeArr) => dispatch(setCurrentTime(timeArr)),
	mainStateValsReset: () => dispatch(resetMainStateValues()),
	keepRemountValues: (obj) => dispatch(setRemountValues(obj)),
	initRingingState: (serial, bool, ended) => dispatch(initRinging(serial, bool, ended)), 
	initSnoozeState: (index) => dispatch(initSnooze(index)), 
	
	ringingVolumeChangeState: (value) => dispatch(ringingVolumeChange(value)),
	
	recordPrevHashState: (hash) => dispatch(recordPrevHash(hash))	
});	 

const mapStateToProps = (state) => {
	return {
		currentTime: state['stopWatchReducer']['current-time'].slice(),   
		lapList: state['stopWatchReducer']['lap-list'].slice(), 
		running: state['stopWatchReducer']['running'],  
		remountValues: state['stopWatchReducer']['remount-values'],
		alarmListIndexChanged: state['alarmClockReducer']['alarmListIndexChanged'],  
		alarmList: state['alarmClockReducer']['alarm-list'].slice(),
		isRinging: state['alarmClockReducer']['isRinging'],
		
		volume: state['settingsReducer']['values']['alarm-vol'],
		
		volChange: state['alarmClockReducer']['vol-change'],
		increaseVolBool: state['settingsReducer']['increase-vol']
		
	};
};

const AppStopWatchConnect = withRouter(
	connect(mapStateToProps, mapDispatchToProps)(AppStopWatch)
);

export default AppStopWatchConnect;