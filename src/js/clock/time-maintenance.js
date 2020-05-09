const zoneNames = [ 
	"Anchorage", "Chicago", "Athens", "Auckland", 
	"Baghdad", "Bangkok", "Berlin", "Bogota", "Cairo", 
	"Copenhagen", "Costa Rica", "Damascus", 
	"Denver", "Detroit", "Dubai", "Dublin", "Hong Kong", 
	"Jerusalem", "Kabul", "Johannesburg", "Moscow", 
	"Paris", "Port-au-Prince", "Santiago", "Seoul", "Shanghai", 
	"Sydney", "Tehran", "Toronto", "Vancouver", "Tijuana", 
	"Mexico City", "Tokyo", "Vienna", "Marquesas", "Pago_Pago", 
	"Gambier", "St Johns", "Cape Verde", "South Georgia", "Fiji", 
	"Chatham", "Apia", "Kolkata", "Karachi", "Yangon", "Eucla", 
	"Darwin", "Midway", "Honolulu", "Buenos Aires", "Bougainville", 
	"Apia", "Brisbane", "Azores", "Reykjavik", "London"
];

const zonesAndGMT = (data) => {
	return JSON.parse(data).map(item => {
		let zone = item.zoneName.split("/").reverse();
			zone[0] = zone[0].replace(/\_/g, " ")
		return [ 
			zone, 
			item.gmtOffset / 60 / 60 
		];	
	})
	.reduce((acc, curr) => {
		const presence = zoneNames.indexOf(curr[0][0]) !== -1;
		if(presence){
			acc.push(curr);
		}
		return acc;
	}, [ ])
	.sort((a, b) => a[1] - b[1]);
};

const selectedToTop = (selected, baseData) => {
	if(!selected.length){
		return baseData; 
	}
		
	let parsed = JSON.parse(baseData).slice(), 
		selectedArray = [ ],
		correction = 0;
	
	selected.sort((a, b) => a - b)
			.forEach(index => {
		let item = parsed[index - correction];
			parsed = parsed.slice(0, index - correction)
						   .concat(parsed.slice(index + 1 - correction));
			
		selectedArray.push(item);
		correction++;
		
		return index;
	});
	
	return JSON.stringify(
		selectedArray.concat(parsed)
	);
};

const homeTimezone = (tzData) => {
	const gmtOffset = new Date().getTimezoneOffset() / -60;
	let i = 0;
	
	for(i in tzData){
		if(tzData[i][1] === gmtOffset){
			return i;
		}
	}
};

const MaintenanceObj = function(){
	const key = { };
	
	const TMStore = function(){
		const obj = { };
		return function(testkey){
			if(key === testkey){
				return obj;
			}
			
			return null;
		};
	};
	
	const MaintenanceObj = function(){
		this._ = TMStore();
	};
	
	MaintenanceObj.prototype.getGeneral = function(prop){
		return this._(key)[prop];
	};
	
	MaintenanceObj.prototype.setSelectedToTop = function(arr){
		this._(key)['selectedToTop'] = selectedToTop(arr, this._(key)['baseData']);
	};
	
	MaintenanceObj.prototype.setBaseData = function(data){
		const whole = this._(key);
		whole['baseData'] = data;
		whole['zonesAndGMT'] = zonesAndGMT(whole['baseData']);
		whole['homeTimezone'] = homeTimezone(whole['zonesAndGMT']);
		
	};
	
	MaintenanceObj.prototype.truncate = function(start, end){
		if(!this._(key)['baseData']){
			return [ ];
		}
		
		const parsed = JSON.parse(this._(key)['baseData']);
		
		return parsed.slice(start, end);
	};
	
	return MaintenanceObj;
}();

const maintObj = new MaintenanceObj();

export default maintObj;