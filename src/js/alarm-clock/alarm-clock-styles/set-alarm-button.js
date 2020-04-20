const setAlarmButtonStyle = (setAlarm) => {
	const landscape = window.screen.orientation.type.startsWith("landscape");
	
	if(setAlarm === true){
		if(window.screen.availWidth < 1000 && !landscape){
			if(window.screen.availWidth <= 379){
				return {
					fontSize: "16.5vw"
				};
			}
			if(window.screen.availWidth < 499){
				return { 
					fontSize: "14.5vw" 
				};
			}
			return { 
				fontSize: "12vw" 
			}; 
		}
		return { 
			fontSize: "7vw" 
		}; 
	}
	else if(landscape){
		return { 
			fontWeight: "600" 
		};
	}
	return null;
};

export default setAlarmButtonStyle;