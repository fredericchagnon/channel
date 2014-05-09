function isDefined(_obj) {
	return typeof (_obj) !== 'undefined';
}

exports.is_ios = function() {
	return Ti.Platform.osname.toLowerCase() === 'iphone' || Ti.Platform.osname.toLowerCase() === 'ipad';
}

exports.is_android = function() {
	return Ti.Platform.osname.toLowerCase() === 'android';
}

exports.call_callback = function(_fn, _data) {
	if (isDefined(_fn)) {
		if (isDefined(_data)) {
			_fn(_data);
		} else {
			_fn();
		}
	}
}

exports.jsonParse = function(_object) {
	if (typeof (_object) === 'undefined') {
		Ti.API.error("TRIED TO PARSE AN UNDEFINED OBJECT")
		return {};
	} else if (typeof (_object) === 'object') {
		Ti.API.error("TRIED TO PARSE AN OBJECT ALREADY PARSED")
		return _object;
	} else {
		Ti.API.error("PARSING AS EXPECTED")
		return JSON.parse(_object);
	}	
}

exports.isEmpty = function(_obj) {
	// null and undefined are empty
	if (_obj === null) return true;
	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (_obj.length && _obj.length > 0) return false;
	if (_obj.length === 0) return true;

	for (var key in _obj) {
		if (hasOwnProperty.call(_obj, key)) return false;
	}
	return true;
}

exports.ensure_property = function(_obj, _name) {
	if (!_obj.hasOwnProperty(_name)) {
		_obj[_name] = {};
	}
}

exports.ensure_property_array = function(_obj, _name, _array) {
	if (!_obj.hasOwnProperty(_name)) {
		_obj[_name] = [];
	}
}

exports.info = function(_obj) {
	if (typeof (_obj) === 'object') {
		Ti.API.info(JSON.stringify(_obj));
	} else {
		Ti.API.info(_obj);
	}
}

exports.error = function(_obj) {
	if (typeof (_obj) === 'object') {
		Ti.API.error(JSON.stringify(_obj));
	} else {
		Ti.API.error(_obj);
	}
}

exports.noop = function() {
	// this is noop to satisfy callbacks
};

exports.toJSON = function(_e) {
	return JSON.stringify(_e);
}

exports.defined = function(_obj) {
	return isDefined(_obj);
}

exports.num_sort = function(_array) {
	function sortNumber(a, b) {
		return a - b;
	}
	return _array.sort(sortNumber);
}

exports.toString = function(_array) {
	var undefined;
	if (!isDefined(_array)) {
		return undefined;
	}
	var obj = _array.shift();
	while (isDefined(obj)) {
		if (_array.length === 0) {
			return obj;
		} else {
			obj = obj[_array.shift()];
		}
	}
}

exports.stringProperty = function(_string) {
	if ((_string === null) || (typeof _string === 'undefined')) {
		return "";
	}
	return _string;
}

exports.format = function(_inputString, _target) {
	return _inputString.replace(/{([^\}]*)}/g, function(a, b) {
		var repl = target[b];
		return repl ? repl : "!!UNDEFINED_KEY(" + b + ")!!";
	});
}
/*
* JavaScript Pretty Date
* Copyright (c) 2011 John Resig (ejohn.org)
* Licensed under the MIT and GPL licenses.
*/
// Takes an ISO time and returns a string representing how
// long ago the date represents.
// Modified to handle our format for CMB
exports.pretty_date = function(_date) {
	var diff = (((new Date()).getTime() - _date.getTime()) / 1000);
	var day_diff = Math.floor(diff / 86400);
	// if (day_diff >= 31) {
	// 	return day_diff + L('days_ago');
	// }
	if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
		return;
	return day_diff == 0 && (diff < 60 && L('just_now') || diff < 120 && L('one_minute_ago') || diff < 3600 && Math.floor(diff / 60) + L('minutes_ago') || diff < 7200 && L('one_hour_ago') || diff < 86400 && Math.floor(diff / 3600) + L('hours_ago')) || day_diff == 1 && L('yesterday') || day_diff < 7 && day_diff + L('days_ago') || day_diff < 31 && Math.ceil(day_diff / 7) + L('weeks_ago');
}

exports.time = function() {
	return .001 * (new Date().getTime());
}

exports.toBoolean = function(_str) {
	if (_str === 'true') {
		return true;
	}
	if (_str === 'false') {
		return false;
	}
	if (_str === 0) {
		return false;
	}
	if (_str !== 0) {
		return true;
	}
	return Boolean(_str).valueOf();
}

// exports.remove_all_children = function(_view) {
// 	var children = _view.children;
// 	for (var i in children) {
// 		view.remove(children[i]);
// 	}
// }

// exports.present_persona_data = function(_state) {
// 	var data = [];
// 	var input_fields = [];
// 	var ids = _state.get_fields();
// 	var current_index = -1;
// 	for (i in ids) {
// 		current_index += 1;
// 		var row = components.grouped_row({
// 			label : ids[i],
// 		});
// 		var input = components.grouped_row_input({
// 			hint : null,
// 			value : state.me[i],
// 			keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
// 		});
// 		row.input = input;
// 		input_fields.push(input);
// 		input.field_name = i;
// 		input.current_index = current_index;
// 		row.add(input);
// 		data.push(row);
// 		input.addEventListener('change', function(e) {
// 			var value = e.source.value;
// 			if (value.length == 0) {
// 				value = null;
// 			}
// 			state.me[e.source.field_name] = value;
// 		});
// 	}
// 	// loop through to set an event listener for return for each input in array
// 	for ( j = 0; j < input_fields.length; j++) {
// 		input_fields[j].addEventListener('return', function(e) {
// 			var this_input = e.source;
// 			if ((this_input.current_index + 1) < input_fields.length) {
// 				input_fields[this_input.current_index + 1].focus();
// 			} else {
// 				this.blur();
// 			}
// 		});
// 		data[j].addEventListener('click', function(e) {
// 			e.rowData.input.focus();
// 		});
// 	}
// 	return data;
// }

// exports.get_firstlastfields = function() {
// 	return {
// 		'first_name' : L('first_name'),
// 		'last_name' : L('last_name'),
// 	};
// };

// exports.get_auxmefields = function() {
// 	return {
// 		'prefix' : L('prefix_field'),
// 		'nickname' : L('nickname'),
// 		'middle_name' : L('middle_name'),
// 		'suffix' : L('suffix'),
// 		'job_title' : L('job_title'),
// 		'department' : L('department'),
// 		'company' : L('company'),
// 	};
// };

// exports.get_allmefields = function() {
// 	return {
// 		'prefix' : L('prefix_field'),
// 		'first_name' : L('first_name'),
// 		// 'first_name_phonetic' : L('first_name_phonetic'),
// 		'middle_name' : L('middle_name'),
// 		'last_name' : L('last_name'),
// 		// 'last_name_phonetic' : L('last_name_phonetic'),
// 		'suffix' : L('suffix'),
// 		'nickname' : L('nickname'),
// 		'job_title' : L('job_title'),
// 		'department' : L('department'),
// 		'company' : L('company'),
// 	};
// };

exports.sanitize_ms_exchange_contact = function(_label) {
	var l1 = _label.replace('_$!<EX-', '');
	var l2 = l1.replace('_$!<', '');
	var l3 = l2.replace('>!$_', '');
	return l3;
}

exports.open_url = function(_e) {
	var value = _e.value;
	var protocol = _e.url;
	if (protocol === 'mail') {
		protocol = 'mailto';
	}
	var openUrl = protocol + ":" + value;
	if (protocol === 'mailto' && isDefined(value)) {
		var emailDialog = Ti.UI.createEmailDialog();
		emailDialog.subject = "";
		emailDialog.toRecipients = [value];
		emailDialog.messageBody = '';
		emailDialog.open();
	} else if (isDefined(openUrl)) {
		var url = openUrl;
		url = url.replace(/\s/, '');
		if (protocol === 'skype_chat') {
			url = 'skype:' + value + "?chat";
		} else if (protocol === 'skype_call') {
			url = 'skype:' + value + "?call";
		} else if (url.indexOf('tel:') === 0) {
			url = url.replace(/[^\+0-9]/g, '');
			if (OS_IOS) {
				url = "telprompt:" + url;
			} else {
				url = "tel:" + url;
			}
		} else if (url.indexOf('sms:') == 0) {
			url = url.replace(/[^\+0-9]/g, '');
			url = "sms:" + url;
		}
		if (OS_ANDROID && url.indexOf('post:') !== 0) {
			//TODO: URLs don't work on android!
			Ti.Platform.openURL(url);			
		} else
		if (Ti.Platform.canOpenURL(url)) {
			Ti.Platform.openURL(url);
		} else if (url.indexOf('post:') == 0) {
		} else {
			alert(L('error_cannot_open_contact_title'), String.format(L('error_cannot_open_contact_text'), url));
		}
	}
}
