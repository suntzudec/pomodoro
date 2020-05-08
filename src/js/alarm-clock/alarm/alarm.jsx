import React from 'react';

import RepeatDays from './repeat-days.jsx';
import AlarmRingtoneSelect from './alarm-ringtone-select.jsx';
import ringtoneArray from './ringtone-array.js';
import { alarmDaysLabel } from  './alarm-helpers.js';

export default class Alarm extends React.PureComponent {
	constructor(props){
		super(props);
		this.labelValue = "";
	}
	
	componentDidUpdate(){
		if(this[`repeat${ this.props.i }`]){
			if(this[`repeat${ this.props.i }`].checked === true && !this.props.alarmObj['repeat']){
				this[`repeat${ this.props.i }`].checked = false;
			}
		}
		if(this[`on${ this.props.i }`].checked === true && this.props.alarmObj['power'] === "off"){
			this[`off${ this.props.i }`].checked = true;
		}
		if(this[`off${ this.props.i }`].checked === true && this.props.alarmObj['power'] === "on"){
			this[`on${ this.props.i }`].checked = true;
		}
	}
	
	componentDidMount(){
		if(this.props.alarmObj['collapsed'] === false){
			this[`repeat${ this.props.i }`].checked = this.props.alarmObj['repeat'];
			this[`vibe${ this.props.i }`].checked = this.props.alarmObj['vibrate'];
		}
	}
	
	powerChange(e){ 
		e.persist(); 
		if(this.props.alarmObj['power'] !== e.target.value){
			this.props.powerChangeState(this.props.i, e.target.value); 
		}
	}
	
	labelKeyUp(e){
		e.persist()
		if(e.keyCode === 13){
			return this.labelValue.length ? 
					this.newLabel(e) 
				: 
					null; 
		}
		this.labelValue = e.target.value;
	}
	
	newLabel(e){
		this.props.labelChangeState(this.props.i, this.labelValue);
		e.target.value = "";
		this.labelValue = "";
	}
	
	setRepeatHandler(e){
		if(e.target.tagName === "LABEL"){
			this.props.booleanPropsChange(this.props.i, 'setRepeat');
			return;
		}
		if(e.target.checked === true){
			this.props.booleanPropsChange(this.props.i, 'setRepeat');
		}
		
		this.props.booleanPropsChange(this.props.i, 'repeat');
	}
	
	render(){
		return (
			<li className={ this.props.alarmObj['collapsed'] === true ? 
					"alarm box-shadow fold" 
				: 
					"alarm box-shadow" }> 	
				{ 
					this.props.alarmObj['ringtoneSelect'] === true ? 
						( 
							<AlarmRingtoneSelect  
								booleanPropsChange={ this.props.booleanPropsChange }
								selectRingtoneState={ this.props.selectRingtoneState }
								i={ this.props.i }
								alarmObj={ this.props.alarmObj }
							/> 
						) 
					: 
						null
				}
				<div className={ this.props.alarmObj['collapsed'] === true ? 
						"alarm-li-cont" : "expanded-grid" }>
					<div className="heading"> 
						<h1 className="alarm-li-heading opacity" 
							onMouseUp={ () => this.props.setAlarmEditState(this.props.i) }>  
							{ 
								`${ this.props.alarmObj['time'][0] }:${ this.props.alarmObj['time'][1].toString().length > 1 ? this.props.alarmObj['time'][1] : "0" + this.props.alarmObj['time'][1] } ${ this.props.alarmObj['time'][2] }` 
							}
						</h1>
					</div>
					
					{
						this.props.alarmObj['setRepeat'] === true ? 
							(
								<RepeatDays repeatDays={ this.props.alarmObj['repeat-days'] }
											booleanPropsChange={ this.props.booleanPropsChange }
											selectRepeatDaysState={ this.props.selectRepeatDaysState }
											i={ this.props.i }	
											weekStart={ this.props.weekStart } 
								/>
							)
						:
							null
					}
						
					<div className="on-off">
						<input className="on" 
							   type="radio" 
							   name={ `power${ this.props.i }` }
							   value="on"
							   ref={ (elem) => this[`on${ this.props.i }`] = elem }
							   defaultChecked={ this.props.alarmObj['power'] === "on" }
							   onMouseUp={ (e) => { this.powerChange(e) } }
						/>
						<label htmlFor="on"
							   className="on opacity"
							   style={ this.props.alarmObj['power'] === "on" ? { fontWeight: '900' } : null }>
							{ "on" }
						</label>
						<br />
						<input className="off" 
							   type="radio" 
							   name={ `power${ this.props.i }` }
							   value="off"
							   ref={ (elem) => this[`off${ this.props.i }`] = elem }
							   defaultChecked={ this.props.alarmObj['power'] === "off" }
							   onMouseUp={ (e) => this.powerChange(e) }
						/>
						<label className="off opacity"
							   htmlFor="off"
							   style={ this.props.alarmObj['power'] === "off" ? { fontWeight: '900' } : null }>
							{ "off" }
						</label>
					</div>
					
					{ 
						this.props.alarmObj['collapsed'] === false ? (
							<div className="collapsing">
								<div className="repeat">
									<input className="repeat-check" 
										   type="checkbox" 
										   name="repeat"
										   ref={ (elem) => this[`repeat${ this.props.i }`] = elem }
										   defaultChecked={ this.props.alarmObj['repeat'] }
										   onChange={ (e) => this.setRepeatHandler(e) }
										   disabled={ this.props.checkForRingtoneSelect(this.props.alarmList) }
									/>
									
									<label htmlFor="repeat"
										   className="opacity"
										   onMouseUp={ (e) => this.setRepeatHandler(e) }>
										{ "repeat" }
									</label>
								</div>
							
								<div className="ringtone">
									<span id="bell" 
										  className="far fa-bell opacity"
										  onMouseUp={ () => !this.props.checkForRingtoneSelect(this.props.alarmList) ? this.props.booleanPropsChange(this.props.i, 'ringtoneSelect') : null }	
									/>
									
									<label htmlFor="bell"
										   className="opacity">
										{
											ringtoneArray[this.props.alarmObj['ringtone']].name
										}
									</label>
								</div>	
								
								<div className="vibrate">
									<input className="vibrate-check" 
										   type="checkbox" 
										   name="vibrate"
										   ref={ (elem) => this[`vibe${ this.props.i }`] = elem }
										   defaultChecked={ this.props.alarmObj['vibrate'] }
										   onChange={ () => this.props.booleanPropsChange(this.props.i, 'vibrate') }	
									/>
									
									<label htmlFor="vibrate"
										   className="opacity">
										{ "vibrate" }
									</label>
								</div>
								
								<div className="label">							
									<label htmlFor="label"
										   className="opacity">
										{ this.props.alarmObj.label !== null ? this.props.alarmObj.label : "label" }
									</label>
									<br />
									<input id="label" 
										   type="text" 
										   name="label"
										   onKeyUp={ (e) => this.labelKeyUp(e) }
									/>
								</div>
							</div> 
						)
					:
						null 
					}
					<div className="collapse-div">
						{ 
							this.props.alarmObj['dismiss'] === true ? (
									<span className="day-or-delete opacity dismiss"
										  onMouseUp={ () => this.props.setDismissState(this.props.i, false) }>
										&#32; 
										<span className="far fa-bell-slash" />  
										{ "Dismiss now" }
									</span>
								)
							:
							
							this.props.alarmObj['collapsed'] === true ? (
									<span className="day-or-delete opacity">
										{ 
											this.props.isRinging !== null || this.props.alarmObj['snooze'] !== null ? 
													"Today" 
												: 
													(
														this.props.alarmObj.label !== null ? 
																`${ this.props.alarmObj.label } ` 
															: 
																""
													) + alarmDaysLabel(
															this.props.alarmObj, false, 
															this.props.weekStart, 0
														) 
										}
									</span>	
								) 
							: 
								( 
									<span className="fa fa-trash opacity"
										  onMouseUp={ () => this.props.removeAlarmState(this.props.i) } 
									/> 
								)
						}
					</div>
					<div className="click">
						<span className="expand opacity"	
							  onMouseUp={ () => !this.props.checkForRingtoneSelect(this.props.alarmList) ? this.props.booleanPropsChange(this.props.i, 'collapsed') : null }>
							{ this.props.alarmObj['collapsed'] === true ? "v" : "^" }
						</span>
					</div>
				</div> 
			</li>
		);
	}
};