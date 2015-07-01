/**
 * This code was written by David Walsh.  See
 *   http://davidwalsh.name/pubsub-javascript
 *   
 *  Usage:
 *    Publishing to a topic:
 *
 *        events.publish('/page/load', {
 *           url: '/some/url/path' // any argument
 *        });
 *
 *    Subscribing to said topic in order to be notified of events:
 *
 *        var subscription = events.subscribe('/page/load', function(obj) {
 *           // Do something now that the event has occurred
 *        });
 *
 *    Unsubscribing...
 *
 *        subscription.remove();
 */
var eventBus = (function() {
    var instance;
    
    function init() { 
    	var privateVar = "zot";
    }
    
    function createInstance() {
        var instance = init();
    } 

    return {
        topics : {},
        //var hOP = topics.hasOwnProperty,    
        
       getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    
        subscribe: function(topic, listener) {
        	console.log("eventBus::subscribe: " + topic + ", listener: " + listener);
        	debugger;
        	
            // Create the topic's object if not yet created
            if (!eventBus.topics.hasOwnProperty.call(eventBus.topics, topic)) 
            	eventBus.topics[topic] = [];

            // Add the listener to queue
            var index = eventBus.topics[topic].push(listener) -1;

            // Provide handle back for removal of topic
            return {
                remove: function() {
                    delete eventBus.topics[topic][index];
                }
            };
        },
    
        publish: function(topic, info) {
        	console.log("eventBus::publish: " + topic + ", info: " + info);
        	debugger;
        	
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if (!eventBus.topics.hasOwnProperty.call(eventBus.topics, topic)) 
                return;

            // Cycle through topics queue, fire!
            eventBus.topics[topic].forEach(function(item) {
                item(info != undefined ? info : {});
            });
        }
    };
})();