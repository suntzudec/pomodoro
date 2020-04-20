const days = [ 
	"Sunday", "Monday", "Tuesday", 
	"Wednesday", "Thursday", "Friday", 
	"Saturday" 
];
//look at this and possibly merge with process-time-data.js...
export const formatTime = (time) => {
	const stamp = new Date(time);
	const hours = stamp.getHours();
	const hoursCorrect = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	const minutes = stamp.getMinutes();
	const minutesCorrect = minutes.toString().length === 1 ? "0" + minutes : minutes;
	const AorP = hours >= 12 ? "PM" : "AM";
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