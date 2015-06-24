window.onload = function() {
		window.addEventListener('message', receiveMessage);
		/* Insert your custom JavaScript code below */
		function receiveMessage(e) {
			//if (e.data.topic == "PubCoderQuiz") {			
			 	$('#results').empty()
			 		.append("<div style='clear:both; margin-bottom: 10px'>" + e.data.topicData.title + "</div>")
			 		.append("<div class='finale-quiz finale-quiz-choice-right'></div><span>" + e.data.topicData.rightNum + "</span>")
				  	.append("<div class='finale-quiz finale-quiz-choice-wrong'></div><span>" + e.data.topicData.wrongNum + "</span>")
				  	.append("<div class='finale-quiz finale-quiz-choice-missed'></div><span>" + e.data.topicData.missedNum + "</span>");
		  	
		
		//}
	}

};