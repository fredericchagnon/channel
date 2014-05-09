var Alloy = require('alloy');
// Code to access and store application prefences listed below:
// email
// user_id
// authentication_token
// device_id
// current_status
// push_notification
// push_token
// address_book_access
// sync_google
// sync_facebook
// group_selected
// menu_index
// uploaded_emails
// refresh_required
// offline_flag
// server_timeout
// server_prefix
// homepage_url
// network_activity
// new_user

// Functions to fetch properties with appropriate defaults set
exports.getUserId = function() {
	return Ti.App.Properties.getString('user_id', null);
}
exports.getEmail = function() {
	return Ti.App.Properties.getString('email', null);
}
exports.getAuthenticationToken = function() {
	return Ti.App.Properties.getString('authentication_token', null);
}
exports.getDeviceId = function() {
	return Ti.App.Properties.getString('device_id', null);
}
exports.getAddressBookAccess = function() {
	return Ti.App.Properties.getBool('address_book_access', false);
}
exports.getRefreshRequired = function() {
	return Ti.App.Properties.getBool('refresh_required', false);
}
exports.getUploadedEmails = function() {
	return Ti.App.Properties.getList('uploaded_emails', null);
}
exports.getSyncGoogle = function() {
	return Ti.App.Properties.getBool('sync_google', false);
}
exports.getSyncFacebook = function() {
	return Ti.App.Properties.getBool('sync_facebook', false);
}
exports.getPushNotification = function() {
	return Ti.App.Properties.getBool('push_notification', false);
}
exports.getPushToken = function() {
	return Ti.App.Properties.getString('push_token', null);
}
exports.getMenuIndex = function() {
	return Ti.App.Properties.getInt('menu_index', 999);
}
exports.getGroupSelected = function() {
	return Ti.App.Properties.getString('group_selected', 'all');
}
exports.getOfflineFlag = function() {
	return Ti.App.Properties.getBool('offline_flag', true);
}
exports.getServerTimeout = function() {
	return Ti.App.Properties.getInt('server_timeout', 150000);
}
exports.getServerPrefix = function() {
	return Ti.App.Properties.getString('server_prefix', 'https://api.channel-app.com');
}
exports.getHomepageUrl = function() {
	return Ti.App.Properties.getString('homepage_url', 'http://www.channel-app.com/');
}
exports.getNetworkActivity = function() {
	return Ti.App.Properties.getBool('network_activity', false);
}
exports.getNewUser = function() {
	return Ti.App.Properties.getBool('new_user', false);
}

exports.saveUser = function(_object) {
	var existing_user_id = Ti.App.Properties.getString('user_id', null);
	if (existing_user_id === null || existing_user_id === _object.id) {
		// Ti.API.error("Server response "+JSON.stringify(_object));
		// Ti.API.error("Setting properties "+_object.id+" obj.email "+_object.email+" obj.authentication_token "+_object.authentication_token);
		Ti.App.Properties.setString('user_id', _object.id);
		Ti.App.Properties.setString('email', _object.email);
		Ti.App.Properties.setString('authentication_token', _object.authentication_token);
		Ti.App.Properties.setString('current_status', _object.current_status);
	} else {
		// FORCE LOGOUT
		Alloy.Globals.logout();
	}
}

exports.deviceInfo = function() {
	var unique_identifier = Ti.App.Properties.getString('device_id', null);
	if (unique_identifier === null) {
		unique_identifier = Ti.Platform.id;
		Ti.App.Properties.setString('device_id',unique_identifier);
	}
	var url = Ti.App.Properties.getString('device_url', null);
	if (url === null) {
		// Reset the platform identifier
		if (OS_ANDROID) {
			url = 'Android';
		} else if (OS_IOS) {
			url = 'iPhone';
		}
		Ti.App.Properties.setString('device_url',url);
	}
	var address_book_access = Ti.App.Properties.getBool('address_book_access', false);
	var push_token = Ti.App.Properties.getString('push_token', null);
	var device = {
		unique_identifier: unique_identifier,
		url: url,
		push_token: push_token,
		address_book_access: address_book_access,
	};
	return device;
}

exports.setGroupSelected = function(_string) {
	if (_string == null) {
		Ti.App.Properties.setString('group_selected', 'all');
		return;
	}
	Ti.App.Properties.setString('group_selected', _string);
}

exports.logout = function() {
	Ti.App.Properties.setString('email', null);
	Ti.App.Properties.setString('user_id', null);
	Ti.App.Properties.setString('authentication_token', null);
	Ti.App.Properties.setString('device_id', null);
	Ti.App.Properties.setString('current_status', null);
	Ti.App.Properties.setBool('push_notification', false);
	Ti.App.Properties.setString('push_token', null);
	Ti.App.Properties.setBool('address_book_access', false);
	Ti.App.Properties.setBool('sync_google', false);
	Ti.App.Properties.setBool('sync_facebook', false);
	Ti.App.Properties.setString('group_selected', null);
	Ti.App.Properties.setInt('menu_index', 999);
	Ti.App.Properties.setList('uploaded_emails', null);
	Ti.App.Properties.setBool('refresh_required', false);
	Ti.App.Properties.setBool('offline_flag', false);
}