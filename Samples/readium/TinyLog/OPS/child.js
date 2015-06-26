

window.onload = function() {
	console.log("onLoad event in child!");
	var loggerDiv = document.getElementById('loggerDiv');
		
	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log("child window:receiveMessage");

		loggerDiv.style.height= window.frameElement.offsetHeight + "px";
		// Update the div element to display the message.
		var newMsg = document.createTextNode("Message Received in Child: " + e.data + " : " + new Date());
		loggerDiv.appendChild(newMsg);
		loggerDiv.appendChild(document.createElement("br"));
		loggerDiv.scrollTop = loggerDiv.scrollHeight;		
	}
	
	// listen for messages
	window.addEventListener('message', receiveMessage);

	setInterval(function() {
		// Send the message "Hello" to the parent window
		parent.postMessage("Hello Dad","*");
	},2000);
}
