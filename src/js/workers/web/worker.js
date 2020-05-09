const apiWorker = function(){
	let sortArray = [ ];
	
	const sortData = (data) => {
		data.sort((a, b) => {
			let aName = a.zoneName.split("/");
				aName = aName[aName.length-1];
				
			let bName = b.zoneName.split("/");
				bName = bName[bName.length-1];
				
			const aPlace = sortArray.indexOf(aName);
			const bPlace = sortArray.indexOf(bName);
			
			return aPlace - bPlace;
		});
		return data;
	};
	
	const buildSorter = (data) => {
		data.map(item => {
			let name = item.zoneName.split("/");
				name = name[name.length-1];
			if(sortArray.indexOf(name) === -1){
				sortArray.push(name);
			}
			return item;
		});
			
		sortArray.sort();
		return sortData(data);
	};
	
	const getTimezoneList = () => {
		const key = "KPGTHZZ3YV88";
		fetch(`https://api.timezonedb.com/v2.1/list-time-zone?key=${key}&format=json`)
			.then(data => data.json())
			.then(d => {
				const zoneD = buildSorter(d.zones);
			
				self.postMessage(
					JSON.stringify(zoneD)
				);
			})
			.catch(error => console.log("error: ", error));
	};
	
	self.addEventListener('message', function(e){
		if(e.data === "listing"){
			getTimezoneList();
		}
	});
};

export default apiWorker;
