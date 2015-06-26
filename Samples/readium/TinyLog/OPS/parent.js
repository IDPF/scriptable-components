// and get the ID of the div we'll print messages to
var controllerDiv = document.getElementById('controllerDiv');
// Get the window displayed in the iframe.
var receiver = document.getElementById('receiver').contentWindow;

window.onload = function() {
	
    console.log("onLoad event in parent");

	// listen for messages
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
	    var key = e.message ? "message" : "data";
	    var data = e[key];
	    //run function//
	    
	    console.log("Got event in parent" + data);

	    var newMsg = document.createTextNode("Message Received in Parent: " + e.data + " : " + new Date());
		controllerDiv.appendChild(newMsg);
		controllerDiv.appendChild(document.createElement("br"));
		controllerDiv.scrollTop = controllerDiv.scrollHeight;
		
		receiver.postMessage("Hello Sonny! Got yer message","*");

	},false);
}


