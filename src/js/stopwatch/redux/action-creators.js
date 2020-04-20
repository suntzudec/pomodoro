import * as types from './action-types.js';

export const changeRunning = (bool) => ({
	type: types.CHANGE_RUNNING,
	bool: bool
});

export const addCurrentLapToList = (lapArr) => ({ 
	type: types.ADD_TO_LIST,
	lapArr: lapArr
});

export const setCurrentTime = (timeArr) => ({
	type: types.SET_TIME,
	timeArr: timeArr
});

export const resetMainStateValues = () => ({
	type: types.RESET_VALUES
});

export const setRemountValues = (obj) => ({
	type: types.SET_REMOUNT_VALUES,
	obj: obj
});
