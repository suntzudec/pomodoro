export const plotPoints = [   
	[ 327, 195 ], 
	[ 425.75, 225 ], 
	[ 493.25, 285 ],
	[ 519.5, 375 ],
	[ 493.25, 468.75 ],
	[ 425.75, 538.75 ], 
	[ 339.5, 570 ], 
	[ 244.5, 538.75 ], 
	[ 187.25, 468.75 ], 
	[ 155.75, 375 ], 
	[ 176, 285 ], 
	[ 234.5, 225 ] 
];
				
export const hours = [ 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

export const minutes = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ];

export function selectCircleAdjustX(prev, i, toMin){
	const bothShift = (i === 0 || i === 10 || i === 11);
	const forMinShift = (i === 2 || i === 3 || i === 4 || i === 5);
	const ind = bothShift || (toMin && forMinShift) ? 
			8.5 
		: 
			0; 
	prev += (10 + ind);
	return prev;
} 

export function selectCircleAdjustY(prev, i){
	return prev - 10;
}  


export function setAlarmHeadingX(stateH){
	if(stateH.toString().length === 1){
		return 87.5;
	}
	else {
		return 142.5;
	}
}

export function toMinCorrections(i){
	switch(i){
		case 0:
			return 9.5;
		case 6:
		case 7:
		case 8: 
		case 9:
			return -7;	
		default:
			return 0;
	}
}

export function minuteHeadingCorrect(stateH1){
	return stateH1.toString().length === 1 ? 
			`0${ stateH1 }`
		:
			stateH1;
}

export function colonXCorrect(val){
	return val - 38;
}

export function minuteXCorrect(val){
	return val - 16;
}

export function createUnit(direct, diff){ 												
	return direct * (diff - (diff / 4)) / 4;
}

export function correctHourCycle(bool, hour){ 												
	if(bool === true){
		if(hour === 12){
			return 1;
		}
		return hour + 1;
		//return hour === 12 ? 
			//1 : hour + 1;
	}
	else {
		if(hour === 1){
			return 12;
		}
		return hour - 1;
		//return hour === 1 ? 
			//12 : hour - 1;
	}
}

export function toMinConditionValue(count){
	if(count < 0){
		return -1;
	}
	return 1;
}
	