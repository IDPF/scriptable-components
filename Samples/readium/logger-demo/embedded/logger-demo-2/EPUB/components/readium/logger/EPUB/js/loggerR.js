
// Get a reference to the <div> on the page that will display the message text.
var loggerDiv = document.getElementById('loggerRDiv');

window.onload = function() {
	console.log('The child-window logger JS got loaded!');

    /**
     * Pad an integer with the specified number of leading zeroes.
     *
     * @param num
     * @param places
     * @returns {string}
     */
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    /**
     *  Return a nicely formatted, UNIX-style string
     *
     * @returns {string}
     */
    function formatTimeString( date ) {
        var hours = zeroPad(date.getHours(),2);
        var minutes = zeroPad(date.getMinutes(),2);
        var seconds = zeroPad(date.getSeconds(),2);
        var ms = zeroPad(date.getMilliseconds(),3);
        var day = zeroPad(date.getDate(), 2);
        var month = zeroPad((date.getMonth() + 1),2);
        var year = date.getFullYear().toString();
        var timeDate = year + month + day + " " + hours + ":" + minutes + ":" + seconds + "." + ms;

        return timeDate;
    }

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

	epubsc.subscribe("tempwave", function(msg) {
        var ID = msg.data.widgetId;
        var time = formatTimeString( new Date(msg.data.topicData.time));
		logMsg( loggerDiv, "Topic: [tempwave] " + " ESC: "+ ID.substr(0,9) + ",  temp: " + msg.data.topicData.currentTemp + " at: " + time);
	});

	function logMsg( elm, msg ) {
		elm.style.height = window.frameElement.offsetHeight + "px";
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}	

}
