export function setInitialTime(){
	const stamp = Date.now(),
	      base = new Date(stamp);
		  
	let hour = base.getHours(),
		minute = base.getMinutes(),
		part = "AM";
	
	if(hour === 0){
		hour = 12;	
	}
	else if(hour > 11){
		part = "PM";
		
		if(hour > 12){
			hour -= 12;
		}
	}
	
	return [
		hour, 
		minute, 
		part
	];
}

export function multiplesOfFive(min){
	if(min < 5){
		return min;
	}
	return multiplesOfFive(min - 5);
}
