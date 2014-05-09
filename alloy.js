// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
Alloy.Globals.Facebook = require('facebook');
// Alloy.Globals.GoogleLogin = require('com.fadalabs.googleplus');

Alloy.Globals.iosVersion = 7;
try {Alloy.Globals.iosVersion = parseFloat(Ti.Platform.version);}
finally {};

var preferences = require('preferences');
var server = require('server');
var authentication = require('authentication');

// INITIALIZE GLOBAL SINGLETON INSTANCES OF ALL VARIABLES
var personas = Alloy.Collections.personas = Alloy.Collections.instance('personas');
var statuses = Alloy.Collections.statuses = Alloy.Collections.instance('statuses');
var contact_handles = Alloy.Collections.contact_handles = Alloy.Collections.instance('contact_handles');
var protocols = Alloy.Collections.protocols = Alloy.Collections.instance('protocols');
var persona_handles = Alloy.Collections.persona_handles = Alloy.Collections.instance('persona_handles');
var connections = Alloy.Collections.connections = Alloy.Collections.instance('connections');
var contacts = Alloy.Collections.contacts = Alloy.Collections.instance('contacts');

initializeApp();

function initializeApp(_state) {
	// Reset the UUID
	var deviceID = preferences.getDeviceId();
	if (deviceID === null) { // case for new installation
		Ti.App.Properties.setString('device_id',Ti.Platform.id);
	} else {
		if (deviceID !== Ti.Platform.id) { // case of fraud - delete entire DB
			Ti.API.error("DEVICE ID FRAUD");
			Alloy.Globals.logout();
		}	
	}
	// Reset the platform identifier
	if (OS_ANDROID) {
		Ti.App.Properties.setString('device_url','Android');
	} else if (OS_IOS) {
		Ti.App.Properties.setString('device_url','iPhone');
	}
	// Get address book access
	var address_book_access = preferences.getAddressBookAccess();
	Ti.API.error("The address_book_access is "+address_book_access);
	// address_book_access is an integer for boolean
	if (address_book_access === null || address_book_access === false) { // default value case: hasn't been initialized so prompt user
		Ti.API.error("************* ABOUT TO ASK FOR ACCESS *************")
		obtainLocalAddressBookAccess();
	}
}

// Verify access to local address book & fire upload if authorized
function obtainLocalAddressBookAccess(_state) {
	Ti.Contacts.requestAuthorization(function(e) {
		if (e.success) {
			// The user has consented to having his addressbook read by the app
			Ti.API.error("Setting address_book_access to true");
			Ti.App.Properties.setBool('address_book_access', true);
		} else {
			Ti.API.info('The user has restricted Channel from accessing his/her local address book');
			Ti.App.Properties.setBool('address_book_access', false);
		}
	});
};

// Set default dimensions for iOS and re-evaluate them for Android
Alloy.CFG.halfScreenWidth = (Titanium.Platform.displayCaps.platformWidth)/2;
if (OS_ANDROID) {
	Alloy.CFG.contactCardWidth = Titanium.Platform.displayCaps.platformWidth-(10*Titanium.Platform.displayCaps.logicalDensityFactor);
	Alloy.CFG.halfContactCardWidth = (Titanium.Platform.displayCaps.platformWidth-(10*Titanium.Platform.displayCaps.logicalDensityFactor))/2;
	Alloy.CFG.quarterContactCardWidth = (Titanium.Platform.displayCaps.platformWidth-(10*Titanium.Platform.displayCaps.logicalDensityFactor))/4;
	Alloy.CFG.threeQuarterContactCardWidth = 3*(Titanium.Platform.displayCaps.platformWidth-(10*Titanium.Platform.displayCaps.logicalDensityFactor))/4;
	Alloy.CFG.authenticateHeight = (Titanium.Platform.displayCaps.platformHeight-((48+85)*Titanium.Platform.displayCaps.logicalDensityFactor));
	Alloy.CFG.slideWindow = {activityEnterAnimation: Ti.Android.R.anim.slide_in_left, activityExitAnimation: Ti.Android.R.anim.slide_out_right};
	Alloy.CFG.fadeWindow = {activityEnterAnimation: Ti.Android.R.anim.fade_in, activityExitAnimation: Ti.Android.R.anim.fade_out};
} else if (OS_IOS) {
	Alloy.CFG.contactCardWidth = Titanium.Platform.displayCaps.platformWidth;
	if (Titanium.Platform.displayCaps.platformWidth > 640) {
		Alloy.CFG.contactCardWidth = 320;
	}
	Alloy.CFG.halfContactCardWidth = 98;
	Alloy.CFG.authenticateHeight = (Titanium.Platform.displayCaps.platformHeight-(44+80));
	Alloy.CFG.slideWindow = {};
	Alloy.CFG.fadeWindow = {};
}

function destroyDatabase() {
	personas.deleteAll();
	statuses.deleteAll();
	contact_handles.deleteAll();
	protocols.deleteAll();
	persona_handles.deleteAll();
	connections.deleteAll();
	contacts.deleteAll();
}

Alloy.Globals.networkCheck = function(_state) {
	var status = Ti.App.Properties.getBool('offline_flag');
	if (!Ti.Network.online) {
		if (!status) {
			alert(L('error_not_connected'));
			Ti.App.Properties.setBool('offline_flag', true);
		}
		return false;
	} else {
		Ti.App.Properties.setBool('offline_flag', false);
		return true;
	}
};

Alloy.Globals.logout = function(_state) {
	if (Alloy.Globals.networkCheck()) {
		authentication.logout({
			all_devices: false,
			onsuccess: function() {
				destroyDatabase();
				preferences.logout();
				_state.window.close();
				initializeApp();
				var indexController = Alloy.createController('index');
				var win = indexController.getView();
				win.open(Alloy.CFG.fadeWindow);
			},
			onerror: function() {
				destroyDatabase();
				preferences.logout();
				_state.window.close();
				initializeApp();
				var indexController = Alloy.createController('index');
				var win = indexController.getView();
				win.open(Alloy.CFG.fadeWindow);
				// alert(L('logout_error'));
			}
		});
	} else {
		// TODO: FORCE LOGOUT OPTION WHEN NOT ONLINE?
	}
};

Alloy.Globals.deactivateAccount = function(_state) {
	if (Alloy.Globals.networkCheck()) {
		authentication.deactivate({
			onsuccess: function() {
				destroyDatabase();
				preferences.logout();
				_state.window.close();
			},
			onerror: function() {
				alert(L('general_error'));
			}
		});
	} else {
		// TODO: FORCE LOGOUT OPTION WHEN NOT ONLINE?
	}
};

var activityIndicator_window = null;
var activityIndicator_view = null;
var activityIndicator_activityIndicator;
Ti.App.addEventListener('cancelActivityIndicator', function(e) {
		Ti.App.Properties.setBool('network_activity', false);
		if( activityIndicator_window != null )
		{
			activityIndicator_window.remove(activityIndicator_view);
			activityIndicator_window = null;
			if( activityIndicator_view ){
				activityIndicator_view.hide();
				activityIndicator_view = null;
			}
		}
});

Alloy.Globals.activityIndicator = function(_state) {
	if (!Ti.Network.online) {
		Ti.App.Properties.setBool('network_activity', false);
	}
	var style = OS_IOS ? Titanium.UI.iPhone.ActivityIndicatorStyle.BIG : Titanium.UI.ActivityIndicatorStyle.BIG;
	var activity_indicator = Ti.UI.createView({
		backgroundColor: '#90000000',
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
	});
	var activity_animation = Ti.UI.createActivityIndicator({
		height: Ti.UI.SIZE,
		width: Ti.UI.SIZE,
		color: '#FFFFFF',
		font: {
			fontFamily: 'Open Sans Condensed',
			fontSize: '18dp',
			fontWeight: 'bold'
		},
		message: L('activity_indicator'),
		style: style,
	});
	activity_indicator.add(activity_animation);
	_state.window.add(activity_indicator);
	activity_animation.show();
	activity_indicator.show();
	_state.window.show();
	Ti.App.Properties.setBool('network_activity', true);
	if( activityIndicator_window != null )
	{
		activityIndicator_window.remove(activityIndicator_view);
	}
	activityIndicator_window = _state.window;
	activityIndicator_view = activity_indicator;
}


Alloy.Globals.fullAppRefresh = function(_state) {
	server.getUser({});
	Ti.App.fireEvent('refreshMainContactsTable');
	server.listConnections({});
	Ti.App.fireEvent('refreshConnectionsBadge');
};