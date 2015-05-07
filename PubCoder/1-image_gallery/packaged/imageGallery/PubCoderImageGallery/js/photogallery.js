function SCPhotoGallery(objPhotoGallery, maxResolutionWidth, maxResolutionHeight, goFullScreen, withThumbnails, withCaption, withArrows) {
	var hasTitle;
	var titleCss = $(objPhotoGallery + ' .SCPhotoGalleryTitleDefault').css("display");
	if (titleCss == "none")
		hasTitle = false;
	else
		hasTitle = true;
	var isFullScreen = false;
	var thumbnailsVisible = withThumbnails;
	var SCphotoGalleryFullScreen;
	var generalFadeIn = 100;
	var zIndexContentOriginal = $('.SCPage .SCContent').css('z-index');
	var zIndexContentDestination = parseInt($('.SCPage .SCOverlay').css('z-index'),10) + 1;
	positionImages();
	var mySwiper = new Swiper(objPhotoGallery + ' .swiper-container',{
		onImagesReady: function() {
				checkArrows(mySwiper.activeIndex,mySwiper.slides.length);
				if (!withArrows)
					$(objPhotoGallery + ' .arrow-left,' + objPhotoGallery + ' .arrow-right').css("display","none");
				if (!withCaption)
					$(objPhotoGallery+" figcaption").css("display","none");
					positionFigurePagination();
				$(objPhotoGallery+"_container").fadeIn(generalFadeIn,positionIcons());
				if (goFullScreen) {
					$(objPhotoGallery + " .icon-fullscreen").fadeIn(generalFadeIn + 100);
				}
				if (withThumbnails) {
					$(objPhotoGallery + " .icon-index").fadeIn(generalFadeIn + 100);
					checkPagination();
					positionThumbnails();
				}
				
		},
	    onSlideClick: function(event) {
	    	if (goFullScreen) 
	    		toggleFullScreen();
	    },
	    onSlideChangeEnd: function() {
	    	var activeIndex = mySwiper.activeIndex;
	    	changeActiveThumb(activeIndex);
	    	if (withArrows)
	    		checkArrows(activeIndex,mySwiper.slides.length);
	    	checkActiveThumb(activeIndex);
	    	
	    }
	  })
	this.myObjPhotoGallery = objPhotoGallery;
	
	
	
	$(objPhotoGallery + ' .arrow-left').on(window.touchUpEvent, function(e){
		e.stopPropagation();
	    e.preventDefault();
	    mySwiper.swipePrev();
	  })
	  $(objPhotoGallery + ' .arrow-right').on(window.touchUpEvent, function(e){
	  	e.stopPropagation();
	    e.preventDefault();
	    mySwiper.swipeNext();
	  })
	  
	  $(objPhotoGallery + ' .pagination-arrow-left').on(window.touchUpEvent, function(e){
	  	e.stopPropagation();
		e.preventDefault();
		var widthPagination = $(objPhotoGallery + ' .pagination').css('width'); 
		movePagination("left",widthPagination);
	  })
	  $(objPhotoGallery + ' .pagination-arrow-right').on(window.touchUpEvent, function(e){
	  	e.stopPropagation();
	    e.preventDefault();
	    var widthPagination = $(objPhotoGallery + ' .pagination').css('width'); 
		movePagination("right",widthPagination);
	  })
	  
	  $(objPhotoGallery + ' .pagination li').on(window.touchUpEvent, function(e){
	  	e.stopPropagation();
	    e.preventDefault();
	    var index = $(this).parent().children().index(this);
	    changeActiveThumb(index);
	    mySwiper.swipeTo(index);
	  })
	
	  $(objPhotoGallery + ' .icon-fullscreen').on(window.touchUpEvent, function(e){
	  		e.stopPropagation();
		   e.preventDefault();
		   toggleFullScreen();
	  })
	  
	   $(objPhotoGallery + ' .icon-index').on(window.touchUpEvent, function(e){
	   		e.stopPropagation();
		   e.preventDefault();
		   togglePagination(thumbnailsVisible);
	  })
	
	  function movePagination(direction,pixels) {
		var signDirection;
		var widthPagination = $(objPhotoGallery + ' .pagination').css('width'); 
		if (direction == "left")
			signDirection = "+";
		else
			signDirection = "-";
		$(objPhotoGallery + ' .pagination').animate({left:'' + signDirection + '=' + pixels},300,'easieEaseInOut',function() {
	    	var leftCss = getLeftDomValue(objPhotoGallery + ' .pagination');
	    	$(objPhotoGallery + ' .pagination').css('left',leftCss);
	    	checkPagination();
	    });
	}
	  
	  function checkArrows(index,totalSlides) {
		if (index == 0)
			 $(objPhotoGallery + ' .arrow-left').css("display","none");
		else 
			$(objPhotoGallery + ' .arrow-left').css("display","block");
		if (index == totalSlides - 1)
			 $(objPhotoGallery + ' .arrow-right').css("display","none");
		else 
			$(objPhotoGallery + ' .arrow-right').css("display","block");	
	}

	  function checkActiveThumb(index,animation) {
		  if (animation == "undefined")
			  animation = 0;
		  setTimeout(function(){
		  if ($(objPhotoGallery + ' .pagination').length > 0) {
			  var widthPagination = $(objPhotoGallery + ' .pagination').css('width');
			  var positionLeftImg = $(objPhotoGallery + ' .pagination li img:eq(' + index + ')').position().left;
			  var overflowContainer = parseInt($(objPhotoGallery + ' .overflowContainer').css("width"));
			  var paginationLeft = getLeftDomValue(objPhotoGallery + ' .pagination');
			  var sumPositionPagination = paginationLeft + positionLeftImg;
			  if (sumPositionPagination > overflowContainer) {
				  var offset = parseInt(sumPositionPagination/overflowContainer);
				  var pixels = parseInt(widthPagination) * offset;
				  movePagination("right",pixels);
			  } else if (sumPositionPagination < 0)
				  movePagination("left",widthPagination);
		  }

		  },animation + 1)
		}

	  function positionImages(cssClass) {
			var SwiperWidth = $(objPhotoGallery).outerWidth();
			var SwiperHeight = $(objPhotoGallery).outerHeight();
			$(objPhotoGallery + ' .swiper-slide img').each(function(i, obj){
				if (ratioSmallisHigher(this.naturalWidth, this.naturalHeight, SwiperWidth, SwiperHeight)) {
					$(this).css("width",SwiperWidth + "px");
				} else {
					$(this).css("height",SwiperHeight + "px");
					
				}
	    	});
		}
	  
	function positionFigurePagination() {
		//var paginationHeight = $(objPhotoGallery + ' .paginationContainer')[0].getBoundingClientRect().height;
		var paginationHeight = 0;
		var SCPhotoGalleryWidth = $(objPhotoGallery + '')[0].getBoundingClientRect().width;
		var figcaptionPadding = parseInt($(objPhotoGallery + ' figcaption').css("padding"))*2-2;
		
		var paginationWidth = SCPhotoGalleryWidth - figcaptionPadding;
		var overflowContainerWidth = SCPhotoGalleryWidth - 110;
		$(objPhotoGallery + ' figure figcaption').css({"bottom":paginationHeight,"width":paginationWidth});
		$(objPhotoGallery + ' .overflowContainer').css("width",overflowContainerWidth);
	}
	
	function positionIcons() {
		var titleParagraphHeight;
		try {
			titleParagraphHeight = $(objPhotoGallery + ' p.SCPhotoGalleryTitleDefault.SCPhotoGalleryTitle')[0].getBoundingClientRect().height;
		}
		catch(err) {
		    titleParagraphHeight = 0;
		}
		setTimeout(function(){
			var titlePadding = $(objPhotoGallery + ' p.SCPhotoGalleryTitleDefault.SCPhotoGalleryTitle').css("padding");
			var titleHeight = parseInt(titlePadding)*2 + parseInt(titleParagraphHeight);
			if (titleHeight != 0) {
				var iconsHeight = $(objPhotoGallery + ' .icons')[0].getBoundingClientRect().height;
				var topIcons = (titleHeight - iconsHeight)/2;
				$(objPhotoGallery + ' .icons').css("top",topIcons + "px");
			} 
		},1);
	}
			
	function toggleFullScreen() {
		if (!isFullScreen) {
			this.isFullScreenState = false;
			var originalSwiperContainerHeight = $(objPhotoGallery + ' .swiper-container').outerHeight();
			var originalSwiperContainerWidth = $(objPhotoGallery + ' .swiper-container').outerWidth();
    		var originalSCPhotoGalleryTop = parseInt($(objPhotoGallery).css("top"));
    		var originalSwiperContainerTop = 0;
    		var originalSwiperContainerLeft = $(objPhotoGallery + ' .swiper-container').offsetParent().css("left");
    		var originalSCPhotoGalleryHeight = $(objPhotoGallery).outerHeight();
    		originalZindex = $(this.myObjPhotoGallery).css('z-index');
    		SCphotoGalleryFullScreen = new photoGallery(objPhotoGallery,
    													false,
    													withThumbnails,
    													maxResolutionWidth,
    													maxResolutionHeight,
    													originalSwiperContainerWidth,
    													originalSwiperContainerHeight,
    													originalSCPhotoGalleryHeight,
    													originalSCPhotoGalleryTop,
    													originalSwiperContainerTop,
    													originalSwiperContainerLeft,
    													originalZindex
    													);
    		SCphotoGalleryFullScreen.launchAnimations();
    		isFullScreen = true;
    	} else {
    		this.isFullScreenState = true;
    		SCphotoGalleryFullScreen.modeFullScreen = true;
    		SCphotoGalleryFullScreen.launchAnimations();
    	}
	}
	  
		function togglePagination(isVisible) {
			if (isVisible) {
				$(objPhotoGallery + ' .paginationContainer').css("display","block"); 
				$(objPhotoGallery + ' .paginationContainer,' + objPhotoGallery + ' figcaption').animate({bottom: "+=95px"},100,'easieEaseOut');
				$(objPhotoGallery + " .icon-index").removeClass("index-open").addClass("index-close");
				thumbnailsVisible = false;
			} else {
				$(objPhotoGallery + ' .paginationContainer, ' + objPhotoGallery + ' figcaption').animate({bottom: "-=95px"},200,'easieEaseIn',function(){ $(objPhotoGallery + ' .paginationContainer').css("display","none") });
				$(objPhotoGallery + ' figcaption').animate({bottom: 0},200,'easieEaseIn');
				$(objPhotoGallery + " .icon-index").removeClass("index-close").addClass("index-open");
				thumbnailsVisible = true;
			}
		}
	
	  
	function checkPagination() {
		if ($(objPhotoGallery + ' .pagination').length > 0) {
			var photogalleryWidth = $(objPhotoGallery + ' .pagination').width(), paginationWidth = $(objPhotoGallery + ' .pagination')[0].scrollWidth;
			if (paginationWidth > photogalleryWidth) {
				var paginationLeft = getLeftDomValue(objPhotoGallery + ' .pagination');
				if (paginationLeft < 0) 
					showHidePaginationArrow('pagination-arrow-left','show');
				else 
					showHidePaginationArrow('pagination-arrow-left','hide');
				if (paginationWidth + paginationLeft > photogalleryWidth)
					showHidePaginationArrow('pagination-arrow-right','show');
				else
					showHidePaginationArrow('pagination-arrow-right','hide');
			} else {
				showHidePaginationArrow('pagination-arrow-right','hide');
				showHidePaginationArrow('pagination-arrow-left','hide');
			}
		}
		
	}
	
	
	function positionThumbnails() {
		$(objPhotoGallery + ' .pagination li img').each(function(i, obj){
			if (isWidthLongestSize($(this).width(), $(this).height()))
				$(this).css("max-height","100%");
			else 
				$(this).css("max-width","100%");
    	});
	}
	
	function getLeftDomValue(obj) {
		var value, leftDomValue = $(obj).css('left');
		if (leftDomValue == 'auto')
			value = 0;
		else
			value = leftDomValue;
		return parseFloat(value);
		
	}
	
	function showHidePaginationArrow(directionDiv,action) {
		var cssValue;
		if (action == 'show')
			cssValue = 'block';
		else
			cssValue = 'none';
		$(objPhotoGallery + ' .' + directionDiv).css('display',cssValue);
	}
	
	
	  
	  function changeActiveThumb(index){
		$(objPhotoGallery + ' .pagination li').each(function(i, obj){
    		$(this).removeClass('active');
    	});
    	$(objPhotoGallery + ' .pagination li').eq(index).addClass('active');
	}
	var photoGallery = function(ObjPhotoGallery,isFullScreen,withThumbnails,fullScreenWidth,fullScreenHeight,originalWidth,originalHeight,originalContainerHeight,originalTopSCphotoGallery,originalTopSwiperContainer,originalLeft,originalZindex) {
		this.myObjPhotoGallery = ObjPhotoGallery,
		this.modeFullScreen = isFullScreen,
		this.withThumbnails = withThumbnails;
		var swiperSlideVisible = document.getElementsByClassName('swiper-slide-visible')[0];
		this.imageVisibleHeight = swiperSlideVisible.getElementsByTagName('img')[0].naturalHeight,
		this.imageVisibleWidth = swiperSlideVisible.getElementsByTagName('img')[0].naturalWidth,
		this.activeIndex, 
		this.scaleVal, 
		this.destinationHeight, 
		this.destinationWidth, 
		this.originalWidth,
		this.originalLeft, 
		this.originalTopSCphotoGallery,
		this.originalTopSwiperContainer,
		this.destinationTop, 
		this.destinationLeft,
		this.originalContainerHeight,
		this.originalZindex,
		this.speedAnimation = 300;  
		if (originalWidth != '')
			this.originalWidth = originalWidth;
		if (originalHeight != '')
			this.originalHeight = originalHeight;
		if (originalTopSCphotoGallery != '')
			this.originalTopSCphotoGallery = originalTopSCphotoGallery;
		if (originalTopSwiperContainer != '')
			this.originalTopSwiperContainer = originalTopSwiperContainer;
		if (originalLeft != '')
			this.originalLeft = originalLeft;
		if (originalContainerHeight != '')
			this.originalContainerHeight = originalContainerHeight;
		if (originalZindex != '')
			this.originalZindex = originalZindex;
		var paginationBottom = parseInt($(myObjPhotoGallery + ' .paginationContainer').css("bottom"));
		this.launchAnimations = function() {
			
	 		if (!this.modeFullScreen) {
	 			$(this.myObjPhotoGallery).css('z-index','999');
	 			$('.SCPage .SCContent').css('z-index',zIndexContentDestination);
	 			this.destinationHeight = fullScreenHeight, 
				this.destinationWidth = fullScreenWidth, 
				this.originalWidth = originalWidth, 
				this.destinationTop = 0, 
				this.destinationLeft = 0;
				var classesToAnimateTogether = this.myObjPhotoGallery + ', ' + this.myObjPhotoGallery + ' .swiper-container, ' + this.myObjPhotoGallery  + ' .swiper-slide-visible';
			} else {
				$('.SCPage .SCContent').css('z-index',zIndexContentOriginal);
				$(this.myObjPhotoGallery).css('z-index',this.originalZindex);
				this.destinationHeight = this.originalHeight, 
				this.destinationWidth = this.originalWidth, 
				this.destinationTop = this.originalTopSwiperContainer, 
				this.destinationLeft = 0;
				var classesToAnimateTogether = this.myObjPhotoGallery + ' .swiper-container,' + this.myObjPhotoGallery + ' .swiper-slide-visible';
	 		}
	 	if (withCaption)
	 		$('' + this.myObjPhotoGallery + ' figcaption').hide();
	 	$('' + this.myObjPhotoGallery + ' p.SCPhotoGalleryTitleDefault').hide();
	 	if (withThumbnails)
	 		$('' + this.myObjPhotoGallery + ' .paginationContainer').hide();
	 	
	 	if (this.modeFullScreen) {
	 		$(this.myObjPhotoGallery).animate({top: this.originalTopSCphotoGallery, left: this.originalLeft, width: this.destinationWidth, height: this.originalContainerHeight},this.speedAnimation,'easieEaseIn');
	 	}
	 	$(classesToAnimateTogether).animate({top: this.destinationTop, left: this.destinationLeft, width: this.destinationWidth, height: this.destinationHeight},this.speedAnimation,'easieEaseIn');
	 	if (this.modeFullScreen) 
	 		scaleVal = 1;
	 	else {
	 		var smallSlideWidth = $('' + this.myObjPhotoGallery + ' .swiper-slide')[0].getBoundingClientRect().width;
	 		var visibileImageRect = $('' + this.myObjPhotoGallery + ' .swiper-slide-visible img')[0].getBoundingClientRect();
	 		var visibleImageWidth = visibileImageRect.width;
	 		var visibleImageHeight = visibileImageRect.height;
	 		//if (isWidthLongestSize(this.imageVisibleWidth, this.imageVisibleHeight))
	 		
	 		if (ratioSmallisHigher(visibleImageWidth,visibleImageHeight,this.destinationWidth,this.destinationHeight)) {
	 			scaleVal =  this.destinationWidth/visibleImageWidth;
	 		} else
	 			scaleVal =  this.destinationHeight/visibleImageHeight;
	 	}
	 	
	 	showHideAllOtherImages("hide");
	 	$('' + this.myObjPhotoGallery + ' .swiper-slide-visible img').animate({scalex: '' + scaleVal + '', scaley: '' + scaleVal + ''},this.speedAnimation,'easieEaseInOut',completeAnimationOnImages(this.modeFullScreen,
																																														  this.destinationWidth,
																																														  this.destinationHeight,
																																														 this.originalWidth,
																																														  this.originalHeight,
																																														  mySwiper.activeIndex,
																																														  this.speedAnimation,
																																														  this.withThumbnails,
																																														  paginationBottom)
																																										)}
}


function showHideAllOtherImages(what) {
	var displayType;
	if (what == "hide")
		displayType = "none";
	else
		displayType = "block";
	$(objPhotoGallery + ' .swiper-slide img').each(function(i, obj) {
		if ( !$( this ).parent().parent().hasClass( "swiper-slide-visible" ) ) {
			$(this).css("display",displayType);
		}
	});
}
	
function completeAnimationOnImages(modeFullScreen,destinationWidth,destinationHeight,originalWidth,originalHeight,activeIndex,speedAnimation,withThumbnails,paginationBottom) {
//all swiper slide at width and height
				$(objPhotoGallery + ' .swiper-slide').css({width: destinationWidth, height: destinationHeight});
				var swiperWrapper = 0, scaleVal;
				$(objPhotoGallery + ' .swiper-slide img').each(function(i, obj) {
					swiperWrapper = swiperWrapper + destinationWidth;
				if ( !$( this ).parent().parent().hasClass( "swiper-slide-visible" ) ) {
						if (modeFullScreen) 
							scaleVal = 1;
						else {
							var thisWidth = $(this).outerWidth();
							var thisHeight = $(this).outerHeight();
							if (ratioSmallisHigher(thisWidth,thisHeight,destinationWidth,destinationHeight)) {
								scaleVal =  destinationWidth/thisWidth;
							} else
								scaleVal =  destinationHeight/thisHeight;							
						}	
						$(this).animate({scalex: '' + scaleVal + '', scaley: '' + scaleVal + ''},1);
				} 
});
				showHideAllOtherImages("show");
				
	//set new translateX var
		var newTranslateX = activeIndex*destinationWidth;
		var figCaptionPadding, figCaptionWidth, figCaptionBottom;
		var marginLeftOverFlowContainer = parseInt($(objPhotoGallery + ' .overflowContainer').css("margin-left"))*2
		var destinationWidthOverflowContainer = destinationWidth - marginLeftOverFlowContainer;
		figCaptionPadding = parseInt($(objPhotoGallery + ' figcaption').css("padding"))*2;
		figCaptionWidth = destinationWidth - figCaptionPadding;
		if (withThumbnails)
			figCaptionBottom = $(objPhotoGallery + ' .paginationContainer').css('height');
		else
			figCaptionBottom = 0;
		$('' + objPhotoGallery + ' .swiper-wrapper').css({'width':swiperWrapper,'height':destinationHeight,'-webkit-transform':'translate3d(-' + newTranslateX + 'px, 0px, 0px)'});
		if (!modeFullScreen) {
			if (hasTitle)
				$(objPhotoGallery + ' p.SCPhotoGalleryTitleDefault').delay(speedAnimation).addClass('fullscreen');
			if (withThumbnails) {
				$(objPhotoGallery + ' .paginationContainer').delay(speedAnimation).css('bottom',paginationBottom + 'px');
			}
			if (hasTitle)
				$(objPhotoGallery + ' p.SCPhotoGalleryTitleDefault').fadeIn(speedAnimation);
			$(objPhotoGallery  + " .icon-fullscreen").removeClass("fullscreen-open").addClass("fullscreen-close");
		} else {
			isFullScreen = false;
			if (hasTitle)
				$(objPhotoGallery + ' p.SCPhotoGalleryTitleDefault').removeClass('fullscreen');
			
			
			$(objPhotoGallery + " .icon-fullscreen").removeClass("fullscreen-close").addClass("fullscreen-open");
			
		
		}	
		if (withThumbnails) {
			var paginationHeight = parseInt($('' + objPhotoGallery + ' .paginationContainer').css("top"));
			$(objPhotoGallery + ' figcaption').delay(speedAnimation).css({'position':'absolute','bottom':''+ paginationHeight + 'px','width':figCaptionWidth + 'px'});
		}
		if (hasTitle)
			$(objPhotoGallery + ' p.SCPhotoGalleryTitleDefault').fadeIn(speedAnimation);
		if (withCaption)
		$(objPhotoGallery + ' figcaption').fadeIn(speedAnimation);
		if (withThumbnails) {
			$(objPhotoGallery + ' .paginationContainer .overflowContainer').css('width',destinationWidthOverflowContainer);
			 var paginationLeft = getLeftDomValue(objPhotoGallery + ' .pagination');
			 movePagination("right",paginationLeft);
			$(objPhotoGallery + ' .paginationContainer').css('width',destinationWidth).fadeIn(speedAnimation,checkActiveThumb(mySwiper.activeIndex,speedAnimation));
		}
		setTimeout(function(){
			mySwiper.reInit();
			checkPagination();	
		},speedAnimation);
		
	}
}	
	
function isWidthLongestSize(width, height) {
	var longestSize;
	if (width/height > 1)
		return true;
	else
		return false;
}

function ratioSmallisHigher(widthImage, heightImage, widthDestination, heightDestination) {
	if (widthImage/heightImage > widthDestination/heightDestination) {
			return true;
	} else {
			return false;
	}
}
