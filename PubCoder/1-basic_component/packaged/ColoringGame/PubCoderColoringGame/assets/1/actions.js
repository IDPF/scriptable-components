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
	
 	/*
	 * 
	 * Init SCDrawer
	 * 
	 * 
	 */
	
var drawerObj5675 = new Drawer('obj5675',"#FFFFFF");
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
		
$("#obj5644").trigger('SCEventShow');
$("#obj5645").trigger('SCEventShow');
$("#obj5675").trigger('SCEventShow');
		}, 200)
	 }
})