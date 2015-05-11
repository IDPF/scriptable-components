window.tocIsVisible=false;
/*
 *
 *   Init Touch Events
 *
 */
if ((/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()))) { 
	window.touchDownEvent = "touchstart"; 
	window.touchUpEvent = "touchend"; 
	window.touchMoveEvent = "touchmove";
	if ((/android/i.test(navigator.userAgent.toLowerCase()))) {
		window.pinchopen = "pinchout";
		window.pinchclose = "pinchin";
	} else {
		window.pinchopen = "pinchopen";
		window.pinchclose = "pinchclose";
	}
} else {
	window.touchDownEvent = "mousedown";
	window.touchUpEvent = "mouseup";
	window.touchMoveEvent = "mousemove";
	window.pinchopen = "dblclick";
	window.pinchclose = "dblclick";
}

$(document).ready(function(){
	$('img').on('dragstart', function(event) { event.preventDefault(); });
});

/*
 *
 *   Init Accelerometer
 *
 */
window.onorientationchange = function() {
	var newOrientation;
	if (isAndroid)
		newOrientation = Android.getRotation();
	else 
		newOrientation = window.orientation;
		    /*window.orientation returns a value that indicates whether iPhone is in portrait mode, landscape mode with the screen turned to the
		      left, or landscape mode with the screen turned to the right. */
		    window.orientationDevice = switchOrientationName(newOrientation,isAndroid);
}
window.ondevicemotion = function(e) {
	 switch (window.orientationDevice) {
	 case 'landscapeButtonLeft':
		window.aigX = e.accelerationIncludingGravity.x;
		window.aigY = e.accelerationIncludingGravity.y;
	  break;
	 case 'portraitButtonBottom':
		 window.aigX = -e.accelerationIncludingGravity.y;  
		 window.aigY = e.accelerationIncludingGravity.x;
	 break;
	 case 'landscapeButtonRight':
		 window.aigX = -e.accelerationIncludingGravity.x;  
		 window.aigY = -e.accelerationIncludingGravity.y;
	 break;
	 case 'portraitButtonTop':
		 window.aigX = e.accelerationIncludingGravity.y;  
		 window.aigY = -e.accelerationIncludingGravity.x;
	 break;

	}
}

/*
 *
 *   Define PubCoder namespace
 *
 */
var PubCoder = {
	Events: {
		Shake: 'SCEventShake',
		Show: 'SCEventShow',
		SwipeDown: 'SCswipedown',
		SwipeLeft: 'SCswipeleft',
		SwipeRight: 'SCswiperight',
		SwipeUp: 'SCswipeup',
		PinchClose: window.pinchclose,
		PinchOpen: window.pinchopen,
		TouchDown: window.touchDownEvent,
		TouchUp: window.touchUpEvent
	},

	callID: 0,

	call: function (methodName, methodParameters) {
		PubCoder.callID++;
		window.status = JSON.stringify ({"method" : methodName, "params" : methodParameters, "id" : PubCoder.callID} );
		window.status = ' ';
	}
};

/*
 *
 *   Utility Functions
 *
 */

function getBrowser() {
	
	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
	var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
	var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
	var browser = "";
	if (isOpera)
		browser = "opera";
	else if (isFirefox)
		browser = "firefox";
	else if (isSafari)
		browser = "safari";
	else if (isChrome)
		browser = "chrome";
	else if (isIE)
		browser = "explorer";
	
	return browser;
}

function setPrefixCss3() {
	var prefix = "";
	if (getBrowser() == "firefox")
		prefix ="-moz-";
	else 
		prefix ="-webkit-";
	return prefix;
}


function isLocationInElement (element, x, y)
	{
		var elmOffset = $(element).offset();
		if (x >= elmOffset.left && x <= (elmOffset.left + $(element).width()) && 
			y >= elmOffset.top && y <= (elmOffset.top + $(element).height()))
			return true;
		return false;
	}	

function setNewPos(min, max, deltaMin, deltaMax, initialPos, nodePos, relativePos, actualPos, element, dim)
{
	var newX, elementDim;
	var newPos = initialPos - nodePos - relativePos + actualPos;
	var elmOffset = $(element).offset();
	if (min != null) {
		if (actualPos - deltaMin <= min) {
			newX = min - relativePos;
		} else if (actualPos + deltaMax >= max) {
			if (dim == "x")
				elementDim = $(element).width();
			else
				elementDim = $(element).height();
			newX = max - relativePos - elementDim;
		} else {
			newX = newPos;
		}
	} else
			newX = newPos;
	return newX;
}

function isLocationInElementDragDropOffset(element, x, y)
	{
		var elmOffset = $(element)[0].getBoundingClientRect();
		if (x >= elmOffset.left && x <= (elmOffset.left + elmOffset.width) && 
			y >= elmOffset.top && y <= (elmOffset.top + elmOffset.height))
			return true;
		return false;
	}	

 function setNewPosDragDropOffset(min, max, deltaMin, deltaMax, initialPos, nodePos, relativePos, actualPos, element, dim)
{
	var newX, elementDim;
	var newPos = initialPos - nodePos - relativePos + actualPos;
	var elmOffset = $(element)[0].getBoundingClientRect();
	if (min != null) {
		if (actualPos - deltaMin <= min) {
			newX = min - relativePos;
		} 
		else if (actualPos + deltaMax >= max) {
			if (dim == "x") {
				elementDim = elmOffset.width;
			}
			else {
				elementDim = elmOffset.height;
			}
			newX = max - relativePos - elementDim;
		} 
		else {
			newX = newPos;
		}
	} 
	else newX = newPos;

	return newX;
}	

//functions for gravity acceleration actions
function boundingBoxCheckX(posX, objectX, containerObject, ax, isBouncing){
	var minX = 0, maxX = 0, x = posX;
	var containerNodeOffset = containerObject.offset();
	var generalContainerNodeOffset = $(".SCPage").offset();
		minX = containerNodeOffset.left - generalContainerNodeOffset.left;
		maxX = minX + containerObject.width();
		
	if (x<minX) { 
		x = minX;
	}
	if (x>maxX-objectX) { 
		x = maxX-objectX;

	}
	
	return x;	
}

function isBoundingBoxCheckX(posX, objectX, containerObject){
var minX = 0, maxX = 0, x = posX;
var containerNodeOffset = containerObject.offset();
var generalContainerNodeOffset = $(".SCPage").offset();
	minX = containerNodeOffset.left - generalContainerNodeOffset.left;
	maxX = minX + containerObject.width();
	
if (x<minX)  
	return 1;
 else if (x>maxX-objectX)  
	return 2; 
 else 
	return 0;
}
function boundingBoxCheckY(posY, objectY, containerObject){
var minY = 0, maxY = 0, y = posY;
var containerNodeOffset = containerObject.offset();
var generalContainerNodeOffset = $(".SCPage").offset();
	minY = containerNodeOffset.top - generalContainerNodeOffset.top;
	maxY = minY + containerObject.height();

if (y<minY)  
	y = minY;

if (y>maxY-objectY)  
	y = maxY-objectY; 

return y;	
}

function isBoundingBoxCheckY(posY, objectY, containerObject){
var minY = 0, maxY = 0, y = posY;
var containerNodeOffset = containerObject.offset();
var generalContainerNodeOffset = $(".SCPage").offset();
	minY = containerNodeOffset.top - generalContainerNodeOffset.top;
	maxY = minY + containerObject.height();

if (y<minY)  
	return 1;
else if (y>maxY-objectY)  
	return 2;
else
	return 0
}

//function used by rotate.scx
function rotate(objectId,timesRun,howManyTimes,rotationToDegrees,rotationSpeed,effectEasing,transformOriginX,transformOriginY,functionCompleted) {
	$('#' + objectId).css(setPrefixCss3() + 'transform-origin','' + transformOriginX + ' ' + transformOriginY + '');
		
	var rotationToDegreesString;
	if (rotationToDegrees.indexOf("-") == -1)
		rotationToDegreesString = "+=" + rotationToDegrees;
	else
		rotationToDegreesString = "-=" + rotationToDegrees.substr(1);
	switch(effectEasing) {
	case "ease-in":
		effectEasing = "easieEaseIn";
	  break;
	case "ease-out":
		effectEasing = "easieEaseOut";
	  break;
	case "linear":
		effectEasing = "easieLinear";
	  break;
	case "ease":
		effectEasing = "easieEaseInOut";
	  break;
	case "bounce-in":
		effectEasing = "easeInBounce";
	  break;
	case "bounce-out":
		effectEasing = "easeOutBounce";
	  break;
	case "elastic-in":
		effectEasing = "easeInElastic";
	  break;
	case "elastic-out":
		effectEasing = "easeOutElastic";
	  break;
}
	
	$('#' + objectId).animate({rotate: '' + getScale(objectId) + 'deg'}, {queue: false, duration: 0});
	$('#' + objectId).animate({rotate: '' + rotationToDegreesString + 'deg'}, {queue: false, duration: rotationSpeed, easing: effectEasing, complete: function(){
		  if (timesRun == howManyTimes) {
	  			functionCompleted();
	      	 }
		}});		
}

function getScale(obj) {
	var angle;
	var el = document.getElementById(obj);
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
	         st.getPropertyValue("-moz-transform") ||
	         st.getPropertyValue("-ms-transform") ||
	         st.getPropertyValue("-o-transform") ||
	         st.getPropertyValue("transform") ||
	         "fail...";

if (st != null && tr != "none") {


	var values = tr.split('(')[1];
	    values = values.split(')')[0];
	    values = values.split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	var scale = Math.sqrt(a*a + b*b);

	var sin = b/scale;
	angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
} else {
	angle = 0;
}
	return angle;
}



//end functions used by rotate.scx
//functions used by scale.scx
function scale(objectId,timesRun,howManyTimes,scaleX,scaleY,effectDurationMS,effectEasing,transformOriginX,transformOriginY,ScaleModeString,functionCompleted) {
	switch(effectEasing) {
	case "ease-in":
		effectEasing = "easieEaseIn";
	  break;
	case "ease-out":
		effectEasing = "easieEaseOut";
	  break;
	case "linear":
		effectEasing = "easieLinear";
	  break;
	case "ease":
		effectEasing = "easieEaseInOut";
	  break;
	case "bounce-in":
		effectEasing = "easeInBounce";
	  break;
	case "bounce-out":
		effectEasing = "easeOutBounce";
	  break;
	case "elastic-in":
		effectEasing = "easeInElastic";
	  break;
	case "elastic-out":
		effectEasing = "easeOutElastic";
	  break;
}
	$('#' + objectId).css(setPrefixCss3() + 'transform-origin','' + transformOriginX + ' ' + transformOriginY + '');
	$('#' + objectId).animate({scalex: '' + ScaleModeString + scaleX  + '', scaley: '' + ScaleModeString + scaleY  + ''}, {queue: false, duration: effectDurationMS, easing: effectEasing, complete: function(){	
	if (timesRun == howManyTimes) {
  			functionCompleted();
      	 }
	}});		

}

//end functions used by scale

//functions for float
function getOrientation(isAndroid) {
	var orientationName, orientationType;
	if (isAndroid)
		orientationType = Android.getRotation();
	else
		orientationType = window.orientation;
	orientationName = switchOrientationName(orientationType, isAndroid);
	return orientationName;
}

function switchOrientationName(orientation, isAndroid) {
	var orientationDetected;
	var orientationName;
	orientationDetected = orientation;
	if (orientation == 0 && isAndroid) 
			orientationDetected = 180;
	else if (orientation == 90 && isAndroid)
			orientationDetected = -90;
	else if (orientation == 180 && isAndroid)
		orientationDetected = 0;
	else if (orientation == 270 && isAndroid)
		orientationDetected = 90;
	
	var orientationName;
	switch(orientationDetected) {
    case 0:
    	orientationName = 'portraitButtonBottom';
        break; 
    case 90:
    	orientationName = 'landscapeButtonRight';
        break;
    case -90: 
    	orientationName = 'landscapeButtonLeft';
        break;
	case 180:
		orientationName = 'portraitButtonTop';
     break;
  }
	return orientationName;
}

function toggleToc() {
	var menuTocHeight = $("#SCNavigationToc").height();
	if (window.tocIsVisible) {
		$("#SCNavigationToc").animate({bottom: -menuTocHeight},200,'easieEaseIn',function() {
			$("#SCNavigationToc").css("display","none");
		});
				
		window.tocIsVisible=false;	
	}
	else
		{
			$("#SCNavigationToc").css("display","block");
			$("#SCNavigationToc").animate({bottom: 0},200,'easieEaseIn');
			window.tocIsVisible=true;
		}
}
//end functions for float

function showAssetsParity(option){
    if (option == 'even' || option == 'odd') {
        $('*[data-pubcoder="' + option + '"]').css('display','block');
    } else {
        $('*[data-pubcoder="odd"]').css('display','block');
        $('*[data-pubcoder="even"]').css('display','block');
    }
}

//initAnimations
function initAnimation(obj,width,height,fps,countVar,isInfinite,howManyLoops,backToFirstFrame)
{
var frameTime = 1000/fps;
var nextAnimationAfterLastLoop = howManyLoops + 1
var lastLoop = howManyLoops;
$(obj).spritespin({
                    
    width   : width,  // width in pixels of the window/frame
    height  : height,  // height in pixels of the window/frame
    animate : false,
    renderer: 'image',
    loop: true,
    frameTime: frameTime,
     onFrame: function(e,data) {
         var stopAtFrame = data.images.length - 1;
         if (!isInfinite) {
            var api = $(obj).spritespin('api');
            if (data.frame == 0) {
                countVar++;
                if (backToFirstFrame && countVar == nextAnimationAfterLastLoop) {
                 stopAnimation(api,obj);
                countVar = 1;
                }
            }
            if (data.frame == stopAtFrame && countVar == lastLoop) {
                if (!backToFirstFrame) {
                    stopAnimation(api,obj);
                    countVar = 0;
                }
            }
        }
      }
  });
function stopAnimation(apiAnimation,object)
    {
        apiAnimation.stopAnimation();
        $(object).removeClass("playing");
         var objectStripped = object.substr(1);
        $(object).trigger(objectStripped + "_animation_ended");
    }
}