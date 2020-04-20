import * as types from './action-types.js';

export const showListing = () => ({
	type: types.LISTING
});

export const updateCurrentTime = () => ({
	type: types.TIME_UPDATE
});

export const selectTimeZones = (index, instr) => ({
	type: types.SELECT_ZONES,
	index: index,
	instr: instr
});