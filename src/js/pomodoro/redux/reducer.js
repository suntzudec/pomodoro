import * as types from './action-types.js';
import { State, StateCopy } from '../../state.js'; //changed

const pomodoroReducer = (state = State['pomodoro'], action) => {
	const timeManager = (timer) => {
		if(timer[0] === 0 && timer[1] === 0){
			if(timer[2] === "Session"){
				timer = [ 
					state['break'], 
					0, "Break"
				];
			}
			else {
				timer = [ 
					state['session'], 
					0, "Session" 
				];
			}
		}	
		else if(timer[1] === 0){
			timer[0]--;
			timer[1] = 59;
		}
		else {
			timer[1]--;
		}
		return timer;
	};
	 
	switch(action.type){
		case types.CHANGE_BREAK:
			if(state['break'] === 1 && action.num === -1){
				break;
			}
			if(state['break'] === 60 && action.num === 1){
				break;
			}
			
			state['break'] += action.num;
			
			if(state['timer'][2] === "Break"){
				state['timer'][0] = state['break'];
			}
			
			break;
			
		case types.PLAY:
			state['timer'] = timeManager(state['timer']);
			break;
		
		case types.REFRESH:
			state = Object.assign(
				{ }, 
				StateCopy
			);
			
			state['timer'] = StateCopy['timer'].slice();
			break;
			
		case types.CHANGE_SESSION:
			if(state['session'] === 1 && action.num === -1){
				break;
			}
			
			if(state['session'] === 60 && action.num === 1){
				break;
			}
			
			state['session'] += action.num;

			if(state['timer'][2] === "Session"){
				state['timer'][0] = state['session'];
			}	

			break;
			
		default:
			return state;
	}
	
	return Object.assign(
		{ }, 
		state
	);  
}

export default pomodoroReducer;