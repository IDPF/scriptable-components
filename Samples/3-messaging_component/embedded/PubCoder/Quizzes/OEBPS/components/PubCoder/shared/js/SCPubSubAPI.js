/*
    A sample implementation of the IDPF scripted
    component prototocol.
    
    author: Greg Davis
    company: Pearson
    
*/

var psowapi = (function($){
	'use strict';

	var methods = {
		initialize : function(){		    
			// set up the message listener here, needs to be done for widgets and pages
			$(window).on("message", subpub.messageHandler)

			// assign an id here
			this.widgetID = subpub.genUuid()

			// todo - possibly put a mutation observer in here to watch
			// the DOM and respond to hide events with a stop request to any hidden widgets


			// setup the publishable browser event stack
			subpub.publishableBrowserEvents.forEach(function(eventName) {
                subpub.eventPublishDictionary[eventName] = {
                    active: false,
                    publish: function (e) {
                        // publish the event to subscribers here
                        psowapi.publish(eventName, new psowapi.BrowserEvent(e))
                    }
                }
            })
            
            // setup the elements that we want to stop propagation on certain events
            // right now, all inputs and textarea are being stopped to prevent bubbling
            $(document).on({
                keypress : function(e){ e.stopPropagation() },
                keyup : function(e){ e.stopPropagation() },
                keydown : function(e){ e.stopPropagation() },
                click : function(e){ e.stopPropagation() },
                mousedown : function(e){ e.stopPropagation() },
                mouseup : function(e){ e.stopPropagation() },
                touch : function(e){ e.stopPropagation() },
                touchstart : function(e){ e.stopPropagation() },
                touchend : function(e){ e.stopPropagation() }
            }, "input, textarea")

		    // fire off the loading event - not working
		    //this.send(window.parent, "epubsc_load", "loading")

            // set up the ready event
            if(window.parent != window){
                window.addEventListener("DOMContentLoaded", function(){
                    psowapi.send(window.parent, "epubsc_ready", "ready")

                    // subscribe to sysReady and add events as they come in
                    psowapi.subscribe(false, "epubsc_ready", function(e){
                        // add subscribed events to all child windows
                        var source = e.source ? e.source : e.originalEvent.source,
                            subEvents = []

                        for (var key in psowapi.subscriptions){
                            if (subpub.publishableBrowserEvents.indexOf(key) > -1){
                                subEvents.push(key)
                            }
                        }

                        for(var key in subEvents){
                            var Event = subEvents[key]
                            psowapi.subscribe(source, Event, function(e){
        		                // trigger the event here to push it up the chain
        		                $(window).trigger(Event)
        		            })
                        }

                    })

                }, false)
            }

            // set up the unload event
            if(window.parent != window){
                window.addEventListener("unload", function(){
                    psowapi.send(window.parent, "epubsc_unload", document.URL)
                })
            }
		},

		// sub-pub mechanisms here
		// message constructor
		Message : function(method, topic, message, bubbles){
			// this is a constructor, so when it's invoked as "new" this will refer 
			// only to the created object, not the whole PSO object
			this.type = "epubsc_message"
			this.method = method
			this.timestamp = +new Date() // date string
            this.id = subpub.genUuid() // unique id for the message
			this.widgetId = psowapi.widgetID // unique id for the widget during this session

			// make the payload
            this.topic = topic
            this.topicData = message

            // not sure what this does, investigate...
            this.widgetPath_ = [];            
		},

		BrowserEvent : function(e){
		    /* TODO: Decide if assigning undefined properties is bad. It means that
             *this.hasOwnProperty(X) will be true even if e.hasOwnProperty(X) is
             * false.
             */
            this.type = e.type
            this.screenX = e.screenX
            this.screenY = e.screenY
            this.button = e.button

            this.keyCode = e.keyCode
            this.charCode = e.charCode
            this.ctrlKey = e.ctrlKey
            this.altKey = e.altKey
            this.shiftKey = e.shiftKey
            this.metaKey = e.metaKey

            /* TODO: Test this. */
            if (e.touches)
            {
                /* TODO: Decide if we want to rely on Array.prototype.map. If not,
                 * we should provide an implementation.
                 */
                this.touches = e.touches.map(function (coord) {
                    return {screenX: coord.screenX, screenY: coord.screenY}
                })
            }

            this.state = e.state
            this.defaultPrevented = e.defaultPrevented
		},

		subscriptions : {}, //object to store the subscriptions per window

		subscribers : {}, //object to store the subscribers to broadcast to

		requests : {}, //request objects stored until done

		subscribe : function(target, topic, handler){
			// subscribe to messages on certain topics
			// post a message to the parent requesting a subscription
			// so the parent knows to send messages to this window
			// if no target is passed in, just add the handler
			if(typeof target == "string"){
			    // remap if the target is left out
                handler = topic
                topic = target
			    target = window.parent
			}
			
			if(target){
    			var payload = new psowapi.Message("epubsc_subscribe", topic)
    			
    			// stringify if the browser doesn't support objects
                if(subpub.postmessage_usestring()){
                    payload = JSON.stringify(payload)
                }
                
    			target.postMessage(payload, "*")
			}

			// attach the handler here to be fired on receipt of the message
		    if(topic instanceof Array){
		        for(var key in topic){
		            var Topic = topic[key]
		            pushSub(Topic, handler)
		        }
    		}
    		else {
	            pushSub(topic, handler)
    		}
    		
    		function pushSub(topic, handler){
    		    if(psowapi.subscriptions[topic] && psowapi.subscriptions[topic].handlers){
    		        psowapi.subscriptions[topic].handlers.push(handler)
    		    } else {
    			    psowapi.subscriptions[topic] = {}
    			    psowapi.subscriptions[topic].handlers = []
    			    psowapi.subscriptions[topic].handlers.push(handler)
    		    }
    		}
		},

		unsubscribe : function(target, topic, handler){
		    // remap if target is excluded
		    if(typeof target == "string"){
			    // remap if the target is left out
                handler = topic
                topic = target
			    target = window.parent
			}

			// unsubscribe from it
			var payload = new psowapi.Message("epubsc_unsubscribe", topic)

			// stringify if the browser doesn't support objects
            if(subpub.postmessage_usestring()){
                payload = JSON.stringify(payload)
            }

			target.postMessage(payload, "*")

			for(var key in psowapi.subscriptions[topic].handlers){
			    var Handler = psowapi.subscriptions[topic].handlers[key]
			    if(Handler == handler){
        			delete psowapi.subscriptions[topic].handlers[key]
			    }
			}
		},

		publish : function(topic, message){
			// publish messages to listeners
			var payload = new psowapi.Message("epubsc_publish", topic, message),
			    isEvent = subpub.isEvent(topic)
			    
			// stringify if the browser doesn't support objects
            if(subpub.postmessage_usestring()){
                payload = JSON.stringify(payload)
            }

			// loop through all subscribers and post a message
			// if it's an event, only send to subscribers
			if(psowapi.subscribers[topic]){
			    var subscribedToParent = false
				for(var key in psowapi.subscribers[topic].subscribers){
					var source = psowapi.subscribers[topic].subscribers[key].source
					if(source != window.parent || isEvent){
    					source.postMessage(payload, "*")					    
					}
					else {
					    subscribedToParent = true
					}
				}
				if(subscribedToParent && !isEvent && window.parent != window){
				    window.parent.postMessage(payload, "*")
				}
			}
		},

		send : function(target, topic, message){
		    var payload = new psowapi.Message("epubsc_publish", topic, message)
			// stringify if the browser doesn't support objects
            if(subpub.postmessage_usestring()){
                payload = JSON.stringify(payload)
            }
		    target.postMessage(payload, "*")
		}
	}

	// the internal methods for subpub
	var subpub = {
		messageHandler : function(e){
			// respond to messages here
			if(e.data == undefined) e.data = e.originalEvent.data
			// check to see if it's a string, then parse it (to support older systems that use JSON (< IE 9))
			if(typeof e.data == "string") { e.data = JSON.parse(e.data) }
            console.log("psowapi recieved message - method: "+e.data.method+" - topic: "+e.data.topic)
			// get the topic, then fire the position in
			// descriptions that holds the handler
			if(e.data.type == "epubsc_message") {
    			switch(e.data.method) {
    				case "epubsc_subscribe" :
    					subpub.subscriptionHandler(e)
    					break
    				case "epubsc_unsubscribe" :
    					subpub.unsubscribeHandler(e)
    					break
    				case "epubsc_publish" :
    					subpub.publishHandler(e)
    					break
    				case "pxelifecycle" :
    					subpub.publishHandler(e)
    					break
    				case "epubsc_send" : // not clear on how to respond to sent message... is it the same as publish?
    					subpub.sendHandler(e)
    					break
    				default :
    				    console.log("psowapi: unknown method type")
    				    break
    			}
			}

		},

        eventPublishDictionary : {},

        /**
         * An array of all publishable events.
        */
        publishableBrowserEvents : [
            "click", "dblclick", "mousedown", "mouseup", "mousemove",
            "keydown", "keypress", "keyup",
            "touchstart", "touchend", "touchmove", "touchcancel",
            "pointerdown", "pointerup", "pointercancel", "pointermove"
        ],

        isEvent : function(topic){
            var isEvent = false
			for(var key in subpub.publishableBrowserEvents){
			    var Event = subpub.publishableBrowserEvents[key]
			    if(topic == Event){
			        isEvent = true
			    }
		    }
		    return isEvent
        },

		subscriptionHandler : function(e){
			var source = e.source ? e.source : e.originalEvent.source
		    // check to see if it's an array of subscriptions
		    if(e.data.topic instanceof Array){
		        for(var key in e.data.topic){
		            subscribe(e, e.data.topic[key])
		        }
		    }
		    else {
		        subscribe(e, e.data.topic)
		    }

			function subscribe(e, topic){
			    // someone is asking to subscribe, handle it here on the receiver side
    			if(!psowapi.subscribers[topic]){
    				psowapi.subscribers[topic] = {
    					subscribers : {}
    				}
    			}
    			// push the subscriber into the subscribers array for that topic
    			psowapi.subscribers[topic].subscribers[e.data.widgetId] = {
    				source : source
    			}

    			// check to see if it's an event being asked for
    			for(var key in subpub.publishableBrowserEvents){
    			    var Event = subpub.publishableBrowserEvents[key]
    			    if(topic == Event){
    			        // it's an event, set up the publishableBrowserEvents and put a listener on the DOM
    			        // and bubble to any children
    			        $("iframe").each(function(index, item){
    			            // this only happens if the iframe is ready, otherwise it happens on ready
    			            psowapi.subscribe(item.contentWindow, topic, function(e){
    			                // trigger the event here to push it up the chain
    			                $(window).trigger(Event)
    			            })
    			        })

    			        if (subpub.eventPublishDictionary[Event]){
                            if (!subpub.eventPublishDictionary[Event].active){
                                // add an event to the window and listen for it
                                window.addEventListener(Event, subpub.eventPublishDictionary[Event].publish, false)
                                subpub.eventPublishDictionary[Event].active = true
                            }
                        }
    			    }
    			}
			}
		},
		unsubscribeHandler: function(e){
		    if(e.data.topic instanceof Array){
		        for(var key in e.data.topic){
		            var topic = e.data.topic[key]
		            unsubscribe(e, topic)
		        }
		    }
		    else {
		        unsubscribe(e, e.data.topic)
		    }

		    function unsubscribe(e, topic){
		        if(psowapi.subscribers[e.data.topic] != undefined){
        			delete psowapi.subscribers[e.data.topic].subscribers[e.data.widgetId]
        			// if there are no more subscribers, delete the whole topic
        			var size = 0
        			for(var key in psowapi.subscribers[e.data.topic].subscribers){
        				if(psowapi.subscribers[e.data.topic].subscribers.hasOwnProperty(key)) size++
        			}
        			if(size === 0) delete psowapi.subscribers[e.data.topic]

                    // look for event unsubscribes and take them off appropriately
        			for(var key in subpub.publishableBrowserEvents){
        			    var Event = subpub.publishableBrowserEvents[key]
        			    if(topic == Event){
        			        // it's an event, set up the publishableBrowserEvents and take a listener off the DOM
        			        // and bubble to any children
        			        $("iframe").each(function(index, item){
        			            psowapi.unsubscribe(item.contentWindow, topic)
        			        })

        			        if (subpub.eventPublishDictionary[Event]){
                                if (!subpub.eventPublishDictionary[Event].active){
                                    window.removeEventListener(Event)
                                    subpub.eventPublishDictionary[Event].active = false
                                }
                            }
        			    }
        			}
		        }
		    }
		},
		publishHandler : function(e){
		    var topic = e.data.topic

		    // if it's a protected topic, handle it specially
		    for(var key in subpub.requests){
		        var request = subpub.requests[key]
		        // ignore messages that have a attribute of msgOrigin to ignore key/pair of msgOrigin : pxelifecycle
		        // the PXE SDK bubbles messages that shouldn't be bubbled
		        if(topic == request && (e.data.msgOrigin == undefined)){
    		        subpub.requestHandler(e)
		        }
		    }

			// fire off the local handler here
			if(psowapi.subscriptions[topic]){
			    for(var key in psowapi.subscriptions[topic].handlers){
			        var Handler = psowapi.subscriptions[topic].handlers[key]
			        Handler(e)
			    }
    		} 

			// it should also be re-broadcast here to all other subscribers
			// if it's parent isn't subscribed, you should always broadcast to the parent
			// for re-broadcasting, you should always send to parent
			// regardless of whether or not it's an event or regular topic
			if(psowapi.subscribers[topic]){
			    var subscribedToParent = false
				for(var key in psowapi.subscribers[topic].subscribers){
					var source = psowapi.subscribers[topic].subscribers[key].source
					if(source != window.parent){
    					source.postMessage(e.data, "*")					    
					}
					else {
					    subscribedToParent = true
					}
				}
				if(subscribedToParent && window.parent != window){
				    window.parent.postMessage(e.data, "*")
				}
			}

		},
		sendHandler : function(e){
		    // not sure if we need anything here yet...
		},
		requests : [
            "epubsc_pause", "epubsc_resume"
        ],
		requestHandler : function(e){
			// protected names to help with API
			switch(e.data.topic){
				case "epubsc_pause" :
				    // re-broadcast on pause to all children
				    // IDPF required
				    subpub.rebroadcast(e)
				    break
				case "epubsc_resume" :
				    // re-broadcast on resume to all children
				    // IDPF required
				    subpub.rebroadcast(e)
				    break
				default :
				    console.log("unsupported request type")
				    break
			}
		},
		rebroadcast : function(e){
		    // used for pause and resume, blind re-broadcasting
		    if($("iframe").length > 0){
    	        $("iframe").each(function(index, item){
    	            // send it to each child widget if it's not itself
    	            if($(item)[0].contentWindow != e.originalEvent.source){
        	            psowapi.send($(item)[0].contentWindow, e.data.topic)
    	            }
    	        })
		    }
		},
		deserializeParams : function(p){
		    // strip out %20 from the URL
		    p = p.replace(/\%20/g, "")
			var ret = {},
				seg = p.replace(/^\?/,'').split('&'),
				len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret
		},
		genUuid : function(){
			var d = new Date().getTime()
		    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		        var r = (d + Math.random() * 16) % 16 | 0
		        d = Math.floor(d / 16)
		        return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16)
		    })
		    return uuid
		},
		getObject : function(win){
		    var object = {},
			    iframesOnPage = document.querySelectorAll('iframe'),
			    objectsOnPage = document.querySelectorAll('object')
            for (var i = 0; i < iframesOnPage.length; i++){
                if(win === iframesOnPage[i].contentWindow) object = iframesOnPage[i];
            }
            for (var i = 0; i < objectsOnPage.length; i++){
                var object = objectsOnPage[i]
                if(win === objectsOnPage[i].contentWindow) object = objectsOnPage[i];
            }
			return object
		},
		postmessage_usestring : function(){
            try {
                window.postMessage({ toString: false }, '*')
                console.log("yep, it accepts objects")
                return false
            } catch (e) {
                console.log("nope, it doesn't")
                return true
            }
		}
        
	}

	//the internal methods for templating and loading
	var priv = {
		isJsonString : function(str) {
		    try {
		        JSON.parse(str);
		    } catch (e) {
		        return false;
		    }
		    return true;
		}
	}

	// self initialize
	!function(){
	    methods.initialize()
	}()

	return methods
})(window.jQuery)