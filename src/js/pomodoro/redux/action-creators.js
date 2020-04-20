import * as types from './action-types.js';

export const changeBreak = (num) => ({
	type: types.CHANGE_BREAK,
	num: num
});

export const refreshSession = () => ({
	type: types.REFRESH
});

export const playSession = () => ({
	type: types.PLAY
});

export const changeSession = (num) => ({
	type: types.CHANGE_SESSION,
	num: num
});