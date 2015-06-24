QuizMulti = function(selector, options){
	var self = this;

  	self.default = {
		risposte : [],
	  		messaggioNonCompletato : 'Occorre rispondere a tutte le domande per poter procedere con la verifica',
	  		messaggioTutteCorrette : 'Complimenti! Tutte le risposte date sono corrette',
	  		countdown : false,
	  		save : false,
  	};

  	self.options = $.extend({}, self.default, options);
  	self.element = $(selector);
  	self._readonly = false;
  	self._countdown = null;
  	//self.iframe = parent.document.getElementById(self.options.idTargetIframe).contentWindow; 
  	self.countDomande = $('.practicelist .multiple-choice-problem', self.element).length;

  	if($('.multiple-choice-problem', self.element).length > 1){
		window.slider = self.mySwiper = new Swiper(selector +' .swiper-container',{
	  		slideElement : 'li',
	  		onFirstInit : function(){
				$('.practicediv > header h1', self.element).append("<span class='counter'>(1/" + self.countDomande + ")</span>");
	  		},
		    onSlideChangeStart: function() {
		    	$(selector + ' .arrow-left').css("display","none");
				$(selector + ' .arrow-right').css("display","none");
				return true;
		    },
		    onSlideChangeEnd: function() {
		    	self._checkArrows();
		    	if(self.mySwiper.activeIndex != self.mySwiper.slides.length - 1)
		    		$('.practicediv > header .counter', self.element).html( "(" + (self.mySwiper.activeIndex +1) + "/" + (self.mySwiper.slides.length - 1) + ")");
		    	else
		    		$('.practicediv > header .counter', self.element).html("");
		    }
		});
		var checkSlide = self.mySwiper.createSlide();
		var $buttons = $(selector + " .quiz-buttons");
		checkSlide.html(
					$buttons
						.clone().wrap("<div></div>")
							.parent()
								.append("<div class='messaggio-finale'><p>" + self.options.messaggioNonCompletato + "</p></div>")
								.append("<div class='conteggio-finale'></div>")
								.html()
		);
		$(checkSlide).addClass("multiple-choice-problem summary");
		$buttons.remove();
		checkSlide.append();
		$(selector + " .quiz-buttons").show();

		$(selector + ' .arrow-left').on(window.touchDownEvent, function(e){
			e.preventDefault();
		    self.mySwiper.swipePrev();
		});
		$(selector + ' .arrow-right').on(window.touchDownEvent, function(e){
			e.preventDefault();
			self.mySwiper.swipeNext();
		})
		self._checkArrows = function() {
			if (self.mySwiper.activeIndex  == 0)
				$(selector + ' .arrow-left').css("display","none");
			else
				$(selector + ' .arrow-left').fadeIn(100);
			if (self.mySwiper.activeIndex  == self.mySwiper.slides.length - 1)
				$(selector + ' .arrow-right').css("display","none");
			else
				$(selector + ' .arrow-right').fadeIn(100);
		}
		self._checkArrows();
	}else{
		$(selector + ' .arrow-left').remove();
		$(selector + ' .arrow-right').remove();
		$('.quiz-buttons', self.element).css("paddingTop", 0).show();
	}
	$('.multiple-choice-problem', self.element).css("visibility", "visible");


  self._create = function() {
  	$('.practicelist .multiple-choice-problem .choices .choice-content', self.element).each(function(){
  		var _fs = $(this).css("font-size").replace("px", "");
  		
  	});
	if(self._readonly === false && self.options.countdown === true)
		self._startCountdown();
	$('.practicelist input', self.element).on("change", function(){
	  self._saveForm();
	});

	$('.quiz_reset', self.element).on(window.touchDownEvent, function(event){
	  setTimeout(function(){
		  $('.conteggio-finale', self.element).empty();
		  $('.messaggio-finale > p', self.element).empty();
		  $('.messaggio-finale > p', self.element).html(self.options.messaggioNonCompletato);
		  $('.messaggio-finale', self.element).show();

		  self._enableForm();
		  //event.preventDefault();
		},100);
	  return false;
	});


	self._contaMissing = function(){
		var miss = $('.practicelist .multiple-choice-problem:not(.summary)', self.element).length;
		$('.practicelist .multiple-choice-problem:not(.summary)', self.element).each(function(num_domanda, domanda){
			if($(':checked', this).length > 0){
				miss--;
			}
		});
		return miss;
	}

	$('input[type=checkbox], input[type=radio]', self.element).change(function(){
		if(self._contaMissing() == 0)
			$('.messaggio-finale', self.element).hide();
		else
			$('.messaggio-finale', self.element).show();
		  $('.practicelist .multiple-choice-problem .quiz-choice-right', self.element)
		  	.removeClass("quiz-choice-right");
		  $('.practicelist .multiple-choice-problem .quiz-choice-wrong', self.element)
		  	.removeClass("quiz-choice-wrong");
		  $('.practicelist .multiple-choice-problem .quiz-choice-missed', self.element)
		  	.removeClass("quiz-choice-missed");
		$('.conteggio-finale', self.element)
	  	.empty()
	  	.hide();
	});

	$('.quiz_check', self.element).on(window.touchUpEvent, function(event){
		//qui fa il check
	  event.preventDefault();
	  //self._saveForm();
	  
	  $('.messaggio-finale', self.element).hide();
	  $('.practicelist .multiple-choice-problem .quiz-choice-right', self.element)
	  	.removeClass("quiz-choice-right");
	  $('.practicelist .multiple-choice-problem .quiz-choice-wrong', self.element)
	  	.removeClass("quiz-choice-wrong");
	  $('.practicelist .multiple-choice-problem .quiz-choice-missed', self.element)
	  	.removeClass("quiz-choice-missed");

	  /* altrimenti imposto le classi opportune su ogni domanda/risposta e disabilito il form*/
	  $('.practicelist .multiple-choice-problem:not(.summary)', self.element).each(function(num_domanda, domanda){
	  	$(domanda).removeClass("quiz-question-right");
	  	$(domanda).removeClass("quiz-question-missed");
	  	$(domanda).removeClass("quiz-question-wrong");
		var $risposte = $("input", $(domanda));
		var tentativi = [];
		var stato = 'missed';
		$risposte.each(function(num_risposta, risposta){
		  var tentativo = $(risposta).is(":checked")/1;
		  var giusta = self.options.risposte[num_domanda][num_risposta];

		  if(tentativo && tentativo === giusta)
			$(risposta).parent().addClass("quiz-choice-right");
		  if(tentativo && tentativo !== giusta)
			$(risposta).parent().addClass("quiz-choice-wrong");
		  if(!tentativo && giusta)
			$(risposta).parent().addClass("quiz-choice-missed");
		});
		if($("li", $(domanda)).filter(".quiz-choice-wrong").length > 0)
			stato = 'wrong';
		else if($("li", $(domanda)).filter(".quiz-choice-right").length > 0 && $("li", $(domanda)).filter(".quiz-choice-missed").length > 0)
			stato = 'wrong';
		else if($("li", $(domanda)).filter(".quiz-choice-right").length > 0)
			stato = 'right';
		$(domanda).addClass("quiz-question-" + stato);
		//self._disableForm();
	  });
	
	var epubsc_message_quiz = {
        "componentId": window.componentId,
        "messageId": "b33ef720-556a-11e4-8ed6-0800200c9a66+1",
        "timestamp": Date.now(),
        "type": "epubsc_message",
        "method": "epubsc_publish",
        "topic": window.SCtopic,
        "topicData": {
        		"title": $("#quizTitle", self.element).html(),
                "rightNum": $(".quiz-question-right", self.element).length,
                "wrongNum": $(".quiz-question-wrong", self.element).length,
                "missedNum": $(".quiz-question-missed", self.element).length
        }
	};

	parent.postMessage(epubsc_message_quiz, '*' );
		
	/*  if ($(".quiz-question-right", self.element).length !== self.countDomande) {
		  $('.conteggio-finale', self.element)
		  	.empty()
		  	.append("<div class='finale-quiz finale-quiz-choice-right'></div><span>" + $(".quiz-question-right", self.element).length  + "</span>")
		  	.append("<div class='finale-quiz finale-quiz-choice-wrong'></div><span>" + $(".quiz-question-wrong", self.element).length + "</span>")
		  	.append("<div class='finale-quiz finale-quiz-choice-missed'></div><span>" + $(".quiz-question-missed", self.element).length+ "</span>")
		  	.show();
	  }
	  else {
	  	$('.messaggio-finale > p',self.element).html(self.options.messaggioTutteCorrette);
	  	$('.messaggio-finale', self.element).show();
	  }
	*/
	});
  };

	$('label', self.element).on(window.touchDownEvent, function(e){
		e.preventDefault();
		e.stopPropagation();
		if (window.touchDownEvent != "mousedown") {
			var checkID = "#" + $(this).attr("for");
			if ($(checkID).attr("type") == "radio") {
				$(checkID).prop("checked", true);
			} else {
				$(checkID).prop("checked", (!$(checkID).prop("checked")));
			}
			$(checkID).trigger("change");
		}
	});

  self._destroy = function() {
	  clearInterval(self._countdown);
  };

  self._startCountdown = function(){
	if(this.options.countdown === false)
	  return;
	self._stopCountdown();
	$('.countdown', self.element).html(""+this.options.countdown+"");

	self._countdown = setInterval(function(){
	  if($('.countdown', self.element).html()/1 == 0){
		clearInterval(self.options._countdown);
		$("button, input", self.element).attr("disabled", "disabled");
		return;
	  }
	  $('.countdown', self.element).html($('.countdown', self.element).html()/1 - 1);
	} ,1000);
  };

  self._stopCountdown = function(){
	if(self._countdown)
	  clearInterval(self._countdown);
  };

  self._disableForm = function(){
	this._readonly = true;
	self._stopCountdown();
	self._saveForm();
	$("input", self.element).filter(":not(.quiz_reset)").attr("disabled", "disabled");
  };

  self._enableForm = function(){
	this._readonly = false;
	if(self.options.countdown)
		self._startCountdown();
	setTimeout(function(){ $('.practicelist .multiple-choice-problem li', self.element).removeClass("quiz-choice-right").removeClass("quiz-choice-wrong").removeClass("quiz-choice-missed"); },100);
	$('.practicelist .multiple-choice-problem li', self.element).removeClass("quiz-choice-right").removeClass("quiz-choice-wrong").removeClass("quiz-choice-missed"); 
	$("button, input", self.element).removeAttr("disabled");
	//$('.quiz_check', self.element).attr("disabled", "disabled");
	$("button, input:checked", self.element).removeAttr("checked");
	self._saveForm();
	if(self.mySwiper){
		self.mySwiper.reInit();
		self.mySwiper.swipeTo(0, 200);
	}
  };

  self._saveForm = function(){
	if(self.options.save === false)
	  return;
	var checked = [];
	$('.practicelist input', self.element).each(function(num_risposta, risposta){
	  if($(risposta).is(":checked"))
		checked[num_risposta] = true;
	  else
		checked[num_risposta] = false;
	});
	var status = {
	  risposte : checked,
	  tempo : $('.countdown', self.element).html()/1,
	  readonly : this._readonly
	}

	if(window.localStorage){
	  window.localStorage["data-" + self.element.attr("id")] = JSON.stringify(status);
	}
  };

  //added for PUBSUB
  self._getStatus = function(){
	
	var status = {
	  right : $(".quiz-question-right", self.element).length,
	  wrong : $(".quiz-question-wrong", self.element).length,
	  missed : $(".quiz-question-missed", self.element).length
	}

	return status;
  };

  self._loadForm = function(){
	if(self.options.save === false)
	  return;

	if(window.localStorage){
	  var status = JSON.parse(window.localStorage["data-" + self.element.attr("id")]);
	  $('.practicelist input', self.element).each(function(num_risposta, risposta){
		if(status.risposte && status.risposte[num_risposta] == true)
		  $(risposta).attr("checked", "checked");
	  });
	  if(status.readonly === true){
		this._readonly = true;
		this._disableForm();
	  }
	}
  }

  self._loadForm();
  self._create();
  return self;
};