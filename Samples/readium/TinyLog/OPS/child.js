

window.onload = function() {
	console.log("onLoad event in child!");
	var loggerDiv = document.getElementById('loggerDiv');
		
	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log("child window:receiveMessage");

		logMsg(loggerDiv, "Message Received in Child: " + e.data + " : " + new Date());	
	}
	
	function logMsg( elm, msg ) {
		elm.style.height = window.frameElement.offsetHeight + "px";
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}

	// listen for messages
	window.addEventListener('message', receiveMessage);

	setInterval(function() {
		// Send the message "Hello" to the parent window
		parent.postMessage("Hello Dad","*");
	},2000);
}
