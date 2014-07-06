Template._loginButtonsLoggedOutDropdown.rendered = function() {
	$("#login-dropdown-list > a").html('Sign in <b class="caret"></b>');
};
Template._loginButtonsLoggedInDropdown.events({
	'click #login-dropdown-list': function(event) {
		$("#login-buttons-open-change-password").remove();
	},
	'click #login-buttons-edit-profile': function(event) {
		//event.stopPropagation();
		$("#login-dropdown-list").removeClass("open");
		Router.go('profile');
	},
	'click #login-buttons-logout': function(event) {
		Router.go('home');
	}
});
