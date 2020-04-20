import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactFCCtest from 'react-fcctest'; 

import PomodoroDisplay from './display/pomodoro-display.jsx';
import Ringing from '../alarm-clock/ringing.jsx'; 

import { tag } from './display/time-display.js';  
import beep from '../../assets/audio/romulan_alarm.mp3';

let time = null;

class AppPomodoro extends React.PureComponent {
	constructor(props){
        super(props);
		
		this.time = time;
		this.classes = [ "fa-pause", "fa-play" ];
		this.devMode = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
	}
	
	componentDidMount(){
		this.props.recordPrevHashState(window.location.hash);
	}
	
	breakChange(num){
		this.props.change(num, "break");
	}
	
	sessionChange(num, e){
		this.props.change(num, "session");
	}
	
	replaceFAClass(cmd){
		if(cmd === "refresh"){
			this.classes = [ "fa-pause", "fa-play" ];
		}
		else {
			this.classes = [ this.classes[1], this.classes[0] ];
		}
		
		this.start_stop
			.classList
			.replace(
				this.classes[0], 
				this.classes[1]
		);
	}
	
	playSessionThruBreak(cmd){
		if(cmd === 'play'){
			this.time = window.setInterval(() => {
				this.props.change(null, cmd);
			}, 1000);
		}
		else if(cmd === 'pause'){
			this.time = window.clearInterval(this.time);
		}
		else if(cmd === 'refresh'){
			if(!tag("beep").paused){
				tag("beep").currentTime = 0;
				tag("beep").pause();
			}
			this.props.change(null, cmd);
			this.time = window.clearInterval(this.time);
		}	
		this.replaceFAClass(cmd);
	}
	
	componentWillUnmount(){
		time = this.time;
		//this.playSessionThruBreak("refresh");
	}
	
    render(){
		const { breaks, session, timer } = this.props;
		
		return (
			<div id="pomodoro-container">
				{
					this.devMode && tag("fcc_test_suite_wrapper") === null ? 
							<ReactFCCtest /> 
						: 
							null
				}
				{
					typeof this.props.isRinging === "number" ? 
							<Ringing alarmListIndexChanged={ this.props.alarmListIndexChanged }	
									 isRinging={ this.props.isRinging } 
									 alarmList={ this.props.alarmList } 
									 initRingingState={ this.props.initRingingState }
									 initSnoozeState={ this.props.initSnoozeState }
							/>
						:
							null
				}
				<div id="parameters" className="negative">
					<label id="break-label">
						{ "Break Length" }
						<br />
						<span onClick={ () => this.breakChange(-1) } 
							  id="break-decrement" 
							  className="fa fa-arrow-down clickable"
							  role="button"
						/>
						<span id="break-length">
							{ breaks }
						</span>
						<span onClick={ () => this.breakChange(1) } 
							  id="break-increment" 
							  className="fa fa-arrow-up clickable"
							  role="button"
						/>
					</label>
					<label id="session-label">
						{ "Session Length" }
						<br />
						<span onClick={ () => this.sessionChange(-1) } 
							  id="session-decrement" 
							  className="fa fa-arrow-down clickable"
							  role="button"
						/>
						<span id="session-length">
							{ session }
						</span>
						<span onClick={ () => this.sessionChange(1) } 
							  id="session-increment" 
							  className="fa fa-arrow-up clickable"		
							  role="button"							  	
						/>
					</label>
				</div>
				
				<div id="pomo-disp-container" className="negative">	
					<PomodoroDisplay session={ session } 
									 breaks={ breaks } 
									 timer={ timer } 
					/>
				</div>	
				
				<div id="controls-cont" 
					 className="negative">
					<div id="controls">
						<span id="start_stop"
							  ref={ (elem) => this.start_stop = elem } 
							  onClick={ () => { 
									let action = this.time ? 'pause' : 'play';
									this.playSessionThruBreak(action); 
								  } 
							  }
							  className="fa fa-play clickable"
							  role="button" 
						/>
						<span onClick={ () => this.playSessionThruBreak('refresh') } 
							  id="reset" 
							  className="fas fa-sync clickable"
							  role="button"
						/>
						<audio id="beep"
							   src={ beep }
							   type="audio/mp3">
							{ "Your browser doesn't support audio elements." }
						</audio>
					</div>
				</div> 
			</div>	
		);
    }
};

AppPomodoro.propTypes = {
	breaks: PropTypes.number.isRequired, 
	session: PropTypes.number.isRequired, 
	timer: PropTypes.arrayOf(
		PropTypes.oneOfType([ 
			PropTypes.number.isRequired, 
			PropTypes.number.isRequired, 
			PropTypes.string.isRequired
		]).isRequired
	).isRequired,
	change: PropTypes.func.isRequired
}

export default AppPomodoro;

