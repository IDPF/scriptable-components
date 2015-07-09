// and get the ID of the div we'll print messages to
var controllerDiv = document.getElementById('controllerDiv');

window.onload = function() {
	console.log('The parent-window JS got loaded!');
	
	// Get the window displayed in the iframe.
	//var receiver = document.getElementById('receiver').contentWindow;

	// subscribe to the epubsc event call
    epubsc.subscribe("epubsc_event", function(msg){
        if (msg.data.topicData.type == "mousedown")
            logMsg( controllerDiv, "Topic: [event] " + msg.data.topicData.type + " ESC: "+ msg.data.widgetId);
    });

    epubsc.subscribe("epubsc_ready", function(msg){
        logMsg( controllerDiv, "Topic: [ready] " + " ESC: "+ msg.data.widgetId);
    });

    epubsc.subscribe("epubsc_pause", function(msg){
        logMsg( controllerDiv, "Topic: [pause] " + " ESC: "+ msg.data.widgetId);
    });

    epubsc.subscribe("epubsc_resume", function(msg){
        logMsg( controllerDiv, "Topic: [resume] " + " ESC: "+ msg.data.widgetId);
    });

    epubsc.subscribe("epubsc_load", function(msg){
        logMsg( controllerDiv, "Topic: [load] " + " ESC: "+ msg.data.widgetId);
    });

    epubsc.subscribe("epubsc_unload", function(msg){
        logMsg( controllerDiv, "Topic: [unload] " + " ESC: "+ msg.data.widgetId);
    });
    
    function logMsg( elm, msg ) {
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}


}


