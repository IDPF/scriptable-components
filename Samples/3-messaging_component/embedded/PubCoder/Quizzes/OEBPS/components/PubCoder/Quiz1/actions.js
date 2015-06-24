var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
var touchDownEvent;
var touchUpEvent;
var isMobile;
var orientationDevice = getOrientation(isAndroid);
var aigX = 0, aigY = 0;
/*
 * 
 * Init Action Lists
 *
 * 
 */
/*
 * 
 * Init SCCounter
 *
 * 
 */
 
$(window).load(function(){
	/*
	 * 
	 * Init SCAnimation
	 * 
	 * 
	 */
	
	/*
	 *
	 *   Init Shake
	 *
	 */
	window.addEventListener('shake', function () {
		
	}, false);
	
	/*
	 *
	 *   Init Masked Images
	 *
	 */
	 
 	/*
	 * 
	 * Init SCPhotogallery
	 * 
	 * 
	 */
	
 	/*
	 * 
	 * Init SCQuizMulti
	 * 
	 * 
	 */
	
var quizMultiObj7255 = new QuizMulti('#obj7255',{
risposte : [[0,0,1,0],[0,0,1,0]]
,messaggioNonCompletato : "Missing Answers!"
,messaggioTutteCorrette: "Perfect!"
,countdown : false
,save : false
});
 	/*
	 * 
	 * Init SCDrawer
	 * 
	 * 
	 */
	
	if(! navigator.userAgent.match(/PubCoderHelper/i)) {
		/*
		 *
	 	 *   Action Groups
	 	 *
	 	 */
		
		
		/*
		 *
	 	 *  Events
	 	 *
	 	 */
		
		
		/*
		 *
	 	 *   Trigger onShow events for objects already shown on stage
	 	 *
	 	 */
	 	setTimeout(function() {
		
$("#obj7255").trigger('SCEventShow');
		}, 200)
	 }
})