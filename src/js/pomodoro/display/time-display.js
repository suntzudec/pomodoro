export const getTimer = (timer) => {
		let timers = timer.slice(),
			minutes = timers[0].toString(),
		    seconds = timers[1].toString();
		
		if(seconds.length === 1){
			timers[1] = `0${timers[1]}`;
			
		}
		if(minutes.length === 1){
			timers[0] = `0${timers[0]}`;
		}
		
		return timers.slice(0, 2).join(":");
};
	
export const tag = (id) => document.getElementById(id);	
