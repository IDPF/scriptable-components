
// Get a reference to the <div> on the page that will display the message text.
var loggerDiv = document.getElementById('loggerDiv');

window.onload = function() {
	console.log('The child-window logger JS got loaded!');

	// subscribe to the epubsc event call
	epubsc.subscribe("epubsc_event", function(msg){
		if (msg.data.topicData.type == "mousedown")
		    logMsg( loggerDiv, "Topic: [event] " + msg.data.topicData.type + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_ready", function(msg){
		logMsg( loggerDiv, "Topic: [ready] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_pause", function(msg){
		logMsg( loggerDiv, "Topic: [pause] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_resume", function(msg){
		logMsg( loggerDiv, "Topic: [resume] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_load", function(msg){
		logMsg( loggerDiv, "Topic: [load] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_unload", function(msg){
		logMsg( loggerDiv, "Topic: [unload] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("tempwave", function(msg){
		logMsg( loggerDiv, "Topic: [tempwave] " + " ESC: "+ msg.data.widgetId + " temperature: " + msg.data.topicData.currentTemp + " at: " + msg.data.topicData.time);
	});

	function logMsg( elm, msg ) {
		elm.style.height = window.frameElement.offsetHeight + "px";
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}	

}
