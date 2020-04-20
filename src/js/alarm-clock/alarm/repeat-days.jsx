import React from 'react';

const week = [
	"Sunday", "Monday", "Tuesday", "Wednesday", 
	"Thursday", "Friday", "Saturday"
];

const RepeatDays = (props) => {
	return (
		<div className="repeat-days-div">
			<ul className="repeat-days-ul">
				{
					week.map((day, i) => {
						return (
							<li id={ `repeat-days-li-${ i }` }
								key={ `repeat-days-li-${ i }` }>
								<input type="checkbox" 
									   id={ `repeat-days-chk-${ i }` }
									   onChange={ () => props.selectRepeatDaysState(props.i, i) }
									   defaultChecked={ props.repeatDays.indexOf(i) >= 0 }
								/>
								{ day }
							</li>
						);
					})
				}
			</ul>
			<button onMouseUp={ () => props.booleanPropsChange(props.i, 'setRepeat') }>
				{ "okay" }
			</button>
		</div>
	);
};

export default RepeatDays; 