import React from 'react';

export const days = [ 
	"Sunday", "Monday", "Tuesday", 
	"Wednesday", "Thursday", "Friday", 
	"Saturday" 
];

export const formatTime = (time) => {
	const stamp = new Date(time);
	const hours = stamp.getHours();
	const hoursCorrect = hours > 12 ? 
			hours - 12 
		: 
			hours === 0 ? 
					12 
				: 
					hours;
					
	const minutes = stamp.getMinutes();
	const minutesCorrect = minutes.toString().length === 1 ? 
			`0${ minutes }` 
		: 
			minutes;
			
	const AorP = hours >= 12 ? 
			"PM" 
		: 
			"AM";
			
	return `${ hoursCorrect }:${ minutesCorrect } ${ AorP }`;
};

export const formatDate = (time) => {
	const stamp = new Date(time);
	const dateDay = stamp.getDate();
	const dateYear = stamp.getFullYear();
	const dateMonth = stamp.getMonth() + 1;
	const day = days[+stamp.getDay()]; 
	return `${ day }, ${ dateMonth }/${ dateDay }/${ dateYear }`;
};

export const formatSelectedList = (time_date, i) => {
	if(document.body.clientWidth < 700){
		return (
			<li key={ i }> 
				{ time_date[0] }
				<br />
				{ `${ time_date[1] } ${ time_date[2] }, ${ time_date[3] }` }
			</li>
		);			
	}
	
	if(time_date[0].startsWith("South Georgia")){
		const slice = time_date[0].indexOf(",");
		time_date[0] = time_date[0].slice(slice + 2);
	}

	return (
		<li key={ i } 
			style={{ textAlign: 'justify', marginLeft: 'auto', marginRight: 'auto' }}>
			{ time_date[0] }
			<span style={{ float: 'right', textAlign: 'left', width: '13.75em', whiteSpace: 'nowrap' }}>
				{ `${ time_date[1] } ${ time_date[2] }, ${ time_date[3] }` }
			</span>
		</li>
	);
};