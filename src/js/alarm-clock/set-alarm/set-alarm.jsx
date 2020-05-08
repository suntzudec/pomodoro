import React from 'react';

import { alarmCalcDirector, alarmIndexDirector } from './hand-position.js';
import { forwardDirector, backwardDirector, valueLimitCheck, 
		 toSVGPoints, setPassProps } from './filter-event-functions.js';

import { plotPoints, hours, minutes, selectCircleAdjustX, 
		 selectCircleAdjustY, setAlarmHeadingX, toMinCorrections, 
		 minuteHeadingCorrect, colonXCorrect, minuteXCorrect, 
		 correctHourCycle, createUnit, toMinConditionValue } from './clock-and-display.js';
		 
import { setInitialTime, multiplesOfFive } from './set-initial-time.js'; 	 

import clip from '../../../assets/audio/finalcrop.wav';

export default class SetAlarm extends React.PureComponent { 
	constructor(props){
		super(props);
		
		this.currentCoords = [ 345.5, 185 ];
		this.index = 0; 
		this.startX = 345.5;
		this.startY = 185;
		this.direction = null;
		this.currentClock = hours;
		this.byId = (id => document.getElementById(id));
		this.minCount = 0;
		this.dblClick = false;
		this.mousedown = false; 
	}
	
	componentDidMount(){
		const initialArray = typeof this.props.setAlarm.alarmEditIndex !== "number" ? 
				setInitialTime()
			:
				this.props.setAlarm['currentAlarm'];

		this.setInitialPosition(initialArray);
		
		this.audio.volume = 0.25;
		
		this.props.setAlarm.moveToMinState(true);
		this.props.setAlarm.toMinState(false); 
	}
	
	setInitialPosition(initialArray){
		this.props.setAlarm.currentAlarmState(initialArray[1], 1); 
		
		this.minCount = multiplesOfFive(initialArray[1]);
		this.currentClock = hours;
		this.index = this.currentClock.indexOf(initialArray[0]);
		
		this.setCurrentCoords();
		this.selectPartOfDay(initialArray[2].toLowerCase());
	}
	
	wheelDirection(e){
		this.direction = e.deltaY < 0;
		this.selectAlarmTime();
	}
	
	setDoubleClick(){
		this.dblClick = true;
	}
	
	mousedownTrue(ev){	
		if(ev.type === "mousedown"){	
			this.mousedown = true;
		}
		this.selectTimeCategory(ev);
	}	
	
	selectTimeCategory(ev){
		this.startX = setPassProps(ev, "x");
		this.startY = setPassProps(ev, "y");
	}
	
	playClip(){
		this.audio.play()
			.then(_ => {
			this.audio.pause();
			this.audio.currentTime = 0;
		})
		.catch(error => error);
	}
	
	selectAlarmTime(ev){
		this.index = alarmIndexDirector(this.index, this.direction);
		this.setCurrentCoords();
		
		if(ev){ 
			this.startX = setPassProps(ev, "x");
			this.startY = setPassProps(ev, "y");
		} 
	}
	
	setCurrentCoords(){
		this.currentCoords = [ 											
			selectCircleAdjustX(plotPoints[this.index][0], this.index, this.props.setAlarm['toMin']),
			selectCircleAdjustY(plotPoints[this.index][1], this.index)
		];
		
		this.setHourMin();
	}
	
	setHourMin(){
		if(this.direction !== null){
			this.playClip(); 
		}
		
		if(this.currentClock[0] === 0){
			this.minCount = 0; 
			this.props.setAlarm.currentAlarmState(minutes[this.index], 1); 
		}
		else if(this.currentClock[0] === 12){	
			this.props.setAlarm.currentAlarmState(hours[this.index], 0); 
		}
	}
	
	decrementMin(){ 
		let hour = this.props.setAlarm['currentAlarm'][0],
			part = this.props.setAlarm['currentAlarm'][2],
			min = this.props.setAlarm['currentAlarm'][1];
			  
		if(min === 0){
			min = 59;
			hour = correctHourCycle(false, hour);
			this.props.setAlarm.currentAlarmState(hour, 0);
		}
		else {
			min -= 1;
		}
		
		this.moveByMinute(-1);
		this.props.setAlarm.currentAlarmState(min, 1); 
	}

	incrementMin(){
		let hour = this.props.setAlarm['currentAlarm'][0],
			part = this.props.setAlarm['currentAlarm'][2],
			min = this.props.setAlarm['currentAlarm'][1];
			  
		if(min === 59){
			min = 0;
			hour = correctHourCycle(true, hour);
			this.props.setAlarm.currentAlarmState(hour, 0);
		}
		else {
			min += 1;
		}
			  
		this.moveByMinute(1); 
		this.props.setAlarm.currentAlarmState(min, 1); 
	}
	
	minButtonEdgeHandler(val, four, direction){
		const zeroSumPos = this.minCount === 1 && val === -1,
			  zeroSumNeg = this.minCount === -1 && val === 1;
		let resp = false;
			  
		if(zeroSumPos || zeroSumNeg){ 
			this.setCurrentCoords();
		} 
		else if(this.minCount === four){
			this.minCount = 0;
			this.direction = direction;
			this.selectAlarmTime(undefined);
		}
		else {
			this.minCount += val;
			resp = !resp;
		}
		return resp;
	}
	
	moveByMinute(type){
		if(this.minButtonEdgeHandler(
			type, 
			type * 4, 
			type === 1 ) === false){
			return; 
		}
		
		let nextIndex, 
			direct = type;
			
		if(this.minCount > 0 && type === -1){ 
			nextIndex = this.index + 1;
		}
		else if(this.minCount < 0 && type === 1){
			nextIndex = this.index - 1;
			direct = -1;
		} 
		else {
			nextIndex = this.index + type;
			direct = 1;
		}
		
		
		if(nextIndex === 12){
			nextIndex = 0;
		} 
		else if(nextIndex === -1){
			nextIndex = 11;
		}
	
		const a = plotPoints[this.index],
			  b = plotPoints[nextIndex];
		
		const xDiff = b[0] - a[0],
			  yDiff = b[1] - a[1];
			  
		const xUnit = createUnit(direct, xDiff),
			  yUnit = createUnit(direct, yDiff);
			
		this.currentCoords[0] += xUnit;
		this.currentCoords[1] += yUnit;		
		
		this.playClip();
	}
	
	touchMoveFilter(ev){ 											
		this.direction = alarmCalcDirector(
			hours[this.index],
			this.startY, setPassProps(ev, "y"),
			this.startX, setPassProps(ev, "x")
		);
					
		if(this.filterEvent(this.index, 
			setPassProps(ev, "cx"), 
			setPassProps(ev, "cy")) === true){ 
			this.selectAlarmTime(ev); 
		}
	}
	
	correctDirFunc(){
		if(this.props.setAlarm['toMin']){
			return (this.minCount > 0 && !this.direction) || (this.minCount < 0 && this.direction);
		}	
	}
	
	filterEvent(ind, clientx, clienty){
		let dir_func = this.direction ? 
				forwardDirector(this.index, 1, 11, 0)
			:
				backwardDirector(this.index, -1, 0, 11);
		
		if(this.correctDirFunc()){
			dir_func = ind;
		} 
		
		let { x, y } = toSVGPoints(clientx, clienty);
		
		let ppx = plotPoints[dir_func][0],
			ppy = plotPoints[dir_func][1];
		
		return valueLimitCheck(x - ppx, y - ppy);		
	}
	
	selectPartOfDay(id){
		const tuple = [ "am", "pm" ];
		const selected = this.byId(id);
		const qualifySelect = !selected.classList.contains("red");
		if(qualifySelect){
			selected.classList.add("red");
			const other = tuple.filter(str => str !== id)[0];
			this.byId(other).classList.remove("red");
			this.setPartOfDay(id);
		}
	}
	
	setPartOfDay(id){	
		this.props.setAlarm.currentAlarmState(id.toUpperCase(), 2); 	  
	}
	
	mousedownFalse(breaker){	
		this.mousedown = false;
		
		if(breaker === true){
			this.confirmEntry();
		}
	}	
	
	confirmEntry(){		 
		if(this.props.setAlarm['moveToMin'] === true){
			this.currentClock = minutes;
			this.userSelectHourMin("alarm-time-min");
			this.props.setAlarm.moveToMinState(); 
		}
	}
	
	userSelectHourMin(id){ 
		const tuple = [ "alarm-time", "alarm-time-min" ];
		const selected = this.byId(id);
	
		if(!selected.classList.contains("red")){
			selected.classList.add("red");
			const other = tuple.filter(item => item !== id)[0];
			this.byId(other).classList.remove("red");
			this.currentClock = id === tuple[0] ? hours : minutes;		
					
			const stateChunk = this.props.setAlarm['currentAlarm'][tuple.indexOf(id)];	
			this.setClockHand(stateChunk);
			
			if(id === "alarm-time-min"){
				this.props.setAlarm.moveToMinState(false);  
			}
			
			this.props.setAlarm.toMinState(this.currentClock[0] === 0); 
		}
	}
	
	setClockHand(sChunk){
		this.index = this.currentClock.indexOf(sChunk);
		const toMinCondition = this.minCount !== 0 && this.props.setAlarm['toMin'] === false;	
						
		if(this.index === -1 && toMinCondition){
			this.index = this.currentClock.indexOf(sChunk - this.minCount);
		} 
		
		this.currentCoords = [		
			selectCircleAdjustX(
				plotPoints[this.index][0], 
				this.index, 
			   !this.props.setAlarm['toMin']
			), 
			selectCircleAdjustY(plotPoints[this.index][1], this.index)  
		];
		
		if(toMinCondition){
			let	i;
			let minCount = this.minCount;
			this.minCount = 0;
			for(i = 0; i < Math.abs(minCount); i++){
				this.moveByMinute(toMinConditionValue(minCount));	
			}
		}
	}
	
	clickCoords(e){
		const x = e.target.x.baseVal[0].value;
		const y = e.target.y.baseVal[0].value;
		
		const clickCoords = (plptx, plpty) => {
			let xbool = x === plptx || x + 7 === plptx || x - 9.5 === plptx;
			let ybool = y === plpty;
			return xbool && ybool;
		};
		
		for(var i = 0; i < plotPoints.length; i++){
			if(clickCoords(plotPoints[i][0], plotPoints[i][1])){
				this.index = i;
				this.setCurrentCoords();
				break;
			}
		}
	}
	
	render(){
		return (
			<div id="set-alarm-container"> 
				<audio ref={ (el) => this.audio = el }
					   src={ clip }
					   type="audio/wav">
					{ "Your Browser Doesn't Support Audio Tags" }
				</audio>
				<svg id="circle"
					 xmlns="http://www.w3.org/2000/svg"
					 viewBox="0 0 700 750"
					 onWheel={ (e) => this.dblClick ? this.wheelDirection(e) : null }
					 onMouseUp={ () => this.mousedownFalse() }  
					 onMouseLeave={ () => this.mousedownFalse() }>
					<text id="ex" 
						  onMouseUp={ () => this.props.setAlarm.setAlarmState() }
						  x="645" 
						  y="30">
						&#215;
					</text>
					<text id="alarm-time"
						  className="red no-select"		
						  x={ plotPoints[0][0] - setAlarmHeadingX(this.props.setAlarm['currentAlarm'][0]) }
						  y="88"
						  onMouseUp={ () => this.userSelectHourMin("alarm-time")  }
						  onDoubleClick={ () => this.setDoubleClick() } 
						  onTouchStart={ () => this.userSelectHourMin("alarm-time") }>
						{  		
							this.props.setAlarm['currentAlarm'][0]
						}
					</text>
					<text id="colon"
						  className="no-select"
						  y="84.5"
						  x={ colonXCorrect(plotPoints[0][0]) }>
						{ ":" }
					</text>
					<text id="alarm-time-min"
						  className="no-select"
						  y="88"
						  x={ minuteXCorrect(plotPoints[0][0]) }
						  onMouseUp={ () => this.userSelectHourMin("alarm-time-min") }
						  onDoubleClick={ () => this.setDoubleClick() } 
						  onTouchStart={ () => this.userSelectHourMin("alarm-time-min") }>
							{							 
								minuteHeadingCorrect(this.props.setAlarm['currentAlarm'][1])
							}			
					</text>
					<text className="red no-select"
						  id="am"
						  x="414" 
						  y="58"
						  onMouseUp={ (e) => this.selectPartOfDay("am") }
						  onTouchStart={ (e) => this.selectPartOfDay( "am") }>
						{ "AM" }
					</text>
					<text id="pm"
						  className="no-select"
						  x="414" 
						  y="103"
						  onMouseUp={ (e) => this.selectPartOfDay("pm") }
						  onTouchStart={ (e) => this.selectPartOfDay("pm") }>
						{ "PM" }
					</text>
					<circle id="clockface"
							cx="350" 
							cy="375" 
							r="230" 
							onMouseMove={ (e) => this.mousedown === true && e.buttons === 1 ? 
									this.touchMoveFilter(e) 
								: 
									null 
							}	
					/>
					{ 
						this.currentClock.map((num, i) => {
							return (
								<text key={ `text${ i }` }
									  className="clock-n"		  
									  x={ plotPoints[i][0] + (this.props.setAlarm['toMin'] === true ? 
											toMinCorrections(i) 
										: 
											0) } 
									  y={ plotPoints[i][1] }
									  onMouseDown={ (e) => this.clickCoords(e) }
									  onTouchStart={ (e) => this.clickCoords(e) }>
									{ num }
								</text>
							);
						}) 
					}
					<text id="left"				
						  onMouseUp={ () => this.props.setAlarm['toMin'] ? 
							this.decrementMin() : null }
						  x="245" 
						  y="395">
						&#8627;
					</text>
					<text id="right"			
						  onMouseUp={ () => this.props.setAlarm['toMin'] ? 
							this.incrementMin() : null }
						  x="410" 
						  y="395">
						&#8626;
					</text>	
					<line id="clock-line"
						  x1="348" 
						  y1="365"
						  x2={ this.currentCoords[0] } 
						  y2={ this.currentCoords[1] }
					/> 
					<circle id="select-circ"
							cx={ this.currentCoords[0] }
							cy={ this.currentCoords[1] }
							r="24.75"
							onTouchStart={ (e) => this.selectTimeCategory(e) }
							onTouchEnd={ () => this.confirmEntry() }
							onTouchMove={ (e) => this.touchMoveFilter(e) }
							onMouseDown={ (e) => this.mousedownTrue(e) }
							onMouseUp={ () => this.mousedownFalse(true) }
							onMouseMove={ (e) => e.buttons === 1 ? 
									this.touchMoveFilter(e) 
								: 
									null 
							}
					/>
					<circle cx="348" 
							cy="365"
							r="9.75"
					/>
				</svg>
			</div>
		);
	}
};