const initSW = function(){
	window.addEventListener('load', function(){
		
			navigator.serviceWorker
					 .register('/sw.js')
					 .then(register => {
						 
					register.onupdatefound = function(){
						if(navigator.serviceWorker.controller){
							const installingWorker = register.installing;
							
							installingWorker.onstatechange = function(){
								switch(installingWorker.state){
									case 'installed':
										break;
									
									case 'redundant':
										throw new Error(
											'The installing service worker became redundant.'
										);
									
									default:
								 }
							};
						}
					};
			})
			.catch(error => console.log("error: ", error))
		});
};

export default initSW;