import React from 'react';
import Proptypes from 'prop-types';

import maintObj from '../clock/time-maintenance.js';

import ClockSettings from './sections/clock-settings.jsx';
import AlarmSettings from './sections/alarm-settings.jsx';

import SettingsMapComp from './select-components/settings-map-comp.jsx';   
import Range from './select-components/range.jsx'; 

import { gmtZonePresentation, getRingtoneName, addMinuteLabel, getWeekStart } from './display/select-functions.js'; 

import ringtoneArray from '../alarm-clock/alarm/ringtone-array.js';
import { alarmSilenceArr, weekStart } from './display/settings-data.js';

import Ringing from '../alarm-clock/ringing.jsx'; 

export default class AppSettings extends React.PureComponent {
	constructor(props){
		super(props);
	}
	
	previousHash(){
		window.location.href = `${ window.location.origin }/${ this.props.prevHash }`;
	}	
	
	componentDidMount(){
		if(this.props.indexObj['home'] === -1){
			this.props.setIndexState(+maintObj.getGeneral('homeTimezone'), 'home');
		}
	}
	
	render(){
		return (
			<div id="settings-container">
				{
					typeof this.props.isRinging === "number" ? 
							<Ringing alarmListIndexChanged={ this.props.alarmListIndexChanged }	
									 isRinging={ this.props.isRinging } 
									 alarmList={ this.props.alarmList } 
									 initRingingState={ this.props.initRingingState }
									 initSnoozeState={ this.props.initSnoozeState }
									 volume={ this.props.valueObj['alarm-vol'] } 
									 volChange={ this.props.volChange }
									 ringingVolumeChange={ this.props.ringingVolumeChangeState }
									 increaseVolBool={ this.props.incr_vol }
							/>
						:
							null
				}
				<h1 className="opacity">
					<span className="fas fa-arrow-left"
					      onMouseUp={ (e) => this.previousHash() } 
					/>
					{ "Settings" }
				</h1>
				{
					this.props.selectObj['home'] === true ?
							<SettingsMapComp collection={ maintObj.getGeneral('zonesAndGMT') } 
											 index={ this.props.indexObj['home'] }
											 func={ gmtZonePresentation } 
											 part='home' 
											 changeSelectState={ this.props.changeSelectState }
											 setIndexState={ this.props.setIndexState }
							/>
						:
							null
				}
				{
					this.props.selectObj['alarm'] === true ?
							<SettingsMapComp collection={ ringtoneArray } 
											 index={ this.props.indexObj['alarm'] }
											 func={ getRingtoneName } 
											 part='alarm' 
											 changeSelectState={ this.props.changeSelectState } 
											 setIndexState={ this.props.setIndexState }
							/>
						:
							null
				}
				{
					this.props.selectObj['silence'] === true ?
							<SettingsMapComp collection={ alarmSilenceArr } 
											 index={ this.props.indexObj['silence'] }
											 func={ addMinuteLabel } 
											 part='silence' 
											 changeSelectState={ this.props.changeSelectState } 
											 setIndexState={ this.props.setIndexState }
							/>
						:
							null
				}
				{
					this.props.selectObj['snooze'] === true ? 
							<Range value={ this.props.valueObj['snooze'] } 
								   changeValueState={ this.props.changeValueState } 
								   part='snooze' 
								   disp='snooze'
								   changeSelectState={ this.props.changeSelectState }
								   unit='minutes' 
								   min='1'
								   max='30'
								   step='1'
							/> 
						:
							null
				}
				{
					this.props.selectObj['alarm-vol'] === true ? 
							<Range value={ this.props.valueObj['alarm-vol'] }
								   part='alarm-vol' 
								   disp='volume'
								   changeValueState={ this.props.changeValueState }
								   changeSelectState={ this.props.changeSelectState }
								   unit=''
								   min='0'
								   max='100'
								   step='1'
							/> 
						:
							null
				}    
				{
					this.props.selectObj['increase-vol'] === true ? 
							<Range value={ this.props.valueObj['increase-vol'] }
								   part='increase-vol'
								   disp='increase volume'
								   changeValueState={ this.props.changeValueState }
								   changeSelectState={ this.props.changeSelectState }
								   unit='seconds'
								   min='5'
								   max='60'
								   step='5'
							/>
						:
							null
				}
				{
					this.props.selectObj['week-start'] === true ? 
							<SettingsMapComp collection={ weekStart }
											 index={ this.props.indexObj['week-start'] }
											 func={ getWeekStart }
											 part='week-start'
											 changeSelectState={ this.props.changeSelectState }
											 setIndexState={ this.props.setIndexState }
							/>
						:
							null
				}
				<ul id="container" 
					className="opacity">
					<ClockSettings homeDisplay={ this.props.homeDisplay }
								   changeHomeClockDispState={ this.props.changeHomeClockDispState }
								   changeSelectState={ this.props.changeSelectState }
								   indexObj={ this.props.indexObj }	
					/> 
					<AlarmSettings tone={ ringtoneArray[this.props.indexObj['alarm']] }
								   changeSelectState={ this.props.changeSelectState } 
								   silence={ alarmSilenceArr[this.props.indexObj['silence']] }
								   valueObj={ this.props.valueObj }
								   indexObj={ this.props.indexObj }
								   incr_vol={ this.props.incr_vol }
								   increaseVolumeState={ this.props.increaseVolumeState }
					/>
				</ul>
			</div>
		);
	}
};

AppSettings.propTypes = {
	indexObj: Proptypes.shape({
		'home': Proptypes.number.isRequired,
		'alarm': Proptypes.number.isRequired,
		'silence': Proptypes.number.isRequired,
		'week-start': Proptypes.number.isRequired 
	}).isRequired,
	homeDisplay: Proptypes.bool.isRequired,    
	prevHash: Proptypes.string.isRequired,
	selectObj: Proptypes.shape({
		'home': Proptypes.bool.isRequired,
		'alarm': Proptypes.bool.isRequired,
		'silence': Proptypes.bool.isRequired,
		'snooze': Proptypes.bool.isRequired,
		'alarm-vol': Proptypes.bool.isRequired,
		'increase-vol': Proptypes.bool.isRequired,
		'week-start': Proptypes.bool.isRequired
	}).isRequired,
	valueObj: Proptypes.shape({
		'snooze': Proptypes.string.isRequired,
		'increase-vol': Proptypes.string.isRequired,
		'alarm-vol': Proptypes.string.isRequired
	}).isRequired,
	incr_vol: Proptypes.bool.isRequired
}