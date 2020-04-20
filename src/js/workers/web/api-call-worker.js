import codeToObjectURL from './to-object-url.js';
import apiWorker from './worker.js'; 

import maintObj from '../../clock/time-maintenance.js';

const inspectTMdata = (data, mark) => {
	const toNum = +mark;
	
	if(typeof toNum !== "number" || Date.now() >= toNum){ 
		return false;
	}		
	
	const tmReg = /^\[(\{\"countryCode\"\:\"[A-Z]{2}\"\,\"countryName\"\:\".+\"\,\"zoneName\"\:\"[A-Za-z/_-]+\"\,\"gmtOffset\"\:\-?[0-9]+\,\"timestamp\"\:[0-9]+\}\,?)+\]$/;
	
	return tmReg.test(data);
};  

const check_SetTMData = () => {
	const { tm_data, entry } = window.localStorage;
	
	if(tm_data && inspectTMdata(tm_data, entry)){
		maintObj.setBaseData(tm_data);		
	
		return true;
	}
	return false; 
};

const localStorageProps = function(msgData){
	window.localStorage.tm_data = msgData; 
	window.localStorage.entry = (Date.now() + 604800000).toString(); 	
};

const apiCallWorkerHandler = function(){
	if('localStorage' in window){
		let dataSet = check_SetTMData();
		
		if(dataSet === true){
			return;
		}
	}
	
	let worker = codeToObjectURL(apiWorker);
	
	worker.postMessage("listing");
		
	worker.onmessage = function(message){
		if(message['data']){
			maintObj.setBaseData(message['data']);  				
	
			localStorageProps(message['data']);
			
			worker.terminate();
			worker = null; 
		}  												
	};
	
	worker.onerror = function(error){
		console.log("error: " + error);
	};
};

export default apiCallWorkerHandler;