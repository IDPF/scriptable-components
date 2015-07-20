		// Global variables.
		var curTime	       = 0;  // Current time, in seconds
		var Depth          = Array(10);
		var	DepthID        = Array(10);
		var nDepth         = 10;

		var	airTemperature = 0.0;			// today's air temperature
		var	bInitID        = 0;
		var	Temps	       = new Array(10);		// for each depth
		var	Times	       = new Array(10);		// for each depth
		var nCurTemp       = 0;
		var	rateValue	   = 2;						// stepping rate of simulation
		var nMaxTemp       = 24 * 7 / rateValue;	// one week's worth	of hours / rateValue
		var	nTotTemp        = 0;
		var timeOffset     = 0.0;

		function  getSVGDoc(node) 
		{ 
			if (node.getNodeType()==9) 
				return node; 
			else 
				return node.getOwnerDocument(); 
		}

		function on_load(evt) {

			window.TempWaveJS_svgdoc = evt.target.ownerDocument;
		
			getIDs();

            for ( n=0; n<nDepth; n++ )
            {
                Temps[n] = new Array(200);  // 24 times a day for a week
                Times[n] = new Array(200);
            }
		}

		// Do the init of the various objects
		function getIDs ()
		{
			var svgDoc   = window.TempWaveJS_svgdoc;

			DepthID[0] = svgDoc.getElementById('B_Depth0');
			DepthID[1] = svgDoc.getElementById('B_Depth1');
			DepthID[2] = svgDoc.getElementById('B_Depth2');
			DepthID[3] = svgDoc.getElementById('B_Depth3');
			DepthID[4] = svgDoc.getElementById('B_Depth4');
			DepthID[5] = svgDoc.getElementById('B_Depth5');
			DepthID[6] = svgDoc.getElementById('B_Depth6');
			DepthID[7] = svgDoc.getElementById('B_Depth7');
			DepthID[8] = svgDoc.getElementById('B_Depth8');
			DepthID[9] = svgDoc.getElementById('B_Depth9');

			bInitID = 1;
		}

		// Update the temperature for each depth at the current time and concat
		// the new value onto the string
		function updateAllDepths ( data )	{
            curTime = data.topicData.time;

			if (nTotTemp >= nMaxTemp)
			{
				timeOffset = curTime / 3600.0 - 24.0 * 7.0;
			}

			// for ( j=0; j<2; j++ )
			for ( j=0; j<nDepth; j++ )
			{
				updateTempAtDepth( j, DepthID[j], data.topicData );
			}

			nTotTemp++;
			nCurTemp++;
			if (nCurTemp >= nMaxTemp)
				nCurTemp = 0;
		}

		// Update the temperature for each depth at the current time and concat
		// the new value onto the string
		function updateTempAtDepth ( depthNum, depthID, topicData ) {
			Temps[depthNum][nCurTemp] = topicData.temps[depthNum].t;

			Times[depthNum][nCurTemp] = topicData.time / 3600.0;   // get time in hours

			// find the first index in our ring buffer
			index = nCurTemp - nMaxTemp;
			if (index < 0)
			{
				if ((nTotTemp < nMaxTemp) || (nTotTemp % nMaxTemp) == (nMaxTemp - 1))
					index = 0;
				else
					index += nMaxTemp + 1;
			}

			// now build the string from the values in the buffer
			var	pointStr = '';
			for ( k=0; k<nMaxTemp && k<=nTotTemp; k++ )
			{
				if (isNaN(Temps[depthNum][index]))
					alert('NAN');

                //console.log(" curTime: " + curTime);

				var dTime = Times[depthNum][index] - timeOffset;
				pointStr += dTime + ',' + Temps[depthNum][index] + ' ';

				// increment the index and wrap around in the ring buffer, if need be
				index++;
				if (index >= nMaxTemp)
					index = 0;
			}

			updatePolyline( depthID, pointStr );
		}

		// update the points attribute of the specified polyline
		function updatePolyline ( elmID, pointStr )
		{
			// Update the profile
			elmID.setAttribute("points", pointStr );
			
			// the following line exists only to force the object to be Updated - SVG bug!
			elmID.style.setProperty('stroke-linecap', 'round');
		}

		epubsc.subscribe("tempwave", function(msg) {
			var ID = msg.data.widgetId;
			var time = formatTimeString( new Date(msg.data.topicData.time));
			console.log( "Widget-Handler: [tempwave] " + " ESC: "+ ID.substr(0,9) + ",  temp: " + msg.data.topicData.airTemp + " at: " + time);
			updateAllDepths(msg.data);
		});


