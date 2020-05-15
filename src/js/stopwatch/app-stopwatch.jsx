import React from 'react';
import PropTypes from 'prop-types';

import SWWorkerScript from './stopwatch-worker.js';
import codeToObjectURL from '../workers/web/to-object-url.js';	

import LapMarker from './laplist/lap-marker.jsx';
import { setLowestValueFromLapList, calcAddLap, trackSvgScaling } from './laplist/laplist-functions.js';

import Ringing from '../alarm-clock/ringing.jsx';  

const worker = typeof Worker !== "undefined" ? 
				codeToObjectURL(SWWorkerScript) 
			: 
				undefined;	

export default class AppStopWatch extends React.PureComponent {
	constructor(props){
		super(props);
		
		this.coord = 0; 
		this.prev = 0; 
		this.cos = Math.cos;
		this.sin = Math.sin;
		
		this.lapMarkerCoords = [ ];
		this.radius = 250;
		this.lapDivisor = 1;
		
		this.dCmd = '';	
		this.dAppended = '';	
		this.staticDProp = `M ${ this.radius + 25 } ${ this.radius + 25 } m ${ this.radius }, 0 a ${ this.radius },${ this.radius } 0 0,1 -${ this.radius * 2 },0 a ${ this.radius },${ this.radius } 0 0,1 ${ this.radius * 2 },0`;
		
		this.prevTime = null;
		this.pathBool = false;  
		this.revolution = false; 
		this.adjustPrev = false; 
	}
	
	formatTime(arr){
		return arr.map((num, i) => {
			const len = num.toString().length;
			
			if(len === 1){
				return `0${ num }`;
			}
			
			return num;
		}).join(":");
	}
	
	setSecondaryValuesFromState(){ 
		const obj = this.props.remountValues;
		
		this.coord = obj.coord; 
		this.prev = obj.prev; 
		this.dCmd = obj.dCmd;	
		this.dAppended = obj.dAppended;
		this.prevTime = obj.prevTime;
		this.pathBool = obj.pathBool;  
		this.revolution = obj.revolution;
		this.lapDivisor = obj.lapDivisor;
		this.lapMarkerCoords = obj.lapMarkerCoords;
		this.rotate = obj.rotate;	
		
		if(this.props.running === true){	
			this.adjustPrev = true;
		}	
		
		this.props.setRunning(this.props.running);
	} 
	
	componentWillUnmount(){
		const remountVals = {
			coord: this.coord, 
			prev: this.prev, 
			dCmd: this.dCmd,
			dAppended: this.dAppended,
			prevTime: this.prevTime,
			pathBool: this.pathBool,
			revolution: this.revolution,
			lapDivisor: this.lapDivisor,
			lapMarkerCoords: this.lapMarkerCoords,
			rotate: this.rotate			
		};
		
		this.props.keepRemountValues(remountVals);
	}
	
	adjustPrevAndPrevProp(){
		this.prev = this.coord - 0.0625;
		this.adjustPrev = false;
	}
	
	workerHandler(){
		worker.onmessage = (message) => {
			const parsed = JSON.parse(message.data);
			this.coord = parsed.coord;
			
			if(this.adjustPrev === true){
				this.adjustPrevAndPrevProp();
			} 
			
			this.props.currentTimeSet(parsed.time);
			
			if(this.revolution === false){ 
				this.checkForRevolution();
			} 
		};
	
		worker.onerror = (error) => console.log(error);
	}
	
	componentDidMount(){ 
		this.props.recordPrevHashState(window.location.hash);
	
		const secStateKeys = Object.keys(this.props.remountValues);
		
		if(secStateKeys.length !== 0){
			this.setSecondaryValuesFromState();
		}
		this.workerHandler();
	}
	
	checkForRevolution(){		
		if(this.coord / this.lapDivisor > 6.25){
			this.revolution = true;
		}
	}
	
	zeroOutCoords(){
		this.coord = 0; 
		this.startWatch(this.pathBool);
	}		
	
	startWatch(bool){ 		
		worker.postMessage(
			JSON.stringify({
				coord: this.coord, 
				time: this.props.currentTime,
				allow: bool
			})
		);
	}		
	
	stopWatch(){
		worker.postMessage("stop");
	}
	
	runningChange(){
		if(!this.props.running){
			this.startWatch(this.pathBool);
		}
		else {
			this.stopWatch();
		}
		
		this.props.setRunning();
	}
	
	setLapMarkerCoords(){ 	
		let x = this.calcCCoord(this.cos),
			y = this.calcCCoord(this.sin);
			
		this.lapMarkerCoords = [ x, y ];
		this.rotate = (this.coord / this.lapDivisor) * 57.6;
	}		
	
	addCurrentLap(){
		this.setLapMarkerCoords(); 
		this.resetPathCmds();
		
		let curr = this.props.currentTime.slice(); 
		let addLap = calcAddLap(this.prevTime, curr); 
		
		this.prevTime = this.props.currentTime.slice();
		
		const lapList = [ 
			...this.props.lapList, 
			[ addLap, this.prevTime ] 
		];
		
		this.props.addLapToList([ 
			addLap, 
			this.prevTime 
		]);
		
		let lowest = setLowestValueFromLapList(lapList);   
		
		this.setLapDivisor(lowest);	
		this.resetPathElement();
	}
	
	setLapDivisor(lowArr){
		this.lapDivisor = lowArr[0] * 10 + (lowArr[1] + lowArr[2] / 100);
		
		if(this.lapDivisor < 1){
			this.lapDivisor = 1;
		}
	}
	 
	resetPathElement(){
		this.stopWatch();
		this.pathBool = true;
		this.revolution = false; 
		this.zeroOutCoords();
	}
	
	resetPathCmds(){
		this.dCmd = '';
		this.dAppended = '';
	}
	
	resetWatch(){	
		this.resetPathCmds(); 
		this.lapMarkerCoords = [ ]; 
		this.lapDivisor = 1;
		this.props.mainStateValsReset();
		
		this.prevTime = null;
		this.revolution = false;
		this.coord = 0;     
		this.pathBool = false;   
	}		
	
	calcCCoord(func){ 		
		if(this.coord - this.prev > 0.0625){
			this.coord = 0;
		}
		this.prev = this.coord;
		return 25 + this.radius + func(this.coord / this.lapDivisor) * this.radius;
	} 		
	
	circlePath(){ 		
		let x = this.calcCCoord(this.cos), 
			y = this.calcCCoord(this.sin);
			
		if(!this.dCmd.length){ 
			this.dCmd = `M ${ x }, ${ y } S ${ x }, ${ y } ${ x }, ${ y } `;				
		} 
		else {
			this.dCmd += `${ this.dAppended } ${ x }, ${ y } `; 
		} 
		
		this.dAppended = `${ x }, ${ y }`;
		return this.dCmd;
	}		
	
	render(){
		return (
			<div id="stopwatch-container">
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
				<svg id="sw-svg"
					 xmlns="http://www.w3.org/2000/svg"
					 viewBox="0 0 550 550">
					<circle id="sw-circ"
							className="opacity"
							r={ this.radius }
							cx={ this.radius + 25 }
							cy={ this.radius + 25 }
					/>	
					{
						this.props.lapList.length && this.pathBool ? 
							<path fill="transparent" 
								  stroke="red" 
								  strokeWidth="3.25"							  
								  d={ this.revolution === false ?
											this.circlePath() 
										: 
											this.staticDProp }
							/> 
						: 
							null
						
					}
					{
						this.lapMarkerCoords.length ? 
							<LapMarker x1={ this.lapMarkerCoords[0] - 15 }
									   x2={ this.lapMarkerCoords[0] + 15 }
									   y1={ this.lapMarkerCoords[1] }
									   y2={ this.lapMarkerCoords[1] }
									   rotate={ this.rotate }
							/>
						: 
							null
						
					}
					<text className="opacity"
						  fill="#ffffff"
						  x="155"
						  y="300">
						{
							this.formatTime(this.props.currentTime)
						}
						
					</text> 
					{
						this.props.lapList.length ? 
							<circle id="red"
									r="10"
									cx={ this.calcCCoord(this.cos) } 
									cy={ this.calcCCoord(this.sin) } 
									fill="red"
							/>
						: 
							null
						
					}
				</svg>
				
				<div id="redo-div"
					 className="opacity">
					{
						this.props.running ? (
							<svg id="tracksvg-svg" 
								 width="65" 
								 height="65"
								 style={ trackSvgScaling() }
								 onMouseUp={ () => this.addCurrentLap() }>
								<line x1="15"//"13"
									  x2="31"//"29" 
									  y1="5" 
									  y2="26.5" 
									  stroke="#ffffff" 
									  strokeWidth="4" 
								/>
								<circle r="22.5"
										fill="transparent" 
										stroke="#ffffff" 
										strokeWidth="4"
										cx="35.5"//"33.5"
										cy="33.5"	
								/>
							</svg>
						) : (
							<h3 className='fas fa-redo' 
								onMouseUp={ () => this.resetWatch() }
							/>
						)
					}
					
					<div id="SW-ol"
						 className="opacity">
						<ol reversed>
							{
								this.props.lapList.map((li, ind) => {
									return (
										<li key={ `SW-li-${ ind }` }>
											<span key={ `span1-${ ind }` }>
												{ this.formatTime(li[0]) }
											</span>
											<span key={ `span2-${ ind }` }>
												{ this.formatTime(li[1]) }
											</span>
										</li>
									);
								})
							}
						</ol>
					</div>
					
					<h3 className={ `opacity ${ this.props.running ? "fas fa-pause" : "fas fa-play" }` }
						onMouseDown={ () => this.runningChange() }					
					/>
				</div>
			</div>
		);
	}
};
 
AppStopWatch.propTypes = {
	currentTime: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.number.isRequired,
			PropTypes.number.isRequired,
			PropTypes.number.isRequired
		]).isRequired
	).isRequired,
	lapList: PropTypes.arrayOf(
		PropTypes.oneOfType([ 
			PropTypes.arrayOf(
				PropTypes.oneOfType([
					PropTypes.arrayOf(
						PropTypes.oneOfType([
							PropTypes.number.isRequired,
							PropTypes.number.isRequired
						]).isRequired
					),
					PropTypes.arrayOf(
						PropTypes.oneOfType([
							PropTypes.number.isRequired,
							PropTypes.number.isRequired
						]).isRequired
					).isRequired
				]).isRequired
			).isRequired 
		]).isRequired
	).isRequired,
	running: PropTypes.bool.isRequired,
	remountValues: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number,
		prevX: PropTypes.number,
		prevY: PropTypes.number,
		dCmd: PropTypes.string,
		dAppended: PropTypes.string,
		prevTime: PropTypes.arrayOf(
			PropTypes.oneOfType([
				PropTypes.number.isRequired,
				PropTypes.number.isRequired,
				PropTypes.number.isRequired
			]).isRequired
		),
		pathBool: PropTypes.bool,
		revolution: PropTypes.bool,
		lapDivisor: PropTypes.number,
		staticDProp: PropTypes.any
	})
} 