import * as types from './action-types.js';

export const setIndex = (index, key) => ({
	type: types.INDEX,
	index: index,
	key: key
});

export const changeSelect = (part) => ({
	type: types.SELECT,
	part: part 
});

export const changeHomeClockDisp = () => ({
	type: types.HOME_DISP
});

export const recordPrevHash = (hash) => ({
	type: types.PREV_HASH,
	hash: hash
});

export const changeValue = (key, value) => ({
	type: types.VALUE_CHANGE,
	key: key,
	value: value
});

export const increaseVolume = () => ({
	type: types.VOLUME_INCR
})