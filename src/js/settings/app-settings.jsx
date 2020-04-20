import React, { PureComponent } from 'react';
import maintObj from '../clock/time-maintenance.js';

import ClockSettings from './clock-settings.jsx';
import AlarmSettings from './alarm-settings.jsx';
import TimerSettings from './timer-settings.jsx';

import SettingsMapComp from './settings-map-comp.jsx'; 

import { gmtZonePresentation, getRingtoneName, addMinuteLabel, getWeekStart } from './gmt-display.js'; 

import ringtoneArray from '../alarm-clock/alarm/ringtone-array.js';
import { alarmSilenceArr, weekStart } from './settings-data.js';

import Range from './range.jsx'; 


export default class AppSettings extends React.PureComponent {
	constructor(props){
		super(props);
	}
	
	back(){
		window.location.href = `${ window.location.origin }/${ this.props.prevHash }`;
	}	
	
	componentDidMount(){
		if(this.props.indexObj['home'] === -1){
			this.props.setIndexState(+maintObj.getGeneral('homeTimezone'), 'home');
		}
	}
	
	render(){
		
		return (
			<main id="settings-main">
			
				<h1>
					<span className="fas fa-arrow-left"
					      onMouseUp={ (e) => this.back() } 
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
					this.props.selectObj['timers'] === true ?
							<SettingsMapComp collection={ ringtoneArray } 
											 index={ this.props.indexObj['timers'] }
											 func={ getRingtoneName } 
											 part='timers'
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
				<ul id="container">
					<ClockSettings cs={ this.props } />
					<AlarmSettings tone={ ringtoneArray[this.props.indexObj['alarm']] }
								   changeSelectState={ this.props.changeSelectState } 
								   silence={ alarmSilenceArr[this.props.indexObj['silence']] }
								   valueObj={ this.props.valueObj }
								   indexObj={ this.props.indexObj }
								   incr_vol={ this.props.incr_vol }
								   increaseVolumeState={ this.props.increaseVolumeState }
					/>
					<TimerSettings tone={ ringtoneArray[this.props.indexObj['timers']] } 
								   changeSelectState={ this.props.changeSelectState } 
					/>
				</ul>
			</main>
		);
	}
}