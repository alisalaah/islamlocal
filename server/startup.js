Meteor.startup(function() {
	
	// Set admin role
	//if (Meteor.users.findOne("qyguAtA42XNvQhy4W"))
	//	Roles.addUsersToRoles("qyguAtA42XNvQhy4W", ['admin']);
	
	// Add initial masjids to database
	if (Masjids.find().count() === 0) {
		Masjids.insert({
			id: "1",
			type: "dus",
			name: "Dar us-Sunnah",
			location: {
				type: "Point",
				coordinates: [106.649429, -6.173172]
			},
			address: {
				country: "Indonesia",
				state: "Banten",
				city: "Tangerang",
				postal: "15119",
				district: "Tanah Tinggi",
				block: "Guru Minda",
				street: "Jl Kikil No. 1"
			}
		});
		Masjids.insert({
			id: "2",
			type: "masjid",
			name: "Darussalam",
			location: {
				type: "Point",
				coordinates: [106.647539, -6.173920]
			},
			address: {
				country: "Indonesia",
				state: "Banten",
				city: "Tangerang",
				district: "Tanah Tinggi",
				block: "Meteorologi",
				street: "Jl Meteorologi No. 20"
			}
		});
		Masjids.insert({
			id: "3",
			type: "masjid",
			name: "Masjid al-Islah",
			location: {
				type: "Point",
				coordinates: [106.647769, -6.168003]
			},
			address: {
				country: "Indonesia",
				state: "Banten",
				city: "Tangerang",
				district: "Tanah Tinggi"
			}
		});
		Masjids.insert({
			id: "4",
			type: "masjid",
			name: "Masjid al-Hakim",
			location: {
				type: "Point",
				coordinates: [106.644418, -6.169274]
			},
			address: {
				country: "Indonesia",
				state: "Banten",
				city: "Tangerang",
				district: "Tanah Tinggi",
				block: "Kehakiman",
				street: "Jl Kehakiman"
			}
		});
	}
	
});

