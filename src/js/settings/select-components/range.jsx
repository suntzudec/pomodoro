import React from 'react';

import { rangeUnit } from '../display/select-functions.js';

const Range = (props) => {       
	return (
		<div id="carousel-cont" 
			 className="range">
			<div id="value-col">
				<h2 id="value">
					{ props.value }
					<br />
					<span>
						{ ` ${ rangeUnit(props.value, props.unit) }` }
					</span>
				</h2>
			</div>
			<div id="wrapper-col">	
				<div id="wrapper">
					<input type="range" 
						   min={ props.min }
						   max={ props.max }
						   step={ props.step } 
						   defaultValue={ props.value } 
						   onChange={ (e) => props.changeValueState(props.part, e.target.value) } 
					/>
				</div>
			</div>	
			<div id="button-col">
				<button onMouseUp={ () => props.changeSelectState(props.part) }> 
					{ "set" }
					<br />
					{ props.disp }
				</button>
			</div>
		</div>
	);
};

export default Range;    