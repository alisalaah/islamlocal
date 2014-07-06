Template.profile.rendered = function() {
	$("#updateProfile").validate();

	$("#locman").autocomplete({
	source: function (request, response) {
		$.ajax({
			url: "http://api.geonames.org/searchJSON?q=DE&country=DE&lang=en&username=demo&callback=?",
			dataType: "jsonp",
			data: {
				featureClass: "P",
				style: "full",
				maxRows: 12,
				name_startsWith: request.term
//				countryName: "Germany"
			},
			success: function (data) {
				response($.map(data.geonames, function (item) {
					return {
						label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
						value: item.name
					}
				}));
			}
		});
	}});


/*
	// Typeahead Manual Location Init
	var geoNamesUsername = 'uberboomtest';
	$('#locman').typeahead({
		name: $(this).attr('id'),
		remote: {
			// http://www.geonames.org/export/geonames-search.html
			url: 'http://api.geonames.org/searchJSON?q=%QUERY&maxRows=10&username=' + geoNamesUsername + '&lang=de&style=full',
			filter: function(parsedResponse) {
				var result = [];
				for (var i=0; i<parsedResponse.geonames.length; i++) {
					var geonameId = parsedResponse.geonames[i].geonameId;
					result.push({
						name: parsedResponse.geonames[i].name,
						value: parsedResponse.geonames[i].name,
						geonameId: geonameId,
						countryName: parsedResponse.geonames[i].countryName,
						lat: parsedResponse.geonames[i].lat,
						lng: parsedResponse.geonames[i].lng,
						bbox: parsedResponse.geonames[i].bbox
					});
				}
				return result;
			}
		},
		template: [
			'<p class="geo-name">{{name}}</p>',
			'<p class="geo-country text-muted">{{countryName}}</p>'
		].join(''),
		engine: Hogan
	});

	// Typeahead Hint
	$('#locman').on('typeahead:initialized', function(e, data) {
		// fix for using twitter bootstrap
		var hint = $(e.target).prev('.tt-hint');
		var small = $(e.target).is('.input-sm');
		var large = $(e.target).is('.input-lg');
		if (small) {
			hint.addClass('input-sm');
		} else if (large) {
			hint.addClass('input-lg');
		} else {
			hint.addClass('input');
		}
		hint.addClass('form-control');
	});
*/
};

Template.profile.events({
	'click #loctoggle': function(event) {
		var x = document.getElementById('loctoggle-0').checked;
		if (x === false) { $("#manloc").show(); $("#autoloc").hide(); }
		else { $("#manloc").hide(); $("#autoloc").show(); }
	}
});

// Edit Profile

Template.profile.profile = function() {
	return Meteor.user().profile;
};

Template.profile.getName = function() {
	var profile = Meteor.user().profile;
	var services = Meteor.user().services;
	
	if (profile.name !== undefined) { return profile.name; }
	if (services !== undefined) {
		if (services.facebook !== undefined) { if (services.facebook.name !== undefined) { return services.facebook.name; } }
		if (services.google !== undefined) { if (services.google.name !== undefined) { return services.google.name; } }
		if (services.twitter !== undefined) { if (services.twitter.name !== undefined) { return services.twitter.name; } }
	}
	else { return null; }
};

Template.profile.getEmail = function() {
	var profile = Meteor.user().profile;
	var services = Meteor.user().services;
	
	if (profile.email !== undefined) { return profile.email; }
	if (services !== undefined) {
		if (services.facebook !== undefined) { if (services.facebook.email !== undefined) { return services.facebook.email; } }
		if (services.google !== undefined) { if (services.google.email !== undefined) { return services.google.email; } }
		if (services.twitter !== undefined) { if (services.twitter.email !== undefined) { return services.twitter.email; } }
	}
	else { return null; }
};

Template.profile.getIfAuto = function() {
	var profile = Meteor.user().profile;
	if (profile.locauto !== false) { return 'checked'; }
};

Template.profile.getIfManual = function() {
	var profile = Meteor.user().profile;
	if (profile.locauto === false) { return 'checked'; }
};

Template.profile.displayGPS = function() {
	return displayGPS();
};

Template.profile.getRadius = function() {
	var profile = Meteor.user().profile;
	if (profile.notradius !== undefined) { return profile.notradius; }
	else { return 0; }
};

Template.profile.getIfKM = function() {
	var profile = Meteor.user().profile;
	if (profile.notunits !== "mi") { return 'checked'; }
};

Template.profile.getIfMI = function() {
	var profile = Meteor.user().profile;
	if (profile.notunits === "mi") { return 'checked'; }
};


// Show Profile

Template.profile.showIfAuto = function() {
	var profile = Meteor.user().profile;
	if (profile.locauto === true) { return "(A)"; }
};

Template.profile.showRadius = function() {
	if (profile !== undefined) {
		if (profile.notradius !== undefined) {
			var profile = Meteor.user().profile;
			var units = (profile.notunits === "mi") ? "mi" : "km";
			return profile.notradius+" "+units;
		}
	}
};

Template.profile.notJanazahs = function() {
	var profile = Meteor.user().profile;
	if (profile.janazahs === true) { return "checked"; }
};

Template.profile.notAqiqahs = function() {
	var profile = Meteor.user().profile;
	if (profile.aqiqahs === true) { return "checked"; }
};

Template.profile.notClasses = function() {
	var profile = Meteor.user().profile;
	if (profile.classes === true) { return "checked"; }
};
