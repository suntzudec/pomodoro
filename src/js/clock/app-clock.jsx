import React from 'react';
import PropTypes from 'prop-types';
	
import maintObj from './time-maintenance.js';
import { assembleTimeData } from  './world-clock/process-time-data.js'; 

import ClockHeading from './main-clock/clock-heading.jsx';
import CheckBox from './world-clock/checkbox.jsx'  

import Ringing from '../alarm-clock/ringing.jsx'; 

class AppClock extends React.PureComponent {
	constructor(props){
		super(props);
		
		this.classes = [ "fa-globe", "fa-times" ];
		this.parsedList = [ ];
		this.mainInterval = null;
		
		this.frozenSelected = this.props.selected.slice();
		this.prevSelected = this.frozenSelected.length - 1; 
	}
	
	componentDidMount(){ 
		this.props.recordPrevHashState(window.location.hash); 
		
		this.mainIntervalUpdate();
		if(this.props.selected.length){
			this.parseMaintenanceObj();
		}						
	} 
	
	mainIntervalUpdate(){
		this.mainInterval = window.setInterval(() => {
			this.props.update("time");
		}, 1000); 
	}
	
	componentWillUnmount(){
		window.clearInterval(this.mainInterval);
	}
	
	parseMaintenanceObj(){ 						console.log("parseMaint")
		let upperLimit = 0;
		let lowerLimit = 0;
		const selected = this.props.selected;	
			if(selected.length){
				upperLimit = Math.max(...selected) + 1;
				lowerLimit = Math.min(...selected);
			} 
		
		this.parsedList = maintObj.truncate(lowerLimit, upperLimit)
			.filter((item, i) => selected.indexOf(i + lowerLimit) >= 0);
				
		maintObj.setSelectedToTop(this.props.selected);
	} 
	
	zoneListing(){ 
		this.props.update("listing");
		
		if(this.props.listing === true && this.props.selected){ 
		console.log("parse if")
			this.parseMaintenanceObj();
			this.frozenSelected = this.sortedCopy(this.props.selected);
			this.prevSelected = this.frozenSelected.length - 1; 
		}
	}
	
	sortedCopy(arr){
		return arr.slice().sort((a, b) => a - b);
	}
	
	render(){		
		return (
			<div id="clock-container">
				{ 
					typeof this.props.isRinging === "number" ? 
							<Ringing alarmListIndexChanged={ this.props.alarmListIndexChanged }	
									 isRinging={ this.props.isRinging } 
									 alarmList={ this.props.alarmList } 
									 initRingingState={ this.props.initRingingState }
									 initSnoozeState={ this.props.initSnoozeState }
									 volume={ this.props.volume } 
									 volChange={ this.props.volChange }	
									 ringingVolumeChange={ this.props.ringingVolumeChangeState }
									 increaseVolBool={ this.props.increaseVolBool }	
							/>
						:
							null
				}
				{
					!this.props.listing ?
						<ClockHeading localList={ this.parsedList } 			
									  time={ this.props.time }
									  update={ this.props.update }
									  alarm_present={ this.props.alarm_present }
									  homeDisplay={ this.props.homeDisplay } 
									  homeIndex={ this.props.homeIndex }
									  snoozeDuration={ +this.props.snoozeDuration }	
						/>
					:
						<ul id="clock-list">
							{  JSON.parse(maintObj.getGeneral('selectedToTop') || maintObj.getGeneral('baseData'))
								   .map((obj, i) => {
										const time_date = assembleTimeData(obj);
										return (
											<CheckBox key={ `${ i }check` } 
													  update={ this.props.update } 
													  time_date={ time_date } 
													  index={ i }
													  selected={ this.frozenSelected }
													  prevSelected={ this.prevSelected }
											/>		  
										);
								}) 	
							}
						</ul>
				}
				<div id="world-cont">
					<button id="world-button"
							className={ `fa ${ this.props.listing ? 
								this.classes[1] : this.classes[0] }` 
							} 
							onMouseUp={ () => maintObj.getGeneral('baseData') != null ? 
								this.zoneListing() : null 
							}
					/>
				</div>
			</div>
		);
	}
};

AppClock.propTypes = {
	listing: PropTypes.bool.isRequired,
	update: PropTypes.func.isRequired,
	time: PropTypes.number.isRequired,
	selected: PropTypes.arrayOf(
		PropTypes.number.isRequired
	).isRequired
}

export default AppClock;