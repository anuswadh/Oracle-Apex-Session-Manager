// List of Page Designer Application IDs
const pageDesignerApps = [
  101,  4050, 4300, 4350,
  4400, 4411, 4500, 4550,
  4700, 4750, 4800, 4850,
  4900, 8801, 8802, 8803,
  8804, 8805, 8806, 8807,
  8808, 8809, 8810, 8811,
  8812, 8813, 8814, 8815,
  8816, 8817, 8818, 8819,
  8820, 8821, 8822, 8823,
  8824, 8825, 8826, 4000,
];

var mainSessionId;

// Listen for session creation event
chrome.runtime.onMessage.addListener((message) => {
 

  if (message.action === "updateTabs") {
	  
	console.log(JSON.stringify(message));


  
    // Get all open tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
		  url = new URL(tab.url);
		  const sessionIdMatchtab = tab.url.match(/f\?p=\d+(:\d+){2}:/);
		  if(sessionIdMatchtab){
			params = new URLSearchParams(url.search);
			  console.log(params);
			  var sessionId = params.get('p').split(':')[2];
			  var appId = params.get('p').split(':')[0];


			// Check if the tab is an Oracle Apex page and not in the Page Designer
			if (
				appId 
				&& 
				(
					(pageDesignerApps.includes(parseInt(appId, 10)) &&	pageDesignerApps.includes(parseInt(message.mainAppId, 10))) //either both apps are backend apps
					||
					(appId === message.mainAppId) // if not backend app then just update the one app
				)
				
			) {
			  // Update the session ID in the URL
			 if (!(message.mainSessionId === sessionId)) {
				// Reload the tab to update the session ID
							
				var newP = 'p=' + params.get('p').replace(sessionId, message.mainSessionId);
				url.search = '?' + newP;
				chrome.tabs.update(tab.id, { url: url.toString() });
				
			  }
			}else{// reload all the front end tabs too -- because of the developer toolbar
				  chrome.tabs.reload(tab.id);
			  }		  
		   }
		  
      });
    });
	
	
	chrome.extension.getViews({ type: 'popup' }).forEach((view) => {
	  view.close(); // Hide the popup view
	});
  }
});
