this.resizeMap = function() { $("#map").css("height", window.innerHeight - 51 + "px"); };
this.renderMap = function() {
	GoogleMaps.init({'sensor': true}, function() {
		var mapOptions = {
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DEFAULT,
				position: google.maps.ControlPosition.TOP_RIGHT
			},
			panControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.DEFAULT,
				position: google.maps.ControlPosition.TOP_RIGHT
			},
			scaleControl: false,
			streetViewControl: false,
		};
		map = new google.maps.Map(document.getElementById("map"), mapOptions);

		// All Controls in One Function
		var MapControls = new Controls(map);

		// Geolocation
		if (navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				setLocation(initialLocation, true);
			}, function() {
				handleNoGeolocation(browserSupportFlag);
			});
		}
		// Browser doesn't support Geolocation
		else {
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		}

		function handleNoGeolocation(errorFlag) {
			if (errorFlag == true) {
				//				alert("Geolocation service failed. We've placed you in Makkah.");
			} else {
				//				alert("Your browser doesn't support geolocation. We've placed you in Makkah.");
			}

			// TO DO: Set with IP or other methods

			initialLocation = new google.maps.LatLng("21.422495", "39.826165");
			setLocation(initialLocation, false);
		}

		function setLocation(initialLocation, fromgps) {
			map.setCenter(initialLocation);
			// Place a marker
			gps = new google.maps.Marker({
				position: initialLocation,
				map: map,
				title: 'Current Location',
				icon: '/gps-marker.gif',
				optimized: false
			});

			// Fill in GPS Prayer Times
			ctime = Math.round(new Date().getTime() / 1000);
			tzurl = "https://maps.googleapis.com/maps/api/timezone/json?location=" + initialLocation.lat() + "," + initialLocation.lng() + "&timestamp=" + ctime + "&sensor=true";
			gcurl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + initialLocation.lat() + "," + initialLocation.lng() + "&sensor=true";
			$.ajax(tzurl).done(function(tz) {
				$.ajax(gcurl).done(function(data) {
					for (var i = 0; i < data.results.length; i++) {
						for (var j = 0; j < data.results[i].address_components.length; j++) {
							for (var k = 0; k < data.results[i].address_components[j].types.length; k++) {
								if (data.results[i].address_components[j].types[k] === 'locality') {
									var city_name = data.results[i].address_components[j].long_name;
								}
								if (data.results[i].address_components[j].types[k] === 'country') {
									var country = data.results[i].address_components[j].short_name;
									var country_name = data.results[i].address_components[j].long_name;
								}
							}
						}
					}

					// Array of countries and the method most accurate for them
					var mwl = ["AL", "AD", "AM", "AT", "BY", "BE", "BA", "BG", "CH", "CY", "CZ", "DE", "DK", "EE",
						"ES", "FO", "FI", "FR", "GB", "GE", "GI", "GR", "HU", "HR", "IE", "IS", "IT", "LT", "LU", "LV",
						"MC", "MK", "MT", "NO", "NL", "PL", "PT", "RO", "RU", "SE", "SI", "SK", "SM", "TR", "UA", "VA", // Europe
						"AU", "ZA", // Australia, South Africa
						"TW", "CN", "JP", "KP", "KR", "MN"]; // Far East
					var isna = ["US", "CA"]; // US & Canada
					var egypt = ["ID", "MY", "TH", "BN", "SG", "KH", "VN", "LA", "MM", "PH", // SE Asia
						"SY", "LB", "EG", "IL", "JO", "IQ"]; // Africa, Syria, Lebanon, etc.
					var makkah = ["SA", "AE", "OM", "YE", "BH", ]; // Arabian Peninsula
					var karachi = ["PK", "BD", "IN", "AF"]; // Subcontinent
					var tehran = ["IR"]; // Iran only

					// Set Prayer Times Method based on Country
					if (mwl.indexOf(country) !== -1) {
						prayTimes.setMethod('MWL');
					}
					else if (isna.indexOf(country) !== -1) {
						prayTimes.setMethod('ISNA');
					}
					else if (egypt.indexOf(country) !== -1) {
						prayTimes.setMethod('Egypt');
					}
					else if (makkah.indexOf(country) !== -1) {
						prayTimes.setMethod('Makkah');
					}
					else if (karachi.indexOf(country) !== -1) {
						prayTimes.setMethod('Karachi');
					}
					else if (tehran.indexOf(country) !== -1) {
						prayTimes.setMethod('Tehran');
					}
					else {
						prayTimes.setMethod('MWL');
					} // If country is not specified above

					// Get the times
					offset = tz.rawOffset / 3600;
					var date = new Date(); // today
					var times = prayTimes.getTimes(date, [initialLocation.lat(), initialLocation.lng()], offset);
					var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
					var html = '<table id="timetable">';
					//html += '<tr><th colspan="2">' + date.toLocaleDateString() + '</th></tr>';
					html += '<tr><th colspan="2">' + city_name + '</th></tr>';
					for (var i in list) {
						color = (list[i] === "Sunrise") ? "#ddd" : "#444";
						html += '<tr><td style="color:' + color + '">' + list[i] + ' &nbsp; &nbsp; &nbsp; </td>';
						html += '<td style="color:' + color + '"> ' + times[list[i].toLowerCase()] + '</td></tr>';
					}
					html += '</table>';
					gps.info = new google.maps.InfoWindow({
						content: html
					});
					google.maps.event.addListener(gps, 'click', function() {
						gps.info.open(map, gps);
					});
					gps.info.open(map, gps);
				});
			});
		}


		function Controls(map) {
			var controlDiv = document.createElement('div');
			controlDiv.style.padding = '5px';


			// Qibla
			var qiblaUI = document.createElement('div');
			qiblaUI.style.backgroundColor = 'white';
			qiblaUI.style.borderWidth = '1px';
			qiblaUI.style.borderStyle = 'solid';
			qiblaUI.style.borderColor = '#999';
			qiblaUI.style.cursor = 'pointer';
			qiblaUI.style.textAlign = 'center';
			qiblaUI.style.hover = 'center';
			qiblaUI.style.width = '40px';
			qiblaUI.style.float = 'left';
			qiblaUI.id = 'qibla';
			qiblaUI.title = 'Click to view Qibla direction';
			controlDiv.appendChild(qiblaUI);

			var qiblaText = document.createElement('div');
			qiblaText.style.fontFamily = 'Arial,sans-serif';
			qiblaText.style.fontSize = '11px';
			qiblaText.style.padding = '1px 4px 1px 4px';
			qiblaText.innerHTML = 'Qibla';
			qiblaUI.appendChild(qiblaText);

			// Set hover toggle event
			$(qiblaUI)
					.mouseenter(function() {
						$(qiblaUI).css('background-color', '#eee');
					})
					.mouseleave(function() {
						$(qiblaUI).css('background-color', '#fff');

					});

			// On Click
			google.maps.event.addDomListener(qiblaUI, 'click', function() {
				if ($(qiblaText).html() === "Qibla") {
					$(qiblaText).html("<strong>Qibla</strong>");

				} else {
					$(qiblaText).html("Qibla");
				}
			});



			// Masjids
			var masjidsUI = document.createElement('div');
			masjidsUI.style.backgroundColor = 'white';
			masjidsUI.style.borderWidth = '1px';
			masjidsUI.style.borderStyle = 'solid';
			masjidsUI.style.borderColor = '#999';
			masjidsUI.style.borderLeft = 'none';
			masjidsUI.style.cursor = 'pointer';
			masjidsUI.style.textAlign = 'center';
			masjidsUI.style.hover = 'center';
			masjidsUI.style.width = '50px';
			masjidsUI.style.float = 'left';
			masjidsUI.id = 'masjids';
			masjidsUI.title = 'Click to view Masjids on the map';
			controlDiv.appendChild(masjidsUI);

			var masjidsText = document.createElement('div');
			masjidsText.style.fontFamily = 'Arial,sans-serif';
			masjidsText.style.fontSize = '11px';
			masjidsText.style.padding = '1px 4px 1px 4px';
			masjidsText.innerHTML = 'Masjids';
			masjidsUI.appendChild(masjidsText);

			// Set hover toggle event
			$(masjidsUI)
					.mouseenter(function() {
						$(masjidsUI).css('background-color', '#eee');
					})
					.mouseleave(function() {
						$(masjidsUI).css('background-color', '#fff');

					});

			// On Click
			google.maps.event.addDomListener(masjidsUI, 'click', function() {
				if ($(masjidsText).html() === "Masjids") {
					$(masjidsText).html("<strong>Masjids</strong>");
				} else {
					$(masjidsText).html("Masjids");
				}
			});

			map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
		}

	});
};
