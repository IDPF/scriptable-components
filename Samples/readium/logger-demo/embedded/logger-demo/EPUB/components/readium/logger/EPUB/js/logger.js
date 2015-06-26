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

// Get a reference to the <div> on the page that will display the message text.
var loggerDiv = document.getElementById('loggerDiv');

window.onload = function() {
	console.log('The child-window logger JS got loaded!');

	// A function to process messages received by the window.
	function receiveMessage(e) {
		console.log("child window:receiveMessage");

		logMsg(loggerDiv, "Msg Rec: " + e.data + " : " + new Date());
	}
	
	function logMsg( elm, msg ) {
		elm.style.height = window.frameElement.offsetHeight + "px";
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}	
	setInterval(function() {
		// Send the message "Hello" to the parent window
		parent.postMessage("Hello Dad!","*");
	},2000);
	
	// listen for messages
	window.addEventListener('message', receiveMessage);
}
