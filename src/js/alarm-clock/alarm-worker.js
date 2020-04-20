const alarmWorkerScript = function(){
	let stamp,
		list,
		alarm_present = null,
		interval = null,
		currentRing = null;
	
	const returnMessage = (node) => {	
		self.postMessage(JSON.stringify(node));
	};
	
	function LinkedList(){
		let head = null;
		let length = 0;
		let upperIndex = 0;
		
		var Node = function(serial, power, timestamp, strObj){
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
			return serial
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
			return (snooze - stamp) + 60/* 0 */;
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
		
		this.updateTimestamp = function(days, node){
			let prev = days[0],
				curr = days[1];
				
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
		
		this.generateNewTimestamp = function(node){ 
			const nodeData = JSON.parse(node.data);				//console.log(nodeData, "gen new time")
			const calcDay = (value) => {
				const min = Math.min.apply(null, nodeData['repeat-days']);
				const max = Math.max.apply(null, nodeData['repeat-days']);
				
				if(value >= max){ 
					return min;
				}
				else if(value < min){
					return max;
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
				const day = new Date(node.timestamp * 1000).getDay();
				const nextDay = calcDay(day);	
				this.updateTimestamp([ day, nextDay ], node);
			}
			else {												//console.log("node: ", node, " turned off")
				returnMessage({ 
					"OFF": node.serial 
				});
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
	
	const buildTimeStamp = (listTime) => {				
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		const base = listTime;
		const corrected = processTimeArr(base);	
		const dateObj = new Date(year, month, day, corrected[0], corrected[1]); 
		let newStamp = dateObj.getTime();
		
		if(newStamp < Date.now()){	
			newStamp += (86400 * 1000);
		}	
		
		return newStamp / 1000;								
	};
	
	const compare_alarm_present = (current_ap, next_ap) => { 
		if(current_ap === next_ap){
			return;
		}
		
		returnMessage({
			"ALARM_PRESENT": next_ap
		});
		
		alarm_present = next_ap;
	};
	
	const checkCurrentRing = (serial) => {
		if(serial === currentRing){				//console.log("currentRing = serial: ", currentRing)
			currentRing = null;
		}
	};
	
	const hasProp = (item, str) => {
		return item.hasOwnProperty(str); 
	};
	
	const listInstanceController = (obj) => { //console.log(obj, "obj @ listInstanceController", listInstance.head());	
		if(hasProp(obj, 'time')){
			const node = listInstance.traverseNextPathForSerialValue(obj.serial);
			
			if(node){
				node.data = JSON.stringify(obj);
				node.power = obj.power === "on";
				node.snooze = obj.snooze; 

				checkCurrentRing(node.serial);
				
				if(node.timestamp < Date.now()/1000 && !node.snooze){ 
					node.timestamp = buildTimeStamp(obj['time'].slice());
				}
			}
			else {
				listInstance.addNextPath(buildTimeStamp(obj['time'].slice()), obj);
			}
		}
		else if(hasProp(obj, "REMOVE")){
			listInstance.removeNextPathAt(obj["REMOVE"]);	
		}
		else if(hasProp(obj, "REPLACE")){
			const node = listInstance.traverseNextPathForSerialValue(obj['REPLACE'].serial);
			if(node){
				node.data = JSON.stringify(obj["REPLACE"]); 
				node.timestamp = buildTimeStamp(obj["REPLACE"]["time"].slice());	
			}
		}
		else if(hasProp(obj, "DISMISS")){			
			const node = listInstance.traverseNextPathForSerialValue(obj['DISMISS']);
			if(node){
				listInstance.generateNewTimestamp(node);
				checkCurrentRing(node.serial);
			}
		}
		else if(hasProp(obj, "RINGING_ENDED")){		
			const node = listInstance.traverseNextPathForSerialValue(obj["RINGING_ENDED"].serial);
			console.log("RINGING ENDED, WORKER!")
			if(node){
				checkCurrentRing(node.serial)
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
	
	const clearInt = () => {									
		self.clearInterval(interval);
		interval = null;
	};
	
	const director = (stringed) => {
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
	
	const simultaneousRinging = (arr, mess) => {		//console.log(arr, mess, "top of simultaneousRinging")
		arr.map((item,i) => {
			if(i === 0 && mess){
				returnMessage(item);
				currentRing = item.serial;				//console.log("simultaneousRinging, if: currentRing = ", item.serial)
			}
			else {							//console.log("simultaneousRinging, else, generated new timestamp")
				listInstance.generateNewTimestamp(arr[i]);
			}
		});
	};		
	
	const timeTracker = () => {
		interval = self.setInterval(
			function(){
				stamp = Date.now();
				
				let matchNode = listInstance.traverseNextPathForStampValue(stamp / 1000);
				let dismissNodes = listInstance.traverseNextPathForDismissArray(stamp / 1000); 
				
				if(matchNode && currentRing === null){
					simultaneousRinging(matchNode, true)
				}
				else if(matchNode && currentRing !== null){
					simultaneousRinging(matchNode, false)
				}
				
				
				if(dismissNodes){	
					returnMessage({
						"DISMISS": dismissNodes 
					});
				}	
				if(!listInstance.size()){ 	
					clearInt();
				}
		}, 1000); 
	}
	
	self.addEventListener("message", (e) => {	
		director(e.data);
	});
};

export default alarmWorkerScript;