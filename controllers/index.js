// Check if the user is authenticated and redirect accordingly
var preferences = require('preferences');
var authentication = require('authentication');

$.indexWindow.addEventListener('close', function(e) {
	preferences = null;
	authentication = null;
});

$.indexWindow.addEventListener('open', function(e) {
	if (OS_ANDROID) {
		Ti.API.error("heavyweigth window "+$.indexWindow.activity);
	    var activity = $.indexWindow.getActivity();
	    activity.actionBar.setLogo('/images/appicon_long.png');
	    activity.actionBar.setTitle('');
		// Menu buttons (including overflow items for market setting and info)s
	    activity.onCreateOptionsMenu = function(e) {
	        var menu = e.menu;	                  
	        var appInfo = menu.add({
	            title : L('app_info'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
	            icon: "images/ic_action_about.png",
	        });
	        appInfo.addEventListener("click", function(e) {
	        	openInfoWindow();
	        });
	    };
	    // activity.invalidateOptionsMenu();
	} else if (OS_IOS) {
		if (Alloy.Globals.iosVersion < 7) {
			// remove the status bar from the screen of devices that are running iOS 6
			$.indexWindow.top = '-20dp';
		}
	}
}); 

function openInfoWindow() {
	alert('I clicked on the info button!');
}

function openTermsUrl() {
	Titanium.Platform.openURL('http://www.channel-app.com/terms.html');
}

function startApp() {
	var authentication_token = preferences.getAuthenticationToken();
	if (authentication_token != null) {
		$.indexWindow.remove($.container);
		Alloy.Globals.activityIndicator({window:$.indexWindow});
		var contactsController = Alloy.createController('contacts');
		var win = contactsController.getView();
		win.open(Alloy.CFG.fadeWindow);
	} else {
		$.indexWindow.open(Alloy.CFG.fadeWindow);
	}
}

function resetPassword() {
	if (Alloy.Globals.networkCheck()) {
		var email = $.signinEmail.value;
		if (email.length === 0) {
			alert(L('reset_password_instructions'));
		} else {
			$.signinEmail.blur();
			$.signinPassword.blur();
			Alloy.Globals.activityIndicator({window:$.signinFields});
			authentication.reset_password({
				email : email,
				onsuccess: function() {
					Ti.App.fireEvent('cancelActivityIndicator');
					alert(L('set_password_message'));
				},
				onerror: authError,
			});
		}
	}
}

function blurAllFields() {
	blurSignupFields();
	blurSigninFields();
}

function blurSignupFields() {
	$.signupName.blur();
	$.signupEmail.blur();
	$.signupPhone.blur();
}

function blurSigninFields() {
	$.signinEmail.blur();
	$.signinPassword.blur();
}

function authError() {
	alert(L('general_error'));
}

function focusSignupEmail() {
	$.signupEmail.focus();
}

function focusSignupPhone() {
	$.signupPhone.focus();
}

function focusSigninPassword() {
	$.signinPassword.focus();
}

function successCallback() {
	startApp();
	Ti.App.fireEvent('cancelActivityIndicator');
}

function errorCallback() {
	authError();
	$.indexWindow.setTouchEnabled(true);
	Ti.App.fireEvent('cancelActivityIndicator');
}

function showTermsDialog(_state) {
	var opts = {
		title: L('termsagree')
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('privacy_settings_option0'), L('privacy_settings_option1')];
	} else {
		opts.options = [L('privacy_settings_option0'), L('privacy_settings_option1')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			_state.callback(_state.callbackSlug);
		} else {
			alert(L('error_terms_not_agree'));
		}
	});
	dialog.show();
}

function signup() {
	$.signupButton.animate({opacity: 0.1, duration : 20}, function(){
		$.signupButton.animate({opacity: 1.0, duration : 200}, function(){});
	});
	if (Alloy.Globals.networkCheck()) {
		var name = $.signupName.value;
		var email = $.signupEmail.value;
		var phone = $.signupPhone.value;
		if (name.length === 0 || email.length === 0 || phone.length === 0) {
			alert(L('error_form_fill'));
		} else {
			$.signupName.blur();
			$.signupEmail.blur();
			$.signupPhone.blur();
			Ti.App.Properties.setBool('new_user', true);
			showTermsDialog({
				callback: function(_e) {
					Alloy.Globals.activityIndicator({window:$.signupFieldsSectionView});
					$.indexWindow.setTouchEnabled(false);
					authentication.signup(_e);
				},
				callbackSlug: {
					first_name: name.split(" ")[0],
					last_name: name.split(" ")[1],
					email: email,
					phone: phone,
					onsuccess: successCallback,
					onerror: errorCallback,
				}
			});
		}
	}
}

function signin() {
	$.signinButton.animate({opacity: 0.1, duration : 20}, function(){
		$.signinButton.animate({opacity: 1.0, duration : 200}, function(){});
	});
	if (Alloy.Globals.networkCheck()) {
		var email = $.signinEmail.value;
		var password = $.signinPassword.value;
		if (email.length === 0 || password.length === 0) {
			alert(L('error_form_fill'));
		} else {
			$.signinEmail.blur();
			$.signinPassword.blur();
			Alloy.Globals.activityIndicator({window:$.signinFieldsSectionView});
			$.indexWindow.setTouchEnabled(false);
			$.signinPassword.setValue('');
			authentication.signin({
				email : email,
				password : password,
				onsuccess: successCallback,
				onerror: errorCallback,
			});
		}
	}
}

function facebookOauthicate() {
	Ti.App.Properties.setBool('new_user', true);
	var url = preferences.getServerPrefix() + "/users/auth/facebook";
	var beforeloadUrl = '/users/auth/facebook/callback';
	var webviewController = Alloy.createController('webview', {url: url, beforeloadUrl: beforeloadUrl, successCallback: successCallback});
	var win = webviewController.getView();
	win.open(Alloy.CFG.fadeWindow);
}

function googleOauthicate() {
	Ti.App.Properties.setBool('new_user', true);
	var url = preferences.getServerPrefix() + "/users/auth/google";
	var beforeloadUrl = '/users/auth/google/callback';
	var webviewController = Alloy.createController('webview', {url: url, beforeloadUrl: beforeloadUrl, successCallback: successCallback});
	var win = webviewController.getView();
	win.open(Alloy.CFG.fadeWindow);
}

startApp();
