import React from 'react';

const LapMarker = (props) => {
	return (
		<line id="line-marker"
			  x1={ props.x1 }
			  x2={ props.x2 }
			  y1={ props.y1 }
			  y2={ props.y2 }
			  stroke="#ffffff"
			  strokeWidth="3"
			  transform={ `rotate(${ props.rotate} ${ (props.x1 + props.x2) / 2 } ${ (props.y1 + props.y2) / 2 })` }
			  
		/>
	);
};

export default LapMarker;