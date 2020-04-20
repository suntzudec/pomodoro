import * as types from './action-types.js';

export const changeToMin = (value) => ({ 
	type: types.TOMIN,
	value: value 	
});

export const changeMoveToMin = (value) => ({ 
	type: types.MOVETOMIN,
	value: value
});

export const removeAlarm = (index) => ({
	type: types.REMOVEALARM,
	index: index
});

export const setAlarmEdit = (value) => ({ 
	type: types.SETALARMEDIT,
	value: value
}); 

export const editAlarmTime = () => ({	
	type: types.EDITALARMTIME
});											

export const addAlarm = (obj) => ({ 
	type: types.ADDALARM,
	obj: obj
});

export const selectRepeatDays = (index, liIndex) => ({
	type: types.REPEATDAYS,
	liIndex: liIndex,
	index: index
});

export const listPowerChangeState = (index, value) => ({
	type: types.LISTPOWERCHANGE,
	index: index,
	value: value
});

export const listLabelChangeState = (index, str) => ({
	type: types.LABELCHANGE,
	index: index,
	str: str
});

export const changeBooleanListProps = (index, prop) => ({ 
	type: types.BOOLEANLISTPROPS,
	index: index,
	prop: prop
});

export const selectRingTone = (index, liIndex) => ({ 
	type: types.SELECTRINGTONE,
	index: index,
	liIndex: liIndex
});

export const setAlarmChange = () => ({ 
	type: types.SETALARM
});

export const updateCurrentAlarm = (value, index) => ({
	type: types.CURRENTALARM,
	value: value,
	index: index
});

export const initRinging = (serial, bool, ended) => ({
	type: types.RINGING,
	serial: serial,
	bool: bool,
	ended: ended
});

export const setAlarmPresent = (index) => ({ //TEST
	type: types.ALARM_PRESENT,
	index: index
});

export const setDismiss = (index, bool) => ({	//TEST
	type: types.DISMISS,
	index: index,
	bool: bool
});	//TEST

export const initSnooze = (index) => ({	//TEST
	type: types.SNOOZE,
	index: index
});	//TEST