import React from 'react';

import maintObj from '../time-maintenance.js'; 
import { formatSelectedList, days } from '../main-clock/format-clock-heading.js';

const getZoneTimeFromOffset = (offset) => {
	const correctedStamp = (Date.now() / 1000) + offset;
	const localOffset = new Date().getTimezoneOffset() * 60;
	return (correctedStamp + localOffset) * 1000;
};

export const assembleTimeData = (zone) => {
	const zoneCorrect = getZoneTimeFromOffset(zone.gmtOffset), 
		zoneTime = new Date(zoneCorrect),
		zoneName = zone.zoneName.split("/");
		
	const hours = zoneTime.getHours(),
		minutes = zoneTime.getMinutes(),
		minutesCorrect = minutes.toString().length === 1 ? `0${ minutes }` : minutes,
		AorP = hours >= 12 ? "PM" : "AM",
		hoursCorrect = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	
	const dateDay = zoneTime.getDate(),
		dateYear = zoneTime.getFullYear(),
		dateMonth = zoneTime.getMonth() + 1;
	
	const getLocal = () => {
		let local = zoneName[zoneName.length-1];
		
		if(zone.countryName){
			if(local !== zone.countryName){
				local += `, ${ zone.countryName }`;
			}
		}	
		
		return local.replace(/\_/g, " ");
	};
	
	const day = days[+zoneTime.getDay()], 
		date = `${ dateMonth}/${ dateDay}/${ dateYear}`,
		time = `${ hoursCorrect }:${ minutesCorrect } ${ AorP }`;
	
	return [
		getLocal(), day, 
		date, time
	]; 
};

const renderHomeClock = (offset) => {
	const zone = assembleTimeData(
		{
			gmtOffset: offset * 60 * 60,
			zoneName: 'Home'
		}
	);
	
	return formatSelectedList(zone, "home");
};

export const homeDisplayConditions = (homeDisplay, homeIndex) => {
	if(homeDisplay === false){
		return null;
	}
	
	if(homeIndex === -1){
		homeIndex = maintObj.getGeneral('homeTimezone');
	}
	
	const homeOffset = maintObj.getGeneral('zonesAndGMT')[homeIndex];
	const localOffset = new Date().getTimezoneOffset() / -60;
	
	if(homeOffset[1] !== localOffset){
		return renderHomeClock(homeOffset[1]);
	}
	
	return null;
};