import React from 'react';

import { days } from '../../clock/main-clock/format-clock-heading.js';
import { setMarginTop } from '../alarm-clock-styles/set-margin-top.js';

const adjustWeekIndex = (wk_strt, ind) => {
	let i = ind;
	if(wk_strt === 1){
		i = ind + 1;
		
		if(i > days.length-1){
			i = 0;
		}
	}
	else if(wk_strt === 2){
		i = ind - 1;
		
		if(i < 0){
			i = days.length-1;
		}
	}
	return i;
}

const repeatDisplayWeekStart = (startNum, arr) => {
	if(startNum === 1){
		return arr.slice(1).concat([ arr[0] ]);
	}
	if(startNum === 2){
		return [ 
			arr[arr.length-1] 
		]
		.concat(
			arr.slice(0, arr.length-1)
		);
	}
	return arr;
};



const RepeatDays = (props) => {
	return (
		<div className="repeat-days-div"
			 style={{ marginTop: setMarginTop() }}>
			<ul className="repeat-days-ul">
				{
					repeatDisplayWeekStart(props.weekStart, days).map((day, i) => {
						return (
							<li id={ `repeat-days-li-${ i }` }
								key={ `repeat-days-li-${ i }` }>
								<input type="checkbox" 
									   id={ `repeat-days-chk-${ i }` }
									   onChange={ () => props.selectRepeatDaysState(
											props.i, 
											adjustWeekIndex(props.weekStart, i)
										) } 
									   defaultChecked={ props.repeatDays.indexOf(
											adjustWeekIndex(
												props.weekStart, 
												i
											)
										) >= 0 } 
								/>
								{ day }
							</li>
						);
					})
				}
			</ul>
			<button className="box-shadow" 
					onMouseUp={ () => props.booleanPropsChange(props.i, 'setRepeat') }>
				{ "okay" }
			</button>
		</div>
	);
};

export default RepeatDays; 