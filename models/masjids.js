Masjids = new Meteor.Collection("masjids");

if (Meteor.isServer) {

	//Meteor.publish('masjids');
	
	Meteor.publish('masjids', function() {
		return Masjids.find({});
	});

	// server: publish the rooms collection, minus secret info.
	//Meteor.publish("masjids", function() {
	//	return Masjids.find({}, {fields: {secretInfo: 0}});
	//});

	// ... and publish secret info for rooms where the logged-in user
	// is an admin. If the client subscribes to both streams, the records
	// are merged together into the same documents in the Rooms collection.
	//Meteor.publish("masjidsSecretInfo", function() {
	//	return Masjids.find({admin: this.userId}, {fields: {secretInfo: 1}});
	//});
}

if (Meteor.isClient) {
	Meteor.subscribe('masjids');
}
