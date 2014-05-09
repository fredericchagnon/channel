var network = require('network');
var utils = require('utils');

exports.removeFromServer = function(_state) {
	if(utils.defined(_state.id)) {
		var params = {
			data: {
				user: {
					contact_handle: {
						id: _state.id,
					}
				}
			},
			method: 'POST',
			url: '/api/v2/contact_handles/destroy.json',
			onsuccess: function(e) {
				utils.call_callback(_state.onsuccess, {
					event: e
				});
			},
			onerror: function(e) {
				utils.call_callback(_state.onerror, {
					event: e
				});
			},
		}
		network.server_call(params);
	} else {
		utils.call_callback(_state.onerror);
	}
}

exports.saveToServer = function(_state) {
	if(utils.defined(_state.contact_handle.id)) {
		var params = {
			data: {
				user: {
					contact_handle: _state.contact_handle,
					// contact_handle: {protocols: _state.contact_handle.protocols}
				}
			},
			method: 'POST',
			url: '/api/v2/contact_handles/update.json',
			onsuccess: function(e) {
				utils.call_callback(_state.onsuccess, {
					event: e
				});
			},
			onerror: function(e) {
				utils.call_callback(_state.onerror, {
					event: e
				});
			},
		}
		network.server_call(params);
	} else {
		utils.call_callback(state.onerror);
	}
}

exports.createOnServer = function(_state) {
	var params = {
		data: {
			user: {
				contact_handle: _state.contact_handle
			}
		},
		method: 'POST',
		url: '/api/v2/contact_handles/create.json',
		onsuccess: function(e) {
			utils.call_callback(_state.onsuccess, {
				event: e
			});
		},
		onerror: function(e) {
			utils.call_callback(state.onerror, {
				event: e
			});
		},
	}
	network.server_call(params);
}

exports.importToServer = function(_state) {
	var params = {
		data: {
			user: {
				contact_handles: _state.contact_handles
			}
		},
		method: 'POST',
		url: '/api/v2/contact_handles/import.json',
		onsuccess: function(e) {
			utils.call_callback(_state.onsuccess, {
				event: e
			});
		},
		onerror: function(e) {
			utils.call_callback(_state.onerror, {
				event: e
			});
		},
	}
	network.server_call(params);
}
//----
// Contact Handle static methods
//----
exports.listHandleKinds = function() {
	var kinds = {};
	// kinds['iphone'] = {
	// 	handle_kind : 'iphone',
	// 	handle_name : L('iphone'),
	// 	handle_image : 'images/icons/handles/iphone.png',
	// 	action_image : 'images/icons/actions/call.png',
	// };
	// kinds['android'] = {
	// 	handle_kind : 'android',
	// 	handle_name : L('android'),
	// 	handle_image : 'images/icons/handles/android.png',
	// 	action_image : 'images/icons/actions/call.png',
	// };
	// kinds['blackberry'] = {
	// 	handle_kind : 'blackberry',
	// 	handle_name : L('blackberry'),
	// 	handle_image : 'images/icons/handles/blackberry.png',
	// 	action_image : 'images/icons/actions/call.png',
	// };
	// kinds['windows'] = {
	// 	handle_kind : 'windows',
	// 	handle_name : L('windows'),
	// 	handle_image : 'images/icons/handles/windows.png',
	// 	action_image : 'images/icons/actions/call.png',
	// };
	kinds['mobile'] = {
		handle_kind : 'mobile',
		handle_name : L('mobile'),
		handle_image : 'images/icons/handles/mobile.png',
		action_image : 'images/icons/actions/call.png',
	};
	kinds['phone'] = {
		handle_kind : 'phone',
		handle_name : L('telephone'),
		handle_image : 'images/icons/handles/phone.png',
		action_image : 'images/icons/actions/call.png',
	};
	kinds['email'] = {
		handle_kind : 'email',
		handle_name : L('email'),
		handle_image : 'images/icons/handles/email.png',
		action_image : 'images/icons/actions/email.png',
	};
	kinds['skype'] = {
		handle_kind : 'skype',
		handle_name : L('skype'),
		handle_image : 'images/icons/handles/skype.png',
		action_image : 'images/icons/actions/skype.png',
	};
	// kinds['sms'] = {
	// 	handle_kind : 'sms',
	// 	handle_name : 'SMS Only',
	// 	handle_image : 'images/icons/contact_handles/sms.png',
	// 	action_image : 'images/icons/actions/sms.png',
	// };
	// kinds['skype_chat'] = {
	// 	handle_kind : 'skype_chat',
	// 	handle_name : LC('skype'),
	// 	handle_image : 'images/icons/contact_handles/skype.png',
	// 	action_image : 'images/icons/actions/chat.png',
	// };
	// kinds['skype_talk'] = {
	// 	handle_kind : 'skype_talk',
	// 	handle_name : 'Skype Talk',
	// 	handle_image : 'images/icons/contact_handles/skype.png',
	// 	action_image : 'images/icons/actions/call.png',
	// };
	// kinds['fax'] = {
	// 	handle_kind : 'fax',
	// 	handle_name : LC('fax'),
	// 	handle_image : 'images/icons/contact_handles/fax.png',
	// 	action_image : 'images/icons/actions/fax.png',
	// };
	// kinds['pager'] = {
	// 	handle_kind : 'pager',
	// 	handle_name : LC('pager'),
	// 	handle_image : 'images/icons/contact_handles/pager.png',
	// 	action_image : 'images/icons/actions/page.png',
	// };
	// kinds['irc'] = {
	// 	handle_kind : 'irc',
	// 	handle_name : LC('irc'),
	// 	handle_image : 'images/icons/contact_handles/irc.png',
	// 	action_image : 'images/icons/actions/chat.png',
	// };
	// kinds['gtalk'] = {
	// 	handle_kind : 'gtalk',
	// 	handle_name : LC('gtalk'),
	// 	handle_image : 'images/icons/contact_handles/gtalk.png',
	// 	action_image : 'images/icons/actions/chat.png',
	// };
	// kinds['yahoo'] = {
	// 	handle_kind : 'yahoo',
	// 	handle_name : LC('yahoo'),
	// 	handle_image : 'images/icons/contact_handles/yahoo.png',
	// 	action_image : 'images/icons/actions/chat.png',
	// };
	// kinds['msn'] = {
	// 	handle_kind : 'msn',
	// 	handle_name : LC('msn'),
	// 	handle_image : 'images/icons/contact_handles/msn.png',
	// 	action_image : 'images/icons/actions/chat.png',
	// };
	// kinds['aim'] = {
	// 	handle_kind : 'aim',
	// 	handle_name : LC('aim'),
	// 	handle_image : 'images/icons/contact_handles/aim.png',
	// 	action_image : 'images/icons/actions/chat.png',
	// };
	// kinds['viber'] = {
	// 	handle_kind : 'viber',
	// 	handle_name : LC('viber'),
	// 	handle_image : 'images/icons/contact_handles/viber.png',
	// 	action_image : 'images/icons/actions/viber.png',
	// };
	// kinds['tango'] = {
	// 	handle_kind : 'tango',
	// 	handle_name : LC('tango'),
	// 	handle_image : 'images/icons/contact_handles/tango.png',
	// 	action_image : 'images/icons/actions/tango.png',
	// };
	// kinds['imessage'] = {
	// 	handle_kind : 'imessage',
	// 	handle_name : LC('imessage'),
	// 	handle_image : 'images/icons/contact_handles/imessage.png',
	// 	action_image : 'images/icons/actions/chat.png',
	// };
	// kinds['facetime'] = {
	// 	handle_kind : 'facetime',
	// 	handle_name : LC('facetime'),
	// 	handle_image : 'images/icons/contact_handles/facetime.png',
	// 	action_image : 'images/icons/actions/facetime.png',
	// };
	// kinds['bbm'] = {
	// 	handle_kind : 'bbm',
	// 	handle_name : LC('bbm'),
	// 	handle_image : 'images/icons/contact_handles/blackberry.png',
	// 	action_image : 'images/icons/actions/bbm.png',
	// };
	kinds['post'] = {
		handle_kind : 'post',
		handle_name : L('post'),
		handle_image : 'images/icons/handles/post.png',
		action_image : 'images/icons/actions/post.png',
	};
	// kinds['twitter'] = {
	// 	handle_kind : 'twitter',
	// 	handle_name : LC('twitter'),
	// 	handle_image : 'images/icons/contact_handles/twitter.png',
	// 	action_image : 'images/icons/actions/twitter.png',
	// };
	// kinds['facebook'] = {
	// 	handle_kind : 'facebook',
	// 	handle_name : LC('facebok'),
	// 	handle_image : 'images/icons/contact_handles/facebook.png',
	// 	action_image : 'images/icons/actions/facebook.png',
	// };
	// kinds['website'] = {
	// 	handle_kind : 'website',
	// 	handle_name : 'Website',
	// 	handle_image : 'images/icons/contact_handles/url.png',
	// 	action_image : 'images/icons/actions/url.png',
	// };
	return kinds;
}

exports.listPhoneKinds = function() {
	var kinds = {};
	kinds['iphone'] = {
		handle_kind : 'iphone',
		handle_name : L('iphone'),
		handle_image : 'images/icons/handles/iphone.png',
		action_image : 'images/icons/actions/call.png',
	};
	kinds['android'] = {
		handle_kind : 'android',
		handle_name : L('android'),
		handle_image : 'images/icons/handles/android.png',
		action_image : 'images/icons/actions/call.png',
	};
	kinds['blackberry'] = {
		handle_kind : 'blackberry',
		handle_name : L('blackberry'),
		handle_image : 'images/icons/handles/blackberry.png',
		action_image : 'images/icons/actions/call.png',
	};
	kinds['windows'] = {
		handle_kind : 'windows',
		handle_name : L('windows'),
		handle_image : 'images/icons/handles/windows.png',
		action_image : 'images/icons/actions/call.png',
	};
	kinds['mobile'] = {
		handle_kind : 'mobile',
		handle_name : L('mobile'),
		handle_image : 'images/icons/handles/mobile.png',
		action_image : 'images/icons/actions/call.png',
	};
	kinds['phone'] = {
		handle_kind : 'phone',
		handle_name : L('telephone'),
		handle_image : 'images/icons/handles/phone.png',
		action_image : 'images/icons/actions/call.png',
	};
	// kinds['fax'] = {
	// 	handle_kind : 'fax',
	// 	handle_name : LC('fax'),
	// 	handle_image : 'images/icons/contact_handles/fax.png',
	// 	action_image : 'images/icons/actions/fax.png',
	// };
	// kinds['pager'] = {
	// 	handle_kind : 'pager',
	// 	handle_name : LC('pager'),
	// 	handle_image : 'images/icons/contact_handles/pager.png',
	// 	action_image : 'images/icons/actions/page.png',
	// };
	return kinds;
}

function enhanceProtocol(_protocol) {
	var map = {
		'sms' : 'SMS',
		'tel' : 'Voice',
		'mail' : 'Email',
		'skype' : 'Skype',
		'post' : 'Mail',
		'skype_chat': 'Skype Chat',
		'skype_call': 'Skype Call',
	}
	for (var i in _protocol) {
		var p = _protocol[i];
		p.long_name = map[p.type || p.url];
	}
	return _protocol;
}

exports.createProtocolByType = function(_type) {
	if (_type === 'email') {
		return enhanceProtocol([{
			type: 'mail',
			active: true
		}]);
	} else if (_type === 'iphone' || _type === 'android' || _type === 'blackberry' || _type === 'windows' || _type === 'mobile') {
		return enhanceProtocol([{
			type: 'tel',
			active: true
		}, {
			type: 'sms',
			active: true
		}]);
	} else if (_type === 'phone') {
		return enhanceProtocol([{
			type: 'tel',
			active: true
		}]);
	} else if (_type === 'skype') {
		return enhanceProtocol([{
			type: 'skype_call',
			active: true
		},{
			type: 'skype_chat',
			active: true
		},]);
	} else if (_type === 'post') {
		return enhanceProtocol([{
			type: 'post',
			active: true
		}]);
	}
}