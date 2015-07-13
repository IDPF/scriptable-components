
// Get a reference to the <div> on the page that will display the message text.
var loggerRDiv = document.getElementById('loggerRDiv');

window.onload = function() {
	console.log('The child-window logger JS got loaded!');

	// subscribe to the epubsc event call
	epubsc.subscribe("epubsc_event", function(msg){
		if (msg.data.topicData.type == "mousedown")
		    logMsg( loggerRDiv, "Topic: [event] " + msg.data.topicData.type + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_ready", function(msg){
		logMsg( loggerRDiv, "Topic: [ready] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_pause", function(msg){
		logMsg( loggerRDiv, "Topic: [pause] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_resume", function(msg){
		logMsg( loggerRDiv, "Topic: [resume] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_load", function(msg){
		logMsg( loggerRDiv, "Topic: [load] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("epubsc_unload", function(msg){
		logMsg( loggerRDiv, "Topic: [unload] " + " ESC: "+ msg.data.widgetId);
	});

	epubsc.subscribe("tempwave", function(msg) {
        var ID = msg.data.widgetId;
        var time = formatTimeString( new Date(msg.data.topicData.time));
		logMsg( loggerRDiv, "Topic: [tempwave] " + " ESC: "+ ID.substr(0,9) + ",  temp: " + msg.data.topicData.currentTemp + " at: " + time);
	});

}
