window.onload = function() {
	// Get a reference to the <div> on the page that will display the message text.
	var loggerDiv = document.getElementById('loggerDiv');
	console.log('The logger JS got loaded!');

	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log(e);
		// Check to make sure that this message came from the correct domain.
		// Unfortunately, this doesn't work within an EPUB
		// if (e.origin !== "http://www.geofx.com")
		//     return;

		loggerDiv.style.height= window.frameElement.offsetHeight + "px";
		// Update the div element to display the message.
		var newMsg = document.createTextNode("Message Received: " + e.data + " : " + new Date());
		loggerDiv.appendChild(newMsg);
		loggerDiv.appendChild(document.createElement("br"));
		loggerDiv.scrollTop = loggerDiv.scrollHeight;		
	}

	//	document.domain = "http://www.geofx.com";
	// Setup an event listener that calls receiveMessage() when the window
	// receives a new MessageEvent.
	window.addEventListener('message', receiveMessage);
}
