const getTime = () => {
	const stamp = new Date(Date.now());
	const hours = stamp.getHours();
	const minutes = stamp.getMinutes();
	return [ hours, minutes ];
};

const correctToMilitaryTime = (time) => {
	if(time[2] === "PM" && time[0] < 12){
		time[0] += 12;
	}
	if(time[2] === "AM" && time[0] === 12){
		time[0] = 0;
	}
	return time.slice(0, 2);
};

const checkForTomorrow = (time, now) => {
	const militaryTime = correctToMilitaryTime(time);
	if(militaryTime[0] < now[0]){
		return "Tomorrow";
	}
	else if(militaryTime[0] === now[0] && militaryTime[1] <= now[1]){
		return "Tomorrow";
	}
	else {
		return null;
	}
};

const indexOf = (repeatDays, ind) => {
	return repeatDays.indexOf(ind) >= 0; 
};

const getCorrectedIVar = (repeatDays, almtime, index) => {
	const tomorrw = checkForTomorrow(almtime, getTime());
	const bothPresent = indexOf(repeatDays, index + 1) >= 0 && indexOf(repeatDays, index);
	
	if(tomorrw === "Tomorrow" && bothPresent){
		index++;
	}
	return index;
};

const getSnoozeTime = (timeArray, snooze, snoozeD) => {
	const base = new Date(snooze * 1000);

	let min = base.getMinutes(),
	    diff = min - timeArray[1];
		
	if(diff < 0){
		diff = (min + 60) - timeArray[1];
	}
	
	timeArray[1] += diff + snoozeD;
	
	if(timeArray[1] > 59){
		timeArray[1] -= 60;
		timeArray[0]++;
		
		if(timeArray[0] > 12){
			timeArray[0] -= 12;
			
			if(timeArray[2] === "PM"){
				timeArray[2] = "AM";
			}
			else {
				timeArray[2] = "AM";
			}
		}
	}	
	return timeArray;
};

export const displayWeekStart = (startNum, arr) => {
	if(startNum === 1){
		if(arr[0] === "Sun"){
			return arr.slice(1).concat([ arr[0] ]);
		}
	}
	if(startNum === 2){
		if(arr[arr.length-1] === "Sat"){
			return [ 
				arr[arr.length-1] 
			]
			.concat(
				arr.slice(0, arr.length-1)
			);
		}
	}
	return arr;
};

export const alarmDaysLabel = (alrmObj, fromClock, weekStart, snoozeDuration) => { 
	const repeat = alrmObj.repeat,
		  repeatDays = alrmObj['repeat-days'],
		  time = alrmObj.time.slice();
		
	let snoozeLabel = "";	
	
	if(alrmObj.snooze !== null && fromClock){
		snoozeLabel = getSnoozeTime(time, alrmObj.snooze, snoozeDuration);
		
		if(snoozeLabel[1].toString().length === 1){		
			snoozeLabel[1] = `0${ snoozeLabel[1] }`;
		}		
		
		snoozeLabel = ` snoozing until ${ snoozeLabel[0] }:${ snoozeLabel[1] } ${ snoozeLabel[2] }`;
	}
	if(repeat === false){
		const now = getTime();
		const tomorrowCheck = checkForTomorrow(time.slice(), now);
		
		const notActive = alrmObj.snooze === null && alrmObj.ringing === false;
		
		if(tomorrowCheck === "Tomorrow" && notActive){ 
			return tomorrowCheck;
		}
		else {
			return `Today${ snoozeLabel }`;
		}
	}
	else {
		if(repeatDays.length === 7 && fromClock === false){
			return "Everyday";
		}
		
		let i = 0;
		let label = [ ];
		
		const days = [ "Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat" ];
		
		if(fromClock === true){
			i = new Date().getDay();
			i = getCorrectedIVar(repeatDays, time.slice(), i);
		}
		
		for(; i < repeatDays.length; i++){
			label.push(days[repeatDays[i]]);	
			
			if(fromClock === true){	
				break;
			}
		}
		
		if(weekStart !== 0 && fromClock === false){
			label = displayWeekStart(weekStart, label);
		}
		
		return label.join(", ") + snoozeLabel;
	}
};

export const checkForDismissOnReplaceCase = (replaceTime) => {
	const mRTime = correctToMilitaryTime(replaceTime.slice());
	const now = getTime();
	
	if(mRTime[0] < now[0] || mRTime[0] - now[0] > 1){
		return false;
	}
	if(mRTime[0] - now[0] === 1){
		if(mRTime[1] < now[1]){
			let mRMin = mRTime[1] += 60;
			return mRMin - now[1] <= 10;
		}
		else {
			return false;
		}
	} 
	else if(mRTime[0] === now[0]){
		return mRTime[1] - now[1] <= 10;
	}
	return false;
};

export const checkForDismissOnRepeatDaysChange = function(repdays, alarm){	
	const today = new Date().getDay();
	
	if(repdays.indexOf(today) === -1){			
		alarm['dismiss'] = false;
	}
};