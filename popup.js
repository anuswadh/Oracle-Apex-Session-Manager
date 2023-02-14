


document.addEventListener('DOMContentLoaded', (details) => {
  debugger;
  console.log('Popup loaded!');
  console.log('details = ',details);
  console.log('details srcElement = ',details.srcElement);
  console.log('details srcElement url= ',details.srcElement.url);
  
  var mainSessionId;
  	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	  const currentUrl = tabs[0].url;
	  console.log(currentUrl);
	  
	   const appIdMatch = tabs[0].url.match(/f\?p=(\d+)/);
	  // if (appIdMatch && !pageDesignerApps.includes(parseInt(appIdMatch[1], 10))) {
		// Get the current session ID
		const sessionIdMatch = tabs[0].url.match(/f\?p=\d+(:\d+){2}:/);
		if (sessionIdMatch) {
			var url = new URL(tabs[0].url);
			var params = new URLSearchParams(url.search);
			mainSessionId = params.get('p').split(':')[2];	
			mainAppId = params.get('p').split(':')[0];	
		  // Send a message to the background script to update the session ID in all open tabs
		  	chrome.runtime.sendMessage({ action: 'updateTabs' , mainSessionId: mainSessionId, mainAppId: mainAppId});

		}
	});




});