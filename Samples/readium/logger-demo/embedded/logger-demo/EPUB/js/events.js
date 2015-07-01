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
var events = (function(){
    var topics = {};
    var hOP = topics.hasOwnProperty;

    return {
        subscribe: function(topic, listener) {
            // Create the topic's object if not yet created
            if (!hOP.call(topics, topic)) topics[topic] = [];

            // Add the listener to queue
            var index = topics[topic].push(listener) -1;

            // Provide handle back for removal of topic
            return {
                remove: function() {
                    delete topics[topic][index];
                }
            };
        },
    
        publish: function(topic, info) {
            // If the topic doesn't exist, or there's no listeners in queue, just leave
            if (!hOP.call(topics, topic)) 
                return;

            // Cycle through topics queue, fire!
            topics[topic].forEach(function(item) {
                item(info != undefined ? info : {});
            });
        }
    };
})();