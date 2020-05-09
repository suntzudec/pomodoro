let initNumber = 25;

export const State = {
	'pomodoro': {
		'session': initNumber,
		'break': 5,
		'timer': [ 
			initNumber, 
			0, "Session" 
		],
	},
	
	'alarm-clock': {
		'alarm-list': [ ], 
		'current-alarm': [ 12, 0, "AM" ], 
		'setAlarm': false,
		'toMin': false, 
		'moveToMin': true,
		'alarmEditIndex': null,
		'alarmListIndexChanged': null,
		'alarm_present': null, 
		'isRinging': null,
		'vol-change': 0 
	},
	
	'clock': { 
		'stamp': Date.now(),
		'indices': [ ],
		'listing': false
	},
	
	'stopwatch': {
		'current-time': [ 0, 0, 0 ],
		'lap-list': [ ],
		'running': false,  
		'remount-values': { }
	},
	
	"settings": { 
		'indices': {
			'home': -1,
			'alarm': 0,
			'silence': 3,
			'week-start': 0
		},
		'select': {
			'home': false,
			'alarm': false,
			'silence': false,
			'snooze': false,
			'increase-vol': false, 
			'alarm-vol': false,
			'week-start': false
		},
		'home-display': true,
		'prev-hash': '#/pomodoro-clock',
		'values': {
			'snooze': '5',
			'increase-vol': '30', 
			'alarm-vol': '50'
		},
		'increase-vol': true
	}
};

export const StateCopy = JSON.parse(JSON.stringify(State['pomodoro']));