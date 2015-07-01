// and get the ID of the div we'll print messages to
var controllerDiv = document.getElementById('controllerDiv');
// Get the window displayed in the iframe.
var receiver = document.getElementById('receiver').contentWindow;

//LauncherOSX
//
//  Created by Ric Wright
//  Copyright (c) 2015 Readium Foundation and/or its licensees. All rights reserved.
//  
//  Redistribution and use in source and binary forms, with or without modification, 
//  are permitted provided that the following conditions are met:
//  1. Redistributions of source code must retain the above copyright notice, this 
//  list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice, 
//  this list of conditions and the following disclaimer in the documentation and/or 
//  other materials provided with the distribution.
//  3. Neither the name of the organization nor the names of its contributors may be 
//  used to endorse or promote products derived from this software without specific 
//  prior written permission.
//  
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
//  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
//  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
//  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
//  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
//  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
//  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
//  OF THE POSSIBILITY OF SUCH DAMAGE.

window.onload = function() {
	
    console.log("onLoad event in parent");

    // This "eventer" code lifted from: http://davidwalsh.name/window-iframe
    
	// listen for messages
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	eventer(messageEvent,function(e) {
	    var key = e.message ? "message" : "data";
	    var data = e[key];
	    
	    console.log("Got event in parent" + data);

	    logMsg(controllerDiv, "Message Received in Parent: " + e.data + " : " + new Date());
		
		receiver.postMessage("Hello Sonny! Got yer message","*");

	},false);
	
	function logMsg( elm, msg ) {
    	var newMsg = document.createTextNode(msg);
    	elm.appendChild(newMsg);
    	elm.appendChild(document.createElement("br"));
    	elm.scrollTop = elm.scrollHeight;
	}
	
	/**
	 * Receive published events
	 */
	function receivePub( info ) {
		console.log("receivePub: " + info);
		logMsg(controllerDiv, "receivePub: " + info);
	}
	
	// listen for messages
	function receiveMessage(e) {
		console.log("parent window:receiveMessage");
		debugger;
	}

	window.addEventListener('click', receiveMessage);

	debugger;
	
    var instance1 = eventBus.getInstance();
    var instance2 = eventBus.getInstance();
    console.log("Same instance? " + (instance1 === instance2));  

    eventBus.id1 = "zot";
  	eventBus.subscribe('esc_ready', receivePub);
  	eventBus.subscribe('click', receivePub);    
}


