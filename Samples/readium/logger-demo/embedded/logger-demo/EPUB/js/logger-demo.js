// and get the ID of the div we'll print messages to
var controllerDiv = document.getElementById('controllerDiv');
//Get the window displayed in the iframe.
var receiver = document.getElementById('receiver').contentWindow;

window.onload = function() {
	console.log('The parent-window JS got loaded!');
	
	// Get the window displayed in the iframe.
	var receiver = document.getElementById('receiver').contentWindow;
	
	// Get a reference to the 'Send Message' button.
	var btn = document.getElementById('send');
	

	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log("parentwindow:receiveMessage: " + e);

		logMsg(controllerDiv, "Message Received: " + e.data );
	}

	// A function to handle sending messages.
	function sendMessage(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

		// Send a message with the text 'Hello Receiver!' to the receiver window.
		receiver.postMessage('Hello Logger!', '*' ); //'http://www.geofx.com');
		
		// Update the div element to display the sent-message.
		var d = new Date();
		logMsg( controllerDiv, d.toLocaleTimeString());
	}

    // This code lifted from: http://davidwalsh.name/window-iframe	
	// listen for messages
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
	    var key = e.message ? "message" : "data";
	    var data = e[key];
	    
	    console.log('Got event in parent' + data);
	    logMsg(controllerDiv, "Msg Rec: " +  e.data + " : " + new Date());

		receiver.postMessage("Hello Sonny! Got yer message","*");

	},false);

	function logMsg( elm, msg ) {
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}

	// Add an event listener to sendMessage() when the send button is clicked.
	btn.addEventListener('click', sendMessage);
}


