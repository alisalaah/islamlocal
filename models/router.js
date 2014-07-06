Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

Router.onBeforeAction('loading');
Router.onBeforeAction(function(pause) {
	sessionGPS();
	if (!Meteor.user())
		if (Meteor.loggingIn())
			return pause();
	if (Meteor.user()) { // User is logged in
		if (!Meteor.user().profile.house) {
			this.redirect('/profile');
		}
	}
});

Router.map(function() {
	this.route('home', {path: '/',
		onBeforeAction: function() {
			document.title = "IslamLocal | local prayer times, masjids, news, and more!";
		},
		onAfterAction: function() {
			window.onresize = function() {
				resizeMap();
			};
			setTimeout(function() {
				resizeMap();
			}, 1);
			setTimeout(function() {
				renderMap();
			}, 1);
		}});

	this.route('about', {
		onBeforeAction: function() {
			document.title = "IslamLocal | About";
		}});

	this.route('profile', {
		onBeforeAction: function() {
			if (!Meteor.user())
				if (!Meteor.loggingIn())
					this.redirect('/');
			else
				document.title = "IslamLocal | Profile";
		},
		date: function() {
			return Meteor.user().profile;
		}
	});

	this.route('masjid', {path: '/masjid/:id',
		onBeforeAction: function() {
			document.title = "IslamLocal | Masjid";
		},
		waitOn: function() {
			var q = {id: this.params.id};
			return Meteor.subscribe('users', q);
		},
		data: function() {
			var q = {id: this.params.id};
			return Masjids.findOne(q);
		}});

	this.route('admin', {
		path: '/admin',
		template: 'accountsAdmin',
		onBeforeAction: function() {
			if (Meteor.loggingIn()) {
				this.render(this.loadingTemplate);
			} else if (!Roles.userIsInRole(Meteor.user(), ['admin'])) {
				console.log('redirecting');
				this.redirect('/');
			}
		}
	});
});
