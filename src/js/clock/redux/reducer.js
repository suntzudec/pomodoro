import * as types from './action-types.js';
import { State } from '../../state.js';

let frozenIndices = [ ];

const clockReducer = (state = State['clock'], action) => { 
	switch(action.type){
		case types.LISTING:
			state['listing'] = !state['listing'];
			if(state['listing'] === true){
				frozenIndices = state['indices'].slice().sort((a, b) => a - b);
			}
			break;
			
		case types.TIME_UPDATE:
			state['stamp'] = Date.now();
			break;
			
		case types.SELECT_ZONES:
			if(action.instr === "filter"){ 
				state['indices'] = state['indices'].filter(
					(num, i) => action.index < state['indices'].length ?
							num !== frozenIndices[action.index] 
						: 
							num !== action.index
					);  
			}
			else if(action.instr === "push"){
				state['indices'].push(
					action.index
				);					
			}
			
			break;
			
		case types.CALL_FLAG:
			state['call'] = !state['call'];
			break;
			
		default:
			return state;	
		
	};
	return Object.assign(
		{ }, state,
		state['indices']
	); 
};

export default clockReducer;