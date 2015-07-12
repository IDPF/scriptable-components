// and get the ID of the div we'll print messages to
var controllerDiv = document.getElementById('controllerDiv');

window.onload = function() {
	console.log('The parent-window JS got loaded!');
	
	// Get the window displayed in the iframe.
	//var receiver = document.getElementById('receiver').contentWindow;
    
    function logMsg( elm, msg ) {
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}


}


