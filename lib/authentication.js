var network = require('network');
var preferences = require('preferences');
var local_database = require('local_database');
var utils = require('utils');

exports.signin = function(_state) {
	var device = preferences.deviceInfo();
	var params = {
		data: {
			user: {
				email: _state.email,
				password: _state.password,
				device: device,
			},
		},
		onsuccess: function(_e) {
			local_database.updateUser(_e.responseObject);
			utils.call_callback(_state.onsuccess);
		},
		onerror: function(_e) {
			utils.call_callback(_state.onerror);
		},
		url: '/api/v2/users/sign_in.json',
	};
	network.bare_server_call(params);
}

exports.oauthenticate = function(_state) {
	var device = preferences.deviceInfo();
	var params = {
		data: {
			user: {
				email: _state.email,
				token: _state.token,
				device: device,
			},
		},
		onsuccess: function(_e) {
			local_database.updateUser(_e.responseObject);
			utils.call_callback(_state.onsuccess);
		},
		onerror: function(_e) {
			utils.call_callback(_state.onerror);
		},
		url: '/api/v2/users/sign_in_oauth.json',
	};
	network.bare_server_call(params);
}

exports.logout = function(_state) {
	if (preferences.getAuthenticationToken() === null) {
		utils.call_callback(_state.onsuccess, {event: {}});
	}
	var params = {
		data: {
			all_devices : _state.all_devices,
		},
		onsuccess: function(_e) {
			utils.call_callback(_state.onsuccess, {event: _e});
		},
		onerror: function(_e) {
			if (_e.source && _e.source.status === 401) {
				utils.call_callback(_state.onsuccess, {event: _e});
			} else {
				utils.call_callback(_state.onerror, {event: _e});
			}
		},
		url: '/api/v2/users/sign_out.json',
		retry_count: 0,
	}
	network.server_call(params);
}

exports.deactivate = function(_state) {
	var params = {
		data: {},
		method: 'POST',
		url: '/api/v2/users/destroy.json',
		onsuccess: function(_e) {
			utils.call_callback(_state.onsuccess, {
				event: _e
			});
		},
		onerror: function(_e) {
			utils.call_callback(_state.onerror, {
				event: _e
			});
		},
	}
	network.server_call(params);
}

exports.reset_password = function(_state) {
	var device = preferences.deviceInfo();
	var params = {
		data: {
			user: {
				email: _state.email,
				device: device,
			},
		},
		onsuccess: function(_e) {
			utils.call_callback(_state.onsuccess);
		},
		onerror: function(_e) {
			utils.call_callback(_state.onerror);
		},
		method: 'POST',
		url: '/api/v2/passwords/index.json',
	};
	network.bare_server_call(params);
}

exports.signup = function(_state) {
	var device = preferences.deviceInfo();
	var params = {
		data: {
			user: {
				email: _state.email,
				device: device,
				contact_handles: [],
			},
		},
		onsuccess: function(_e) {
			local_database.updateUser(_e.responseObject);
			utils.call_callback(_state.onsuccess);
		},
		onerror : function(_e) {
			utils.call_callback(_state.onerror, _e);
		},
		method: 'POST',
		url: '/api/v2/users/sign_up.json',
	};
	if (_state.first_name || _state.last_name) {
		params.data.user.persona = {
			first_name: _state.first_name,
			last_name: _state.last_name,
		};
	}
	if (_state.email) {
		params.data.user.contact_handles.push({
			name: 'Email',
			url: 'email',
			value: _state.email,

		});
	}
	if (_state.phone) {
		params.data.user.contact_handles.push({
			name: 'iPhone',
			url: 'iphone',
			value: _state.phone,
		});
	}
	network.bare_server_call(params);
}
