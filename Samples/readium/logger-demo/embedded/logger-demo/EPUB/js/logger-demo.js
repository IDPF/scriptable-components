// and get the ID of the div we'll print messages to
var controllerDiv = document.getElementById('controllerDiv');

window.onload = function() {
	console.log('The parent-window JS got loaded!');
	
	// Get the window displayed in the iframe.
	var receiver = document.getElementById('receiver').contentWindow;
	
	// Get a reference to the 'Send Message' button.
	var btn = document.getElementById('send');
	

	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log("parentwindow:receiveMessage: " + e);
		// Check to make sure that this message came from the correct domain.
		// Unfortunately, this doesn't work within an EPUB
		// if (e.origin !== "http://www.geofx.com")
		//     return;

		var newMsg = document.createTextNode("Message Received: " + e.data );
		controllerDiv.appendChild(newMsg);
		controllerDiv.appendChild(document.createElement("br"));
		controllerDiv.scrollTop = controllerDiv.scrollHeight;		
	}

	// A function to handle sending messages.
	function sendMessage(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

		// Send a message with the text 'Hello Receiver!' to the receiver window.
		receiver.postMessage('Hello Logger!', '*' ); //'http://www.geofx.com');
		
		// Update the div element to display the sent-message.
		var d = new Date();
		var newMsg = document.createTextNode(d.toLocaleTimeString() + " " + d.toLocaleTimeString()+ " " + d.toLocaleTimeString()+ " " + d.toLocaleTimeString()+ 
				      " " + d.toLocaleTimeString()+ " " + d.toLocaleTimeString()+ " " + d.toLocaleTimeString());
		controllerDiv.appendChild(newMsg);
		controllerDiv.appendChild(document.createElement("br"));
		controllerDiv.scrollTop = controllerDiv.scrollHeight;
	}

	
	// listen for messages
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
	    var key = e.message ? "message" : "data";
	    var data = e[key];
	    //run function//
	    
	    console.log('Got event in parent' + data);
		controllerDiv.appendChild(data);
		controllerDiv.appendChild(document.createElement("br"));
		controllerDiv.scrollTop = controllerDiv.scrollHeight;

	},false);

	// Add an event listener to sendMessage() when the send button is clicked.
	btn.addEventListener('click', sendMessage);
}


