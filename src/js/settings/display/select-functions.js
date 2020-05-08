const minutePresentation = (num) => {
	const whole = Math.floor(num),
		  base = (num - whole) / 1.6666,
		  str = base.toFixed(2).toString();
		 
	return `${ whole }:${ str.slice(2) }`;
};

export const gmtZonePresentation = (arr) => {
	if(!arr){
		return null;
	}
	
	const gmtNum = arr[1]
	let disp = "";
	
	if(gmtNum >= 0){
		disp = "+";
	}
	
	return `(GMT${ disp }${ minutePresentation(gmtNum) }) ${ arr[0][0] }`;
}; 

export const getRingtoneName = (item) => item['name'];

export const addMinuteLabel = (value) => {
	if(typeof value === "number"){
		if(value === 1){
			return `${ value } minute`;
		}
		
		return `${ value } minutes`;
	}
	
	return value;
};

export const getWeekStart = (day) => day;

export const rangeUnit = (num, part) => {
	if(num === "1" && part.length){
		part = part.slice(0, -1);
	}
	return part;
};