import * as types from './action-types.js';
import { State } from '../../state.js';

const settingsReducer = (state = State['settings'], action) => {
	switch(action.type){
		case types.SELECT:
			const toTrue = state['select'][action.part] === false;
			const anyTrue = Object.values(state['select']).indexOf(true) >= 0;
			
			if(toTrue && anyTrue){
				break;
			}
			
			state['select'] = Object.assign(
				{ }, state['select'],
				{ [action.part]: !state['select'][action.part] }
			);
			
			break;
			
		case types.INDEX:
			state['indices'] = Object.assign(
				{ }, state['indices'], 
				{ [action.key]: action.index }
			);
			
			break;
			
		case types.HOME_DISP: 
			state['home-display'] = !state['home-display'];
			
			break;
			
		case types.PREV_HASH:
			state['prev-hash'] = action.hash;
			
			break;
			
		case types.SNOOZE_DURATION:
			state['snooze-duration'] = action.value;
			
			break;
			
		case types.VALUE_CHANGE:
			state['values'] = Object.assign(
				{ }, state['values'], 
				{ [action.key]: action.value }
			);
			
			break;
		
		case types.VOLUME_INCR:
			state['increase-vol'] = !state['increase-vol'];
			
			break;
	}
	
	return Object.assign(
		{ },
		state
	);
};

export default settingsReducer;