var utils = require('utils');
var firstFirst = deviceSortOrder();

function deviceSortOrder() {
	var firstFirst = true;
	var person = Titanium.Contacts.getPersonByID(0);
	if (typeof (person) != 'undefined' && person != null) {
		var fullName = person.getFullName() || "";
		var firstName = person.getFirstName() || "";
		var lastName = person.getLastName() || "";

		if (fullName.indexOf(firstName) > fullName.indexOf(lastName)) {
			firstFirst = false;
		}

	}
	Ti.API.error("FIRST LAST NAME?: " + firstFirst);
	return firstFirst;
}

var contactConstructor = function contactConstructor(data) {
	var self = this;

	Object.defineProperty(self, 'img', {
		get : function() {
			return data.connection_id;
		},
		enumerated : true,
	});

	Object.defineProperty(self, 'id', {
		get : function() {
			return data.connection_id;
		},
		enumerated : true,
	});

	Object.defineProperty(self, 'fullName', {
		get : function() {
			var persona = self.personas[0];
			var full_name = firstFirst ? (persona.first_name + " " + persona.last_name) : (persona.last_name + " " + persona.first_name);
			return full_name;
		},
		enumerated : true,
	});

	Object.defineProperty(self, 'connection_id', {
		get : function() {
			return data.connection_id;
		},
		enumerated : true,
	});

	Object.defineProperty(self, 'user_id', {
		get : function() {
			return data.user_id;
		},
		enumerated : true,
	});

	Object.defineProperty(self, 'my_personas', {
		get : function() {
			return data.my_personas;
		},
		enumerated : true,

	});

	Object.defineProperty(self, 'home_me', {
		get : function() {
			return data.home_me;
		},
		enumerated : true,
	});

	Object.defineProperty(self, 'work_me', {
		get : function() {
			return data.work_me;
		},
		enumerated : true,
	});

	Object.defineProperty(self, 'personas', {
		get : function() {
			var ret = [];
			if (utils.defined(data.home_me) && utils.defined(data.home_me.first_name)) {
				data.home_me.public_name = 'Home';
				data.home_me.persona_id = data.home_me.id;
				ret.push(data.home_me);
			}
			if (utils.defined(data.work_me) && utils.defined(data.work_me.first_name)) {
				data.work_me.public_name = 'Work';
				data.work_me.persona_id = data.work_me.id;
				ret.push(data.work_me);
			}
			return ret;
		},
		enumerated : true,
	});
}

exports.reformServerResponse = function(_obj) {
	var ret = [];
	for (var i in _obj) {
		var wrapper = new contactConstructor(_obj[i]);
		var x = _.clone(_obj[i]);
		x.id = x.connection_id;
		x.fullName = wrapper.fullName;
		x.img = null;
		// if (x && x.home_me && x.home_me.avatar && x.home_me.avatar.id) {
		// 	x.image = model.avatars.get({
		// 		connection_id: x.connection_id,
		// 		user_id: x.home_me.avatar.user_id,
		// 		persona_id: x.home_me.avatar.persona_id,
		// 		avatar: x.home_me.avatar,
		// 	});
		// } else if (x && x.work_me && x.work_me.avatar && x.work_me.avatar.id) {
		// 	x.image = model.avatars.get({
		// 		connection_id : x.connection_id,
		// 		user_id : x.work_me.avatar.user_id,
		// 		persona_id : x.work_me.avatar.persona_id,
		// 		avatar : x.work_me.avatar,
		// 	});
		// }
		ret.push(x);
	}
	return ret;
}
