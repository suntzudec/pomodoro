const setAlarmButtonStyle = (setAlarm) => {
	//const landscape = window.screen.orientation.type.startsWith("landscape");
	const { clientWidth } = document.body;
	const landscape = clientWidth > document.body.clientHeight;
	
	if(setAlarm === true){
		if(clientWidth < 1050 && !landscape){
			if(clientWidth <= 379){
				return {
					fontSize: "16.5vw"
				};
			}
			if(clientWidth < 499){
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