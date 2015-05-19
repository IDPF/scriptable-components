window.onload = function() {
	// Get a reference to the <div> on the page that will display the
	// message text.
	var messageEle = document.getElementById('receiverDiv');

	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log(e);
		// Check to make sure that this message came from the correct domain.
		//if (e.origin !== "http://s.codepen.io")
		//	return;

		// Update the div element to display the message.
		messageEle.innerHTML = "Message Received: " + e.data;
	}

//	document.domain = "http://demos.matt-west.com";
	// Setup an event listener that calls receiveMessage() when the window
	// receives a new MessageEvent.
	window.addEventListener('message', receiveMessage);
}
