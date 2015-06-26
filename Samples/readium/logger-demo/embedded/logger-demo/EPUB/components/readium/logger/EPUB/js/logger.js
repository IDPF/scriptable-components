var ESC_READY       = "epubsc_ready";
var ESC_PAUSE       = "epubsc_pause";
var ESC_RESUME      = "epubsc_resume";
var ESC_LOAD        = "epubsc_load";
var ESC_UNLOAD      = "epubsc_unload";
var ESC_EVENT       = "epubsc_event";
var ESC_SUBSCRIBE   = "epubsc_subscribe";
var ESC_UNSUBSCRIBE = "epubsc_unsubscribe";
var ESC_PUBLISH     = "epubsc_publish";
var ESC_MESSAGE     = "epubsc_message";
var LOGGER_ID       = "7179a8d3-55d7-409c-9752-0a4cd10dcb72";

window.onload = function() {
	// Get a reference to the <div> on the page that will display the message text.
	var loggerDiv = document.getElementById('loggerDiv');
	console.log('The child-window logger JS got loaded!');

	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log("child window:receiveMessage");
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

	/*
	function sendReadyMsg() {
		var epubsc_message = {
		        "componentId": LOGGER_ID,
		        "messageId": LOGGER_ID + Date.now(),
		        "timestamp": Date.now(),
		        "type": ESC_MESSAGE,
		        "method": ESC_PUBLISH,
		        "topic": ESC_READY
		};
		parent.postMessage('Hello Daddy!', '*' ); //'http://www.geofx.com');

	}
	*/
	
	setInterval(function() {
		// Send the message "Hello" to the parent window
		parent.postMessage("Hello Dad!","*");
	},2000);
	
	// listen for messages
	window.addEventListener('message', receiveMessage);
	// let everyone know we're ready
	//sendReadyMsg();
}
