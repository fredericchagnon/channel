var handles = require('handles');
var utils = require('utils');
var countries = require('countries');
var contact_handles = Alloy.Collections.contact_handles;
contact_handles.fetch();
var args = arguments[0] || {};
var windowTitle = L('post');
// Ti.API.error("Opened with "+JSON.stringify(args));
var thisContactHandle, handle_value, street_address, street_address2, locality, region, postal_code, country;
var ret = countries.listCodes();
var country_list = ret[0];

if (OS_ANDROID) {
	$.editHandleWindow.addEventListener('open', function(e) {
	    var activity = $.editHandleWindow.getActivity();
	    activity.actionBar.title = windowTitle;
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeEditHandleWindow();
	    };
	});
} else if (OS_IOS) {
	$.navBarTitle.setText(windowTitle);
	// remove the status bar from the screen of devices that are running iOS 6
	if (Alloy.Globals.iosVersion < 7) {
		$.editHandleWindow.top = '-20dp';
	}
}

$.editHandleWindow.addEventListener('close', function() {
	handles = null;
	utils = null;
	contact_handles = null;
	countries = null;
	thisContactHandle = null;
	handle_value = null;
	street_address = null;
	street_address2 = null;
	locality = null;
	region = null;
	postal_code = null;
	country = null;
	ret = null;
	country_list = null;
    args = null;
	windowTitle = null;
    $.destroy();
});

function unbundleValue(_value) {
	var _handle_value = {};
	var obj = JSON.parse(_value);
	Ti.API.error("obj "+JSON.stringify(obj));
	for (var i in obj) {
		if (i.indexOf('handle_') !== 0 && i !== 'protocols') {
			Ti.API.error("Setting "+i+" to "+obj[i]);
			_handle_value[i] = obj[i];
		}
	}
	Ti.API.error("_handle_value "+JSON.stringify(_handle_value))
	street_address = _handle_value['street_address'];
	street_address2 = _handle_value['street_address_2'];
	locality = _handle_value['locality'];
	region = _handle_value['region'];
	postal_code = _handle_value['postal_code'];
	if (!_handle_value.hasOwnProperty('country')) {
		_handle_value['country'] = 'United States';
	}
	if (_handle_value.country === '' || _handle_value.country === null) {
		_handle_value['country'] = 'United States';
	}
	country = _handle_value['country'];
	handle_value = JSON.stringify(_handle_value);
}

if (args['contactHandle'] != null) {
	thisContactHandle = contact_handles.get(args['contactHandle']['id']);
	unbundleValue(thisContactHandle.get('value'));
	$.handleNameValue.setValue(thisContactHandle.get('name'));
	$.handleStreet1Value.setValue(street_address);
	$.handleStreet2Value.setValue(street_address2);
	$.handleLocalityValue.setValue(locality);
	$.handleRegionValue.setValue(region);
	$.handlePostCodeValue.setValue(postal_code);
	$.handleCountryValue.setValue(country);
	$.deleteHandleButton.setVisible(true);
}

function focusStreet1() {
	$.handleStreet1Value.focus();
}

function focusStreet2() {
	$.handleStreet2Value.focus();
}

function focusLocality() {
	$.handleLocalityValue.focus();
}

function focusRegion() {
	$.handleRegionValue.focus();
}

function focusPostCode() {
	$.handlePostCodeValue.focus();
}

// function focusCountry() {
// 	$.handleCountryValue.focus();
// }

function closeEditHandleWindow() {
	$.editHandleWindow.close();
}

function selectCountry() {
	var countryCodeSelectorController = Alloy.createController('countryCodeSelector', {
		title: L('select_country'),
		callback: function(_e) {
			// var selectCountry = _e.section.items[_e.itemIndex];
			var selectCountry = _e.row;
			country = selectCountry.name;
			$.handleCountryValue.setValue(country);
		},
	});
	countryCodeSelectorController.populateCountryNameListView(country_list);
	var win = countryCodeSelectorController.getView();
	win.open(Alloy.CFG.slideWindow);
}

function saveHandle() {
	var nameField = $.handleNameValue.getValue();
	var valueField = $.handleValueValue.getValue();
	if (nameField.length === 0 || valueField.length === 0) {
		alert(L('error_form_fill'));
	} else {
		var contact_handle = {};
		contact_handle['name'] = nameField;
		contact_handle['value'] = valueField;
		contact_handle['url'] = 'handle';
		contact_handle['country_name'] = null;
		contact_handle['country_code'] = null;
		var onsuccess = function() {
			// Ti.API.error("Save handle was a SUCCESS!!");
			// contact_handles.fetch();
			closeEditHandleWindow();
		};
		var onerror = function() {};
		if (utils.defined(thisContactHandle)) {
			contact_handle['id'] = thisContactHandle.get('id');
			// contact_handle['protocols'] = handles.createProtocolByType('handle');
			handles.saveToServer({
				contact_handle: contact_handle,
				onsuccess: onsuccess,
				onerror: onerror,
			});
		} else {
			handles.createOnServer({
				contact_handle: contact_handle,
				onsuccess: onsuccess,
				onerror: onerror,
			});
		}
	}
}

function deleteHandle() {
	if (thisContactHandle.get('id')) {
		var opts = {
			destructive: 0,
			title: String.format(L('confirm_delete_handle_title'),thisContactHandle.get('name')),
		};
		if (OS_ANDROID){
			opts.buttonNames = [L('delete'), L('cancel')];
		} else {
			opts.options = [L('delete'), L('cancel')];
		}
		var onsuccess = function() {
			// contact_handles.remove(thisContactHandle);
			// thisContactHandle.destroy();
			// contact_handles.fetch();
			closeEditHandleWindow();
		};
		var onerror = function() {};
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				handles.removeFromServer({
					id: thisContactHandle.get('id'),
					onsuccess: onsuccess,
					onerror: onerror,
				});
			}
		});
		dialog.show();
	}
}