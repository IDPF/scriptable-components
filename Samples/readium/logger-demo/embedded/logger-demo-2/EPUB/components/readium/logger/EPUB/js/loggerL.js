

// Get a reference to the <div> on the page that will display the message text.
var loggerDiv = document.getElementById('loggerLDiv');

window.onload = function() {
	console.log('The child-window logger JS got loaded!');

    epubsc.WidgetName = "LoggerL";
	// subscribe to the epubsc event call
	//epubsc.subscribe("epubsc_event", function(msg){
	//	if (msg.data.topicData.type == "mousedown")
	//	    logMsg( loggerDiv, "Topic: [event] " + msg.data.topicData.type + " ESC: "+ msg.data.widgetId);
	//});

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

    function getCurTempData () {

        var data = {
                "currentTemp": 10.0,
                "depth" : 0.0,
                "time" : new Date()
        };

        return data;
    };

	setInterval(function() {
        var data = getCurTempData();

        logMsg( loggerDiv, "Widget LoggerL publishing [tempwave]: " + "temp: " + data.currentTemp + " at " +  formatTimeString(data.time));
        console.log( "Widget LoggerL publishing [tempwave]: " + "temp: " + data.currentTemp + " at " +  data.time);
        epubsc.publish("tempwave", data);
	},2000);

}
