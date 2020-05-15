import * as types from './action-types.js';
import { State } from '../../state.js';

const stopWatchReducer = (state = State['stopwatch'], action) => {
	
	switch(action.type){
		case types.CHANGE_RUNNING:
			if(typeof action.bool === "boolean"){
				state['running'] = action.bool;
			}
			else {
				state['running'] = !state['running'];	
			}
			
			break;

		case types.ADD_TO_LIST: 
			state['lap-list'] = [ action.lapArr, ...state['lap-list'] ]; 
			break;
		
		case types.SET_TIME:
			state['current-time'] = action.timeArr.slice();
			break;
		
		case types.RESET_VALUES:
			state['current-time'] = [ 0, 0, 0 ];
			state['running'] = false;
			state['lap-list'] = [ ];
			break;
			
		case types.SET_REMOUNT_VALUES:
			state['remount-values'] = action.obj;
			break;
		
		default: 
			return state;
	}
	
	return Object.assign(
		{ }, state,
		state['current-time'],
		state['remount-values']
	);
};

export default stopWatchReducer;