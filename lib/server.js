var network = require('network');
var local_database = require('local_database');
var utils = require('utils');
var preferences = require('preferences');
var contacts = require('contacts');

function serverCall(_state) {
	var params = {
		data: _state.data,
		url: _state.url,
		method: 'POST',
		onsuccess: function(_e) {
			utils.call_callback(_state.onsuccess, _e);
		},
		onerror: function(_e) {
			utils.call_callback(_state.onerror, _e);
		},
	};
	network.server_call(params);
}

exports.saveUser = function(_state) {
	_state.data = {user: _state.user};
	_state.url = '/api/v2/users/update.json';
	serverCall(_state);
}

exports.saveAvailbility = function(_state) {
	var successCallback = _state.onsuccess;
	_state.data = {
		user: {
			status: {
				id: _state.status_id,
				persona_handles: _state.persona_handles,
			}
		}
	};
	_state.url = '/api/v2/statuses/update.json';
	_state.onsuccess = function(_response) {
		Alloy.Globals.fullAppRefresh();
		utils.call_callback(successCallback, {
			event: _response
		});
	};
	serverCall(_state);
}

exports.getUser = function(_state) {
	var successCallback = _state.onsuccess;
	_state.data = {};
	_state.url = '/api/v2/users/show.json';
	_state.onsuccess = function(_response) {
		utils.call_callback(successCallback, {
			event: _response
		});
	};
	serverCall(_state);
}

exports.saveAvatar = function(_state) {
	var url = '/api/v2/avatars/create.json'
	var blob = _state.blob;
	if (blob.exists()) {
		var contents = blob.read();
		var client = Ti.Network.createHTTPClient({
			onload: function(e) {
				utils.call_callback(_state.onsuccess);
			},
			onerror: function(e) {
				utils.call_callback(_state.onerror);
			},
			timeout: 30000,

		});
		client.open("POST", preferences.getServerPrefix() + url);
		client.send({
			user: {
				id: preferences.getUserId(),
				authentication_token: preferences.getAuthenticationToken(),
				device: {
					unique_identifier: preferences.getDeviceId()
				}
			},
			user_id: preferences.getUserId(),
			authentication_token: preferences.getAuthenticationToken(),
			device_id: preferences.getDeviceId(),
			persona_id: _state.persona_id,
			file: contents
		});
	}
}

exports.listContacts = function(_state) {
	var successCallback = _state.onsuccess;
	_state.data = {};
	_state.url = '/api/v2/connections/index.json';
	_state.onsuccess = function(_response) {
		var data = contacts.reformServerResponse(_response.responseObject);
		local_database.saveContacts(data);
		utils.call_callback(successCallback, data);
	};
	serverCall(_state);
}

exports.listConnections = function(_state) {
	var successCallback = _state.onsuccess;
	_state.data = {};
	_state.url = '/api/v2/notifications/index.json';
	_state.onsuccess = function(_response) {
		local_database.saveConnections(_response.responseObject);
		utils.call_callback(successCallback, {
			event: _response
		});
	};
	serverCall(_state);
}

exports.acceptRequest = function(_state) {
	_state.data = {
		request: {
			id: _state.id,
			persona_ids: _state.persona_ids,
		}
	};
	_state.url = '/api/v2/requests/update.json';
	serverCall(_state);
}

exports.rejectRequest = function(_state) {
	_state.data = {
		request: {
			id: _state.id,
		}
	};
	_state.url = '/api/v2/requests/destroy.json';
	serverCall(_state);
}

exports.acceptSuggest = function(_state) {
	_state.data = {
		suggest: {
			id: _state.id,
			persona_ids: _state.persona_ids,
		}
	};
	_state.url = '/api/v2/suggests/update.json';
	serverCall(_state);
}

exports.rejectSuggest = function(_state) {
	_state.data = {
		suggest: {
			id: _state.id,
		}
	};
	_state.url = '/api/v2/suggests/destroy.json';
	serverCall(_state);
}

exports.inPersonConnect = function(_state) {
	_state.data = {
		temporary_connection: {
			personas: _state.personas,
			token: _state.token
		},
	};
	_state.url = '/api/v2/temporary_connections/create.json';
	serverCall(_state);
}

exports.contactSearch = function(_state) {
	_state.data = {
		search_string: _state.searchString
	};
	_state.url = '/api/v2/users/index.json';
	serverCall(_state);
}
 
exports.queueInvitation = function(_state) {
	_state.data = {
		connection_queue : {
			email: _state.email
		}
	};
	_state.url = '/api/v2/connection_queues/create.json';
	serverCall(_state);
}

exports.requestConnection = function(_state) {
	_state.data = {
		request: {
			user_id: _state.user_id,
			persona_ids: _state.persona_ids,
		}
	};
	_state.url = '/api/v2/requests/create.json';
	serverCall(_state);
}

exports.disconnectContact = function(_state) {
	_state.data = {
		connection: {
			id: _state.connection_id,
		}
	};
	_state.url = '/api/v2/connections/destroy.json';
	_state.onsuccess = function() {
		alert(String.format(L('status_confirm_disconnect'), _state.fullname));
		Alloy.Globals.fullAppRefresh();
	};
	serverCall(_state);
}

exports.groupContact = function(_state) {
	_state.data = {
		connection: {
			id: _state.connection_id,
			persona_ids: _state.persona_ids,
		}
	};
	_state.url = '/api/v2/connections/update.json';
	_state.onsuccess = Alloy.Globals.fullAppRefresh;
	serverCall(_state);
}

exports.suggestConnection = function(_state) {
	_state.data = {
		suggest:{
			from_id: _state.from_id,
			to_id: _state.to_id,
		}
	};
	_state.url = '/api/v2/suggests/create.json';
	// _state.onsuccess = function(_e) {};
	serverCall(_state);
}

exports.requestCMB = function(_state) {
	_state.data = {
		contact_me_back: {
			user_id: _state.id
		}
	};
	_state.url = '/api/v2/contact_me_backs/create.json';
	_state.onsuccess = Alloy.Globals.fullAppRefresh;
	serverCall(_state);
}

exports.deleteCMB = function(_state) {
	_state.data = {
		contact_me_back: {
			id: _state.id
		}
	};
	_state.url = '/api/v2/contact_me_backs/destroy.json';
	_state.onsuccess = Alloy.Globals.fullAppRefresh;
	serverCall(_state);
}

exports.setFavorite = function(_state) {
	_state.data = {
		favorite: {
			connection_id: _state.connection_id
		}
	};
	_state.url = '/api/v2/favorites/create.json';
	_state.onsuccess = Alloy.Globals.fullAppRefresh;
	serverCall(_state);
}

exports.unsetFavorite = function(_state) {
	_state.data = {
		favorite: {
			connection_id: _state.connection_id
		}
	};
	_state.url = '/api/v2/favorites/destroy.json';
	_state.onsuccess = Alloy.Globals.fullAppRefresh;
	serverCall(_state);
}

exports.listFavorites = function(_state) {
	_state.data = {};
	_state.url = '/api/v2/favorites/index.json';
	_state.onsuccess = Alloy.Globals.fullAppRefresh;
	serverCall(_state);
}