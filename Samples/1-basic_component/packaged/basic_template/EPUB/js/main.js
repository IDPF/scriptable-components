/***
 * @name buttonHandler
 * @desc Unified button click and keyboard handler
 * @public
 */
function buttonHandler(event) {
    // Older browsers may still be clinging to the charCode or keyCode implementation
    var charCode = event.which ? event.which : event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0,
        message = document.getElementById("message");
    
    if ( charCode === 1 || charCode === 32 ) {
        // As a unified click and key handler we do NOT map charCode === 10 ("Enter" key). UIEvent "keyup" default action is to call a "click" event with the "Enter" key, thus resulting in a double "press" scenario.
        
        if ( message.innerHTML === "Hello World" ) {
            message.innerHTML = "Hello World Again";
        } else {
            message.innerHTML = "Hello World";
        }
        
        event.preventDefault();
    }
}