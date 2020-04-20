const convertLowest = (arr) => { 
	return arr[2] + (arr[1] * 100) + (arr[0] * 6000); 
};

export const setLowestValueFromLapList = (lapList) => {
	let lowest;
	lapList.forEach(arr => { 
		if(!lowest){
			lowest = arr[0];
		}
		else if(convertLowest(arr[0]) < convertLowest(lowest)){
			lowest = arr[0];
		}
	
		return arr;
	});
	return lowest;
};

const getLapTime = (prevTime, curr) => {
	const units = [ 60, 100 ];
	let i;
	
	for(i = curr.length-1; i >= 0; i--){
		curr[i] -= prevTime[i];
		
		if(i > 0){
			if(curr[i] < 0){
				curr[i-1]--;
				curr[i] += units[i-1];
			}
		}
	}
	console.log(curr, "curr nums")
	return curr;
};

export const calcAddLap = (prevTime, curr) => {
	if(prevTime === null){
		return curr;
	}
	else {
		return getLapTime(prevTime, curr);
	}
};

export const trackSvgScaling = () => {
	const layout = window.screen.orientation.type === "landscape-primary";
	return document.body.clientWidth > 700 ? 
			{ 
				transform: `scale(${ document.body.clientWidth / 700 })`, 
				top: !layout ? '5vw' : '2.5vw', 
				left: !layout ? '-3vw': '-1.5vw' 
			} 
		: 
			null;
};
