const alarmWorkerScript = function(){
	let stamp,
		list,
		setRepeat = false,
		alarm_present = null,
		interval = null,
		currentRing = null,
		alarmSettingsObj = { },
		ringLimit = 0,
		increaseVol = 0;
	
	const buildTimeStamp = (listTime) => {				
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		const base = listTime.slice(); //TEST
		const corrected = processTimeArr(base);	
		const dateObj = new Date(year, month, day, corrected[0], corrected[1]); 
		let newStamp = dateObj.getTime();
		
		if(newStamp < Date.now()){	
			newStamp += (86400 * 1000);
		}	
		
		return newStamp / 1000;								
	};
	
	const returnMessage = function(node){	
		self.postMessage(JSON.stringify(node));
	};
	
	function LinkedList(){
		let head = null;
		let length = 0;
		let upperIndex = 0;
		
		const Node = function(serial, power, timestamp, strObj){
			this.serial = serial;
			this.timestamp = timestamp;
			this.data = JSON.stringify(strObj);
			this.power = power === "on";
			this.snooze = strObj.snooze;				
			this.next = null;
		};  
	  
		this.size = function(){
			return length;
		};
		
		this.head = function(){
			return head;
		};
		
		this.upperIndex = function(){
			return upperIndex;
		};
	  
		this.isEmpty = function(){
			return length === 0;
		};
		
		this.addNextPath = function(stamp, obj){ 
			if(obj['serial'] > upperIndex){
				upperIndex = obj['serial'];
			}
			
			const newNode = new Node(
				obj['serial'], 
				obj['power'], 
				stamp, 
				obj
			);
			
			if(head === null){
				head = newNode;
			}
			else {
				let currentNode = head;
				
				while(currentNode.next){
					currentNode = currentNode.next;
				}
				currentNode.next = newNode;
			}
			length++;
		};
		
		this.getCorrectedTimeStampForLowestValue = function(node){
			if(node.snooze !== null){
				return node.timestamp + this.calculateStampWSnooze(node.timestamp, node.snooze);
			}
			return node.timestamp;
		};
		
		this.getSerialByLowestStampValue = function(){ 
			if(head === null){
				return null;
			}
			
			let currentNode = head;
			let lowestStamp;
			let serial = null;
			
			while(currentNode){
				if(lowestStamp === undefined && currentNode.power === true){
					serial = currentNode.serial;
					lowestStamp = this.getCorrectedTimeStampForLowestValue(currentNode);	
				}
				else if(this.getCorrectedTimeStampForLowestValue(currentNode) < lowestStamp && currentNode.power === true){
					serial = currentNode.serial;
					lowestStamp = this.getCorrectedTimeStampForLowestValue(currentNode);
				}
				
				currentNode = currentNode.next;
			}
			return serial;
		};
		
		this.traverseNextArrayListForPower = function(){
			if(head === null){
				return null;
			}
		
			let currentNode = head;
			let nextArray = [ ];
		
			while(currentNode){
				nextArray.push(currentNode.power);
				currentNode = currentNode.next;
			}
			return nextArray;
		};
	  
		this.traverseNextPathForSerialValue = function(serial){		
			let currentNode = head;
			
			while(currentNode){
				if(currentNode.serial === serial){
					 return currentNode;
				}
			
				currentNode = currentNode.next;
			}
			return null;
		};
		
		this.calculateStampWSnooze = function(stamp, snooze){
			return (snooze - stamp) + alarmSettingsObj['snooze-duration'];
		};
		
		this.traverseNextPathForStampValue = function(stamp){ 
			stamp = +stamp.toFixed(0);
			let currentNode = head;
			const nodeArr = [ ]; 
			
			while(currentNode){
				let alarmStamp = currentNode.timestamp; 
				
				if(currentNode.snooze !== null){
					alarmStamp += this.calculateStampWSnooze(alarmStamp, currentNode.snooze);
				}
				if(alarmStamp === stamp && currentNode.power){
					nodeArr.push(currentNode);
				}
				
				currentNode = currentNode.next;
			}
			
			if(nodeArr.length){		
				return nodeArr;
			}	
				
			return null;
		};
		
		this.traverseNextPathForDismissArray = function(stamp){ 	
			let currentNode = head;
			let dismissArray = [ ];
			
			stamp = +stamp.toFixed(0);
			
			while(currentNode){
				let base = currentNode.timestamp - stamp;
				let currData = JSON.parse(currentNode.data).dismiss === false;
				
				if(base <= 600 && currentNode.power && currData){
					 dismissArray.push(currentNode);
				}
				
				currentNode = currentNode.next;
			}
			
			if(dismissArray.length){
				return dismissArray;
			}
			
			return null;
		};	
		
		this.removeNextPathAt = function(serial){
			if(head === null){
				return head;
			}
			
			let currentNode = head;
			let previousNode;
			
			if(head.serial === serial){
				head = currentNode.next;
				return;
			}
			
			while(currentNode){
				if(currentNode.serial === serial){
					break;
				}	
				previousNode = currentNode;
				currentNode = currentNode.next;
			}
			previousNode.next = currentNode.next;
			length--;
		};
		
		this.nextPathAtSerial = function(serial){
			if(head === null){
				return head;
			}
			if(serial > upperIndex || serial < 0){
				return null;
			}
			
			let currentNode = head;
			while(serial !== currentNode.serial){
				currentNode = currentNode.next;
			}
			
			return currentNode;
		};
		
		this.nodeDismissToFalse = function(data){	
			const parsed = JSON.parse(data); 
			parsed.dismiss = false;
			
			return JSON.stringify(parsed);
		};	
		
		this.updateTimestamp = function(days, node){
			let prev = days[0],
				curr = days[1],
				diff;
				
			function dayGap(init, i){
				if(prev === curr){
					diff = i;
					return;
				}
				
				i++;  
				prev++;
				
				if(prev === 7){
					prev = 0;
				}
				dayGap(prev, i);
			}
			dayGap(prev, 0);							
			node.timestamp += (86400 * diff);
		};
		
		this.generateNewTimestamp = function(node, millistamp){ 
			const nodeData = JSON.parse(node.data);				
			const calcDay = (value) => {
				const min = Math.min.apply(null, nodeData['repeat-days']);
				const max = Math.max.apply(null, nodeData['repeat-days']);
				
				if(value >= max || value < min){ 
					return min;
				}
				else {
					let val = value + 1,
						newDay;
						
					!function incre(){
						if(!val){
							newDay = val;
							return; 
						}
						else if(val === max){
							newDay = val;
							return;
						}
						else if(nodeData['repeat-days'].indexOf(val) >= 0){
							newDay = val;
							return;
						}
						else {
							val++;
							incre();
						} 
					}();
					
					return newDay;
				}
			};
			
			if(nodeData['repeat'] === true){ 
				const stamp = this.setStampFromArguments(node.timestamp, millistamp);
				const day = new Date(stamp).getDay(); 
				const nextDay = calcDay(day);							
				this.updateTimestamp([ day, nextDay ], node);
			}
			else {												
				returnMessage({ 
					"OFF": node.serial 
				});
			}
		};
		
		this.setStampFromArguments = function(nodestamp, millistamp){
			if(millistamp){
				return millistamp;
			}
			return nodestamp * 1000;
		};
		
		this.checkRepeatDaysForDay = function(repData, stamp){
			return repData.indexOf(new Date(stamp).getDay()) === -1;
		};
		
		this.commonConditions = function(snooze, setRep){
			return setRep === false && !snooze;
		};
		
		this.buildTSForRepeat = function(setRepBool, repeat){
			return setRepBool === true && repeat === true;
		};
		
		this.buildTSForNoRepeat = function(node, repeat){
			const secStamp = Date.now() / 1000;
			return node.timestamp < secStamp && repeat === false && node.power === true;
		};
		
		this.turnOffRepeat = function(node, obj){
			const repeat = JSON.parse(node.data).repeat;
			return repeat === true && node.power === true && obj.repeat === false;
		};
		
		this.manageSetRepeat = function(node){
			const data = JSON.parse(node.data);
			
			if(this.buildTSForNoRepeat(node, data.repeat) && this.commonConditions(node.snooze, data.setRepeat)){ 
				node.timestamp = buildTimeStamp(data['time']/*.slice()*/);
			} 
			
			if(data.setRepeat === true){
				setRepeat = true;
			}
			else if(this.buildTSForRepeat(setRepeat, data.repeat) && this.commonConditions(node.snooze, data.setRepeat)){
				const initStamp = buildTimeStamp(data['time']/*.slice()*/);				
				node.timestamp = initStamp;			
				
				if(this.checkRepeatDaysForDay(data['repeat-days'], initStamp * 1000)){		
					this.generateNewTimestamp(node);
				}
				
				setRepeat = false;
			} 
		};
	}

	const listInstance = new LinkedList();	
	
	const processTimeArr = (base) => {
		if(base[2] === "PM" && base[0] < 12){
			base[0] += 12;
		}
		if(base[2] === "AM" && base[0] === 12){	
			base[0] = 0;
		}	
		
		return base;
	};
	
	const compare_alarm_present = function(current_ap, next_ap){ 
		if(current_ap === next_ap){
			return;
		}
		
		returnMessage({
			"ALARM_PRESENT": next_ap
		});
		
		alarm_present = next_ap;
	};
	
	const checkCurrentRing = function(serial){ 
		if(serial === currentRing){				
			currentRing = null;
		}
	};
	
	const volumeLimitCheck = () => {
		return alarmSettingsObj['alarm-vol'] + ((ringLimit / alarmSettingsObj['increase-vol']) * 10);
	};
	
	const checkVolumeIncrease = () => {
		return increaseVol === alarmSettingsObj['increase-vol'] && volumeLimitCheck() <= alarmSettingsObj['for-increase'];
	};
	
	const setForIncrease = (alarmVol) => {
		let ones = alarmVol.toString();
			ones = +ones[ones.length-1];
			
		return 100 + ones;
	};
	
	const checkForceEnd = () => {
		return alarmSettingsObj['silence'] !== "Never" && ringLimit >= alarmSettingsObj['silence'];
	};
	
	const ringingSettingsTasks = function(){   
		ringLimit++;		
		
		if(alarmSettingsObj['increase-bool'] === true){
			increaseVol++;		
			
			if(checkVolumeIncrease()){
				increaseVol = 0;		
				
				returnMessage({ 
					"VOL": currentRing 
				});
			}
		}
		
		if(checkForceEnd()){
			returnMessage({ 
				"FORCE_END": currentRing 
			});
		}
	};
	
	const checkForRingingTasks = () => {
		return alarmSettingsObj['silence'] !== "Never" || alarmSettingsObj['increase-bool'] === true;
	};
	
	const ringingTasksDirector = function(){
		if(currentRing !== null){
			if(checkForRingingTasks()){ 
				ringingSettingsTasks();
			}
		}
		if(currentRing === null && ringLimit > 0){
			ringLimit = 0;
			increaseVol = 0;
		}
	};
	
	const listInstanceController = function(obj){ 
				console.log(obj, "top of listInstance controller", Object.assign({},listInstance.head()))
		if('time' in obj){
			const node = listInstance.traverseNextPathForSerialValue(obj.serial);
			
			if(node){
				const nodeData = JSON.parse(node.data);
				const repeatStatus = nodeData.repeat === true && obj.repeat === false;
				
				if(repeatStatus && node.power === true){
					node.timestamp = buildTimeStamp(obj['time']/*.slice()*/);
				}
				
				node.data = JSON.stringify(obj);
				node.power = obj.power === "on";
				node.snooze = obj.snooze;  
				
				checkCurrentRing(node.serial);
				
				listInstance.manageSetRepeat(node);
			}
			else {
				listInstance.addNextPath(
					buildTimeStamp(obj['time']/*.slice()*/), 
					obj
				);
			}
		}
		else if('silence' in obj){		
			alarmSettingsObj = Object.assign(
				{ }, 
				alarmSettingsObj, 
				obj,
				{ "for-increase": setForIncrease(obj['alarm-vol']) }
			);
			return;
		}	
		else if("REMOVE" in obj){
			listInstance.removeNextPathAt(obj["REMOVE"]);	
		}
		else if("REPLACE" in obj){ 
			const node = listInstance.traverseNextPathForSerialValue(obj['REPLACE'].serial);
			console.log(node, "node")
			if(node){
				node.data = JSON.stringify(obj["REPLACE"]); 
				node.power = true;	//TEST
				node.timestamp = buildTimeStamp(obj["REPLACE"]["time"].slice());	
			}
		}
		else if("DISMISS" in obj){	
			const node = listInstance.traverseNextPathForSerialValue(obj['DISMISS']);
			
			if(node){
				node.data = listInstance.nodeDismissToFalse(node.data);
				listInstance.generateNewTimestamp(node);
				checkCurrentRing(node.serial);
			}
		}
		else if("RINGING_ENDED" in obj){		
			const node = listInstance.traverseNextPathForSerialValue(obj["RINGING_ENDED"].serial);	
			
			if(node){
				checkCurrentRing(node.serial);
				listInstance.generateNewTimestamp(node);
			}
		}			
		compare_alarm_present(alarm_present, listInstance.getSerialByLowestStampValue());
	};
	
	const alarmPowerCheck = () => {
		let power = listInstance.traverseNextArrayListForPower();
		
		if(power !== null){
			power = power.find(bool => bool === true);
		}
		
		const length = listInstance.size();
		return Boolean(length && power); 
	};
	
	const clearInt = function(){									
		self.clearInterval(interval);
		interval = null;
	};
	
	const director = function(stringed){
		list = JSON.parse(stringed);
		listInstanceController(list);
		
		if(alarmPowerCheck() === true){
			if(typeof interval !== "number"){
				timeTracker();
			}
		}
		else {
			clearInt();
		}
	};
	
	const simultaneousRinging = function(arr, mess){
		arr.forEach((item, i) => {
			if(i === 0 && mess){
				returnMessage(item);
				currentRing = item.serial;
			}
			else {							
				listInstance.generateNewTimestamp(arr[i]);
			}
		});
	};		
	
	const timeTracker = function(){
		interval = self.setInterval(
			function(){ 
				stamp = Date.now();
				
				let secs = stamp / 1000;
				
				const matchNode = listInstance.traverseNextPathForStampValue(secs);
				const dismissNodes = listInstance.traverseNextPathForDismissArray(secs); 
				
				if(matchNode){					
					const isNull = currentRing === null;
					simultaneousRinging(matchNode, isNull);
				}
				
				ringingTasksDirector(); 
				
				if(dismissNodes){	
					returnMessage({
						"DISMISS": dismissNodes 
					});
				}	
				if(listInstance.isEmpty()){ 	
					clearInt();
				}
		}, 1000); 
	}
	
	self.addEventListener("message", function(e){	
		director(e.data);
	});
};

export default alarmWorkerScript;