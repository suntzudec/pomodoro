import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppSettings from '../app-settings.jsx';
import { setIndex, changeSelect, changeHomeClockDisp, recordPrevHash, changeValue, increaseVolume } from './action-creators.js';

import { initRinging, initSnooze, ringingVolumeChange } from '../../alarm-clock/redux/action-creators.js'

const mapDispatchToProps = (dispatch) => ({
	changeSelectState: (part) => dispatch(changeSelect(part)),
	setIndexState: (index, key) => dispatch(setIndex(index, key)),
	changeHomeClockDispState: () => dispatch(changeHomeClockDisp()),
	recordPrevHashState: (hash) => dispatch(recordPrevHash(hash)),
	changeValueState: (key, value) => dispatch(changeValue(key, value)),
	increaseVolumeState: (key) => dispatch(increaseVolume()),

	initRingingState: (serial, bool, ended) => dispatch(initRinging(serial, bool, ended)), 
	initSnoozeState: (index) => dispatch(initSnooze(index)),
	ringingVolumeChangeState: (value) => dispatch(ringingVolumeChange(value))
});

const mapStateToProps = (state) => {
	return {
		indexObj: state['settingsReducer']['indices'],
		homeDisplay: state['settingsReducer']['home-display'],
		prevHash: state['settingsReducer']['prev-hash'],
		selectObj: state['settingsReducer']['select'],
		valueObj: state['settingsReducer']['values'],
		incr_vol: state['settingsReducer']['increase-vol'],
		
		alarmListIndexChanged: state['alarmClockReducer']['alarmListIndexChanged'],  
		alarmList: state['alarmClockReducer']['alarm-list'].slice(),
		isRinging: state['alarmClockReducer']['isRinging'],
		volChange: state['alarmClockReducer']['vol-change']
	};
};

const AppSettingsConnect = withRouter(
	connect(mapStateToProps, mapDispatchToProps)(AppSettings)
);

export default AppSettingsConnect;

