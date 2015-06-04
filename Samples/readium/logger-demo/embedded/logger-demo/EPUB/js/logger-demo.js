window.onload = function() {
	// Get the window displayed in the iframe.
	var receiver = document.getElementById('receiver').contentWindow;
	var iframeWindow = top.frames['receiver'];
	console.log('iFrameWindow ' + iframeWindow);
	
	// Get a reference to the 'Send Message' button.
	var btn = document.getElementById('send');

	// handle the load event to alert listeners that we are ready
	receiver.onload = function() {
		  console.log("receiver iframe is loaded");
	}

	var controllerDiv = document.getElementById('controllerDiv');

	// handle the load event to alert listeners that we are ready
	//iframeWindow.onload = function() {
	//	  console.log("receiver iframewindow is loaded");
	//}

	// A function to handle sending messages.
	function sendMessage(e) {
		// Prevent any default browser behaviour.
		e.preventDefault();

		// Send a message with the text 'Hello Receiver!' to the receiver window.
		receiver.postMessage('Hello Logger!', '*' ); //'http://www.geofx.com');
		
		// Update the div element to display the sent-message.
		var newMsg = document.createTextNode("Message Sent: " + new Date());
		controllerDiv.appendChild(newMsg);
		controllerDiv.appendChild(document.createElement("br"));
		controllerDiv.scrollTop = controllerDiv.scrollHeight;
	}

	// Add an event listener that will execute the sendMessage() function
	// when the send button is clicked.
	btn.addEventListener('click', sendMessage);
}
