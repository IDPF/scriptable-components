// and get the ID of the div we'll print messages to
var controllerDiv = document.getElementById('controllerDiv');
// Get the window displayed in the iframe.
var receiver = document.getElementById('receiver').contentWindow;

window.onload = function() {
	
    console.log("onLoad event in parent");

    // This code lifted from: http://davidwalsh.name/window-iframe
	// listen for messages
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
	    var key = e.message ? "message" : "data";
	    var data = e[key];
	    
	    console.log("Got event in parent" + data);

	    logMsg(controllerDiv, "Message Received in Parent: " + e.data + " : " + new Date());
		
		receiver.postMessage("Hello Sonny! Got yer message","*");

	},false);
	
	function logMsg( elm, msg ) {
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}

}


