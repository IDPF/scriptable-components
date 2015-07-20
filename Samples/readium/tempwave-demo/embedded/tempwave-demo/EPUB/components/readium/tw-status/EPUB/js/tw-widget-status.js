		// Global variables.
		//var cTime	       = 0;  // Current time, in seconds
		var	bInitID        = 0;
        var airTempID;
        var airTemperature;
        var statusID;
		var dateID;
        var	omegaDay       = 1.0 / (24.0 * 3600.0);			// seconds in a day, so temp cycles in one day
		//var	Temps	       = Array(10);		// for each depth
		var Month          = ["January","February","March","April","May","June","July", "August","September","October","November","December"];
		//var	dateObj		   = Date(1970,7,1);	// 1 July 1970

        /*
		function  getSVGDoc(node) {
			if (node.getNodeType()==9) 
				return node; 
			else 
				return node.getOwnerDocument(); 
		}
    */

        window.onload = function() {

			// This makes the next_update function available to JavaScript functions
			// defined outside of the SVG document. This is needed so that the
			// setInterval function can find and call next_update when needed.
			//window.TempWaveJS_next_update = next_update;

			//window.TempWaveJS_svgdoc = evt.target.ownerDocument; // getSVGDoc(evt.target);
		
			initIDs();

            /*
			epubsc.subscribe("tempwave", function(msg) {
				var ID = msg.data.widgetId;
				var time = formatTimeString( new Date(msg.data.topicData.time));
				console.log( "Widget-Handler-Status: [tempwave] " + " ESC: "+ ID.substr(0,9) + ",  temp: " + msg.data.topicData.currentTemp + " at: " + time);
			});
			*/
		};

		// Set up the various parameters of the simulation
		function InitSimulation () {
            initIDs();
		}

		// get the month from a a Julian value
		function GetMonth ( julianDay, year ) {
			mois = Math.floor(julianDay / 30.42) + 1;
			if ((julianDay == 60)  &&  ((year % 4) != 0))  mois++;
			if ((julianDay == 91) || (julianDay == 121) || (julianDay == 152) || (julianDay == 182))  mois++;
			if (julianDay == 31)   mois--;

			return mois;
		}

		// get the day of the month from a Julian date
		function GetDayOfMonth ( julianDay, year ) {
			var mois = 	GetMonth( julianDay, year );

			return Math.floor(julianDay - Julian(1, Math.floor(mois), year) + 1);
		}

		// get a Julian date from the dddmmyy value
		function Julian ( jour, mois, annee ) {
			var   j = Math.floor( (30.42 * (mois - 1)) + jour);

			if (mois == 2)  j++;
			if ((mois > 2)  &&  (mois < 8))  j--;
			if ((mois > 2)  &&  ((annee % 4) == 0)  &&  (annee != 0))  j++;

			return Math.floor(j);
		}

		// Do the init of the various objects
		function initIDs () 	{
			//var svgDoc   = window.TempWaveJS_svgdoc;

			airTempID = document.getElementById("B_AirTemp");
			dateID    = document.getElementById("B_Date");

            // Get a reference to the <div> on the page that will display the message text.
            statusDiv = document.getElementById('statusDiv');

            bInitID = 1;
		}

		// This function implements the animation.
        /*
		function next_update ()	{
			var svgDoc   = window.TempWaveJS_svgdoc;

			if ( bInitID == 0 )	{
				InitIDs();
			}

			UpdateAirTemp();

			// Update the profile
			UpdateProfile();

			// then all the depths through time
			UpdateAllDepths();

			curTime += timeStep * rateValue;

			UpdateDate();
		}
    */

		// update the date info
		function updateDateAndTemp ( msg ) {

            airTemperature = msg.data.topicData.airTemp;

			// update the day number
			var dayNumber = 182 + msg.data.topicData.time * omegaDay;
			while (dayNumber > 365)
				dayNumber -= 365;

			var		jour = GetDayOfMonth( dayNumber, 0);
			var		mois = GetMonth( dayNumber, 0);
			var		dateStr = jour + ' ' + Month[mois-1];

            logMsg( statusDiv, "Date: " + dateStr + "  -  airTemp: " + airTemperature.toFixed(1));

            //dateID.firstChild.nodeValue = dateStr;

			//airTempID.firstChild.nodeValue = airTemperature.toFixed(1);
		}

        epubsc.subscribe("tempwave", function(msg) {
            var ID = msg.data.widgetId;
            var time = formatTimeString( new Date(msg.data.topicData.time));
            console.log( "Widget-Handler: [tempwave] " + " ESC: "+ ID.substr(0,9) + ",  temp: " + msg.data.topicData.airTemp + " at: " + time);
            updateDateAndTemp(msg);
        });

        epubsc.subscribe("tw-controls", function(msg) {

            if (msg.data.topicData.command == "restart") {
                while (statusDiv.firstChild) {
                    statusDiv.removeChild(statusDiv.firstChild);
                }
            }
        });