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
	
SCPhotoGallery('#obj7096', 1024, 768, true, true, true, true); 
 	/*
	 * 
	 * Init SCQuizMulti
	 * 
	 * 
	 */
	
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
		
$("#obj7086").trigger('SCEventShow');
$("#obj7087").trigger('SCEventShow');
$("#obj7090").trigger('SCEventShow');
$("#obj7096").trigger('SCEventShow');
$("#obj7108").trigger('SCEventShow');
		}, 200)
	 }
})