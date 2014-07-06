Meteor.startup(function() {
	Hooks.init();
});

function checkProfile() {
	if (!Meteor.user().profile.house) {
		Router.go('/profile');
	}
};

Hooks.onLoggedIn = function(userId) {
	setTimeout(function() {
		checkProfile();
	}, 1000);
};

Hooks.onLoggedOut = function() {
	Router.go('/');
};

this.sessionGPS = function() {
	// Geolocation
	if (navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(function(position) {
			initialLocation = [position.coords.latitude, position.coords.longitude];
			setLocation(initialLocation, true);
		}, function() {
			handleNoGeo(browserSupportFlag);
		});
	}
	// Browser doesn't support Geolocation
	else {
		browserSupportFlag = false;
		handleNoGeo(browserSupportFlag);
	}
};

function handleNoGeo(errorFlag) {
	if (!Session.get('geowarn')) {
		Session.set('geowarn', true);
		if (errorFlag == true) {
			var html = "<p><strong>Geolocation service failed!</strong></p>";
			html += "<p>This website is a locations and prayer times website which uses your location to operate.  This website will not function properly without enabling location services. Your location is never shared in anyway to other people or companies. Enabling this simply allows our website to function properly for you.</p>";
			html += "<p><small>For directions on how to enable this click <a href='https://waziggle.com/BrowserAllow.aspx' target='_blank'><strong>here</strong></a></small></p>";
			bootbox.alert(html);
		} else {
			alert("Your browser doesn't support geolocation.");
		}
	}
	// TO DO: Set with IP or other methods

	initialLocation = [21.422495, 39.826165];
	setLocation(initialLocation, false);
}

function setLocation(initialLocation, fromgps) {
	Session.set('geo', initialLocation);
	Session.set('gps', fromgps);
}

this.displayGPS = function() {
	var x = Session.get('geo');
	if (x !== undefined) {
		var lat = x[0].toFixed(6); var lng = x[1].toFixed(6);
		return 'Lat: '+lat+' / Lng: '+lng;
	}
};