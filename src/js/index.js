import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Link, Redirect, 
		 HashRouter as Router } from 'react-router-dom';   
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';	
	 
import NotFound from './404/notfound.jsx'; 

import pomodoroReducer from './pomodoro/redux/reducer.js'; 
import AppPomodoroConnect from './pomodoro/redux/container.js';

import clockReducer from './clock/redux/reducer.js';
import AppClockConnect from './clock/redux/container.js';

import alarmClockReducer from './alarm-clock/redux/reducer.js';
import AppAlarmClockConnect from './alarm-clock/redux/container.js';

import stopWatchReducer from './stopwatch/redux/reducer.js';
import AppStopWatchConnect from './stopwatch/redux/container.js';

import initSW from './workers/service/init-sw.js';
import apiCallWorkerHandler from './workers/web/api-call-worker.js';

import settingsReducer from './settings/redux/reducer.js';
import AppSettingsConnect from './settings/redux/container.js';


const reducers = combineReducers({
	clockReducer,
	pomodoroReducer,
	alarmClockReducer,
	stopWatchReducer,
	settingsReducer //TEST
});

const store = createStore(reducers);

const SWCondition = process.env.NODE_ENV === "production" && 'serviceWorker' in navigator;
const typeofWorker = typeof Worker !== 'undefined';

if(typeofWorker === true){
	apiCallWorkerHandler();
}

if(SWCondition === true){
	initSW();
} 

const Routing = () => (
	<React.StrictMode>
		<Router>
			<header id="header"
					className="header">
				<nav>
					<ul id="nav-list">
						<li className="nav-link">
							<Link to='/clock'>
								<span className="far fa-clock" />
							</Link>
						</li>
						<li className="nav-link">
							<Link to='/alarm-clock'>
								<span className="far fa-bell" />  
							</Link>
						</li>
						<li className="nav-link">
							<Link to='/pomodoro-clock'>
								<span className="far fa-hourglass" />
							</Link>
						</li>
						<li className="nav-link">
							<Link to='/stopwatch'>
								<span className="fas fa-stopwatch" />
							</Link>
						</li>
						<li className="nav-dots">
							<Link to='/settings'>
								<span className="fa fa-ellipsis-v" />
							</Link>		
						</li>
					</ul>
				</nav> 
			</header>
			<div id="routing-container">
				<Switch>
					<Route exact path="/">
						<Redirect to="/pomodoro-clock" />
					</Route>
					<Route path='/pomodoro-clock' component={ AppPomodoroConnect } />
					<Route path='/stopwatch' component={ AppStopWatchConnect } />
					<Route path='/alarm-clock' component={  AppAlarmClockConnect } />
					<Route path='/clock' component={ AppClockConnect } />
					<Route path='/settings' component={ AppSettingsConnect } />
					<Route path='/404' component={ NotFound } /> 
					<Route> 
						<Redirect to='/404' />
					</Route>
				</Switch>
			</div>
		</Router> 
	</React.StrictMode>
);  	

ReactDOM.render(<Provider store={ store }>
					<Routing />
				</Provider> , document.getElementById("app"));	 			