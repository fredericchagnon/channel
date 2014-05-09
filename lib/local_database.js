var Alloy = require('alloy');
var preferences = require('preferences');
var utils = require('utils');

exports.updateUser = function(_obj) {
	preferences.saveUser(_obj);
	var personas = _obj.personas;
	_.each(personas, function(p) {
		p['user_id'] = _obj['id'];
		if (p.hasOwnProperty('avatar')) {
			if (p.avatar.hasOwnProperty('id')) {
				p['avatar_id'] = p['avatar']['id'];
			}
		}
	});
	savePersonas(personas);
	saveContactHandles(_obj.contact_handles);
	saveStatuses(_obj.statuses);
}

exports.saveContacts = function(_obj) {
	var contacts = Alloy.Collections.contacts;
	contacts.deleteAll();
	contacts.fetch();
	_.each(_obj, function(_c) {
		if (_c.hasOwnProperty('home_me') && _c['home_me'].hasOwnProperty('persona_id')) {
			var newContact = Alloy.createModel('contacts', {
				id: _c.connection_id, 
				user_id: _c.user_id, 
				persona_id: _c.home_me.persona_id, 
				first_name: _c.home_me.first_name,
				last_name: _c.home_me.last_name,
				fullname: _c.fullName
			});
			contacts.add(newContact);
			newContact.save();
		} else {
			var newContact = Alloy.createModel('contacts', {
				id: _c.connection_id, 
				user_id: _c.user_id, 
				persona_id: _c.work_me.persona_id, 
				first_name: _c.work_me.first_name,
				last_name: _c.work_me.last_name,
				fullname: _c.fullName
			});
			contacts.add(newContact);
			newContact.save();
		}
	})
}

exports.saveConnections = function(_obj) {
	var connections = Alloy.Collections.connections;
	connections.deleteAll();
	connections.fetch();
	if (_obj.hasOwnProperty('incoming_requests') && _obj['incoming_requests'].length > 0) {
		var incoming_requests = _obj['incoming_requests'];
		_.each(incoming_requests, function(_conn) {
			_conn['type'] = 'incoming_requests';
			// Ti.API.error('_conn '+JSON.stringify(_conn));
			var newConn = Alloy.createModel('connections', _conn);
			connections.add(newConn);
			newConn.save();
		});
	}
	// if (_obj.hasOwnProperty('outgoing_requests') && _obj['outgoing_requests'].length > 0) {
	// 	var outgoing_requests = _obj['outgoing_requests'];
	// 	_.each(outgoing_requests, function(_conn) {
	// 		_conn['type'] = 'outgoing_requests';
	// 		// Ti.API.error('_conn '+JSON.stringify(_conn));
	// 		var newConn = Alloy.createModel('connections', _conn);
	// 		connections.add(newConn);
	// 		newConn.save();
	// 	});
	// }
	if (_obj.hasOwnProperty('incoming_from_suggests') && _obj['incoming_from_suggests'].length > 0) {
		var incoming_from_suggests = _obj['incoming_from_suggests'];
		_.each(incoming_from_suggests, function(_conn) {
			_conn['type'] = 'incoming_suggests';
			// Ti.API.error('_conn '+JSON.stringify(_conn));
			var newConn = Alloy.createModel('connections', _conn);
			connections.add(newConn);
			newConn.save();
		});
	}
	if (_obj.hasOwnProperty('incoming_to_suggests') && _obj['incoming_to_suggests'].length > 0) {
		var incoming_to_suggests = _obj['incoming_to_suggests'];
		_.each(incoming_to_suggests, function(_conn) {
			_conn['type'] = 'incoming_suggests';
			// Ti.API.error('_conn '+JSON.stringify(_conn));
			var newConn = Alloy.createModel('connections', _conn);
			connections.add(newConn);
			newConn.save();
		});
	}
	// if (_obj.hasOwnProperty('outgoing_suggests') && _obj['outgoing_suggests'].length > 0) {
	// 	var outgoing_suggests = _obj['outgoing_suggests'];
	// 	_.each(outgoing_suggests, function(_conn) {
	// 		_conn['type'] = 'outgoing_suggests';
	// 		// Ti.API.error('_conn '+JSON.stringify(_conn));
	// 		var newConn = Alloy.createModel('connections', _conn);
	// 		connections.add(newConn);
	// 		newConn.save();
	// 	});
	// }
}

function savePersonas(_obj) {
	var personas = Alloy.Collections.personas;
	personas.deleteAll();
	personas.fetch();
	// Ti.API.error("Existing Personas "+JSON.stringify(personas));
	_.each(_obj, function(_pers) {
		// var personaToBeUpdated = personas.get(_pers['id']);
		// // var personaToBeUpdated = personas.where({id:pers['id']})[0];
		// if (utils.defined(personaToBeUpdated)) {
		// 	// Ti.API.error("Updating persona "+pers['id']);
		// 	personaToBeUpdated.save(_pers);
		// } else {
		// 	// Ti.API.error("Creating new persona "+pers['id']);
		// 	var newPersona = Alloy.createModel('personas', _pers);
		// 	personas.add(newPersona);
		// 	newPersona.save();
		// }
		var newPersona = Alloy.createModel('personas', _pers);
		personas.add(newPersona);
		newPersona.save();
	});
}

function saveContactHandles(_obj) {
	var contactHandles = Alloy.Collections.contact_handles;
	contactHandles.deleteAll();
	contactHandles.fetch();
	// delete all the protocols since we aren't able to update one at a time
	// we're deleting them here because we create them for each contact handle
	// so if you deleted them all at time of creation, you would delete protocols
	// from contact_handle_1 when creating those for contact_handle_2
	var protocols = Alloy.Collections.protocols;
	protocols.deleteAll();
	protocols.fetch();

	// Ti.API.error("Existing Contact Handles "+JSON.stringify(contactHandles));
	_.each(_obj, function(_ch) {
		// var contactHandleToBeUpdated = contactHandles.get(_ch['id']);
		// if (utils.defined(contactHandleToBeUpdated)) {
		// 	// Ti.API.error("Going to update "+JSON.stringify(contactHandleToBeUpdated));
		// 	// Ti.API.error("Updating contactHandles "+ch['id']+" with "+JSON.stringify(ch));
		// 	contactHandleToBeUpdated.save(_ch);
		// 	// var ret = contactHandleToBeUpdated.set(ch);
		// 	// contactHandleToBeUpdated.save();
		// 	// Ti.API.error("Saved contactHandles "+JSON.stringify(ret));
		// } else {
		// 	// Ti.API.error("Creating new contactHandles "+JSON.stringify(ch));
		// 	var newContactHandle = Alloy.createModel('contact_handles', _ch);
		// 	contactHandles.add(newContactHandle);
		// 	newContactHandle.save();
		// }
		var newContactHandle = Alloy.createModel('contact_handles', _ch);
		contactHandles.add(newContactHandle);
		newContactHandle.save();
		var thisContactHandlesProtocols = _ch.protocols;
		_.each(thisContactHandlesProtocols, function(_p) {
			_p['contact_handle_id'] = _ch['id'];
		});
		// Ti.API.error("Saving Protocols with "+JSON.stringify(thisContactHandlesProtocols));
		saveProtocols(thisContactHandlesProtocols);
	});
	contactHandles.fetch();
	// Ti.API.error("Newly Updated Contact Handles "+JSON.stringify(contactHandles));
}

function saveProtocols(_obj) {
	var protocols = Alloy.Collections.protocols;
	protocols.fetch();
	// Ti.API.error("Existing Protocols "+JSON.stringify(protocols));
	_.each(_obj, function(_p) {
		// var protocolToBeUpdated = protocols.get(_p['id']);
		// // var protocolToBeUpdated = protocols.where({id:p['id']})[0];
		// if (utils.defined(protocolToBeUpdated)) {
		// 	protocolToBeUpdated.save(_p);
		// } else {
		// 	var newProtocol = Alloy.createModel('protocols', _p);
		// 	protocols.add(newProtocol);
		// 	newProtocol.save();
		// }
		var newProtocol = Alloy.createModel('protocols', _p);
		protocols.add(newProtocol);
		newProtocol.save();
	});
}

function saveStatuses(_obj) {
	var statuses = Alloy.Collections.statuses;
	statuses.deleteAll();
	statuses.fetch();
	// delete all the personaHandles since we aren't able to update one at a time
	// we're deleting them here because we create them for each status
	// so if you deleted them all at time of creation, you would delete personaHandles
	// from status_1 when creating those for status_2
	var personaHandles = Alloy.Collections.persona_handles;
	personaHandles.deleteAll();
	personaHandles.fetch();
	// Ti.API.error("Existing Statuses "+JSON.stringify(statuses));
	_.each(_obj, function(_stat) {
		// var statusToBeUpdated = statuses.get(_stat['id']);
		// // var statusToBeUpdated = statuses.where({id:stat['id']})[0];
		// if (utils.defined(statusToBeUpdated)) {
		// 	statusToBeUpdated.save(_stat);
		// } else {
		// 	var newStatus = Alloy.createModel('statuses', _stat);
		// 	statuses.add(newStatus);
		// 	newStatus.save();
		// }
		var newStatus = Alloy.createModel('statuses', _stat);
		statuses.add(newStatus);
		newStatus.save();
		var thisStatusesPersonaHandles = _stat.persona_handles;
		_.each(thisStatusesPersonaHandles, function(_ph) {
			_ph['status_id'] = _stat['id'];
		});
		// Ti.API.error("Saving Persona handles with "+JSON.stringify(thisStatusesPersonaHandles));
		savePersonaHandles(thisStatusesPersonaHandles);
	});
}

function savePersonaHandles(_obj) {
	var personaHandles = Alloy.Collections.persona_handles;
	personaHandles.fetch();
	// Ti.API.error("Existing Persona Handles "+JSON.stringify(personaHandles));
	_.each(_obj, function(_ph) {
		// var personaHandleToBeUpdated = personaHandles.get(_ph['id']);
		// // var personaHandleToBeUpdated = personaHandles.where({id:ph['id']})[0];
		// // Ti.API.error("personaHandleToBeUpdated "+JSON.stringify(personaHandleToBeUpdated));
		// if (utils.defined(personaHandleToBeUpdated)) {
		// 	// Ti.API.error("ph "+JSON.stringify(ph));
		// 	var resp = personaHandleToBeUpdated.save(_ph);
		// } else {
		// 	var newPersonaHandle = Alloy.createModel('persona_handles', _ph);
		// 	personaHandles.add(newPersonaHandle);
		// 	newPersonaHandle.save();
		// }
		// // Ti.API.error("resp "+JSON.stringify(resp));
		var newPersonaHandle = Alloy.createModel('persona_handles', _ph);
		personaHandles.add(newPersonaHandle);
		newPersonaHandle.save();
		// Ti.API.error("resp "+JSON.stringify(resp));
	});
}