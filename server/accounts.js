// Set up login services
Meteor.startup(function() {

	// Remove configuration entries in case service is already configured
	ServiceConfiguration.configurations.remove({
		$or: [{service: "facebook"}, {service: "google"}, {service: "twitter"}]
	});

	/* Add Facebook - meteor.com
	ServiceConfiguration.configurations.insert({
		"service": "facebook",
		"appId": "1586977458195254",
		"secret": "1b3495895e21273faae2274843178433"
	}); */

	// Add Facebook - localhost
	ServiceConfiguration.configurations.insert({
		"service": "facebook",
		"appId": "329335093880226",
		"secret": "e025ef6c9200aa925c929d913a52958c"
	});

	// Add Google - localhost
	ServiceConfiguration.configurations.insert({
		"service": "google",
		"clientId": "404654317900-4jqj1u040ks6j9ik7610of653k09pcv9.apps.googleusercontent.com",
		"client_email": "404654317900-4jqj1u040ks6j9ik7610of653k09pcv9@developer.gserviceaccount.com",
		"secret": "wIOKkJVWafAojihAeKOTH8-S"
	});

	// Add Twitter - localhost
	ServiceConfiguration.configurations.insert({
		"service": "twitter",
		"clientId": "1OM4NmWNgfW6Hvp13KSUyw",
		"secret": "KvNP66jpa8YFtQpsuWbuDpNBUFPOJcQf9DUOBdhgc"
	});

});