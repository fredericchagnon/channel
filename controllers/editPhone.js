var handles = require('handles');
var countries = require('countries');
var utils = require('utils');
var contact_handles = Alloy.Collections.contact_handles;
contact_handles.fetch();
var args = arguments[0] || {};
var url = args['url'];
if (url === null) {
	url = 'phone';
}
var windowTitle = L(url);
var thisContactHandle;

var country_name = 'Unknown'
var country_code = null;
var country_prefix = '';

var ret = countries.listCodes();
var country_list = ret[0];
var prefix_map = ret[1];

if (OS_ANDROID) {
	$.editPhoneWindow.addEventListener('open', function(e) {
	    var activity = $.editPhoneWindow.getActivity();
	    activity.actionBar.title = windowTitle;
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeEditPhoneWindow();
	    };
	});
} else if (OS_IOS) {
	$.navBarTitle.setText(windowTitle);
	// remove the status bar from the screen of devices that are running iOS 6
	if (Alloy.Globals.iosVersion < 7) {
		$.editPhoneWindow.top = '-20dp';
	}
}

$.editPhoneWindow.addEventListener('close', function() {
	handles = null;
	countries = null;
	country_name = null;
	country_code = null;
	country_prefix = null;
	url = null;
	ret = null;
	country_list = null;
	prefix_map = null;
	utils = null;
	contact_handles = null;
	thisContactHandle = null;
    args = null;
	windowTitle = null;
    $.destroy();
});

if (args['contactHandle'] != null) {
	thisContactHandle = contact_handles.get(args['contactHandle']['id']);
	$.phoneNameValue.setValue(thisContactHandle.get('name'));
	$.phoneValueValue.setValue(thisContactHandle.get('value'));
	$.deletePhoneButton.setVisible(true);
	country_prefix = thisContactHandle.get('country_code');
	country_code = thisContactHandle.get('country_name');
	country_name = country_list[country_code]['name'];
} else {
	// set default country to US
	country_code = 'US';
	country_prefix = '+1';
	country_name = country_list[country_code]['name'];
}
$.phoneCountryCodeValue.setValue(country_name+" ("+country_prefix+")");

function selectCountryCode() {
	var countryCodeSelectorController = Alloy.createController('countryCodeSelector', {
		title: L('select_country_code'),
		callback: function(_e) {
			// var selectCountry = _e.section.items[_e.itemIndex];
			var selectCountry = _e.row;
			country_name = selectCountry.name;
			country_code = selectCountry.code;
			country_prefix = selectCountry.prefix;
			$.phoneCountryCodeValue.setValue(country_name+" ("+country_prefix+")");
		},
	});
	countryCodeSelectorController.populateCountryCodeListView(country_list);
	var win = countryCodeSelectorController.getView();
	win.open(Alloy.CFG.slideWindow);
};

function focusValue() {
	$.phoneValueValue.focus();
}

function closeEditPhoneWindow() {
	$.editPhoneWindow.close();
}

function savePhone() {
	var nameField = $.phoneNameValue.getValue();
	var valueField = $.phoneValueValue.getValue();
	if (nameField.length === 0 || valueField.length === 0) {
		alert(L('error_form_fill'));
	} else {
		var contact_handle = {};
		contact_handle['name'] = nameField;
		contact_handle['value'] = valueField;
		// contact_handle['value'] = sanitizePhoneValue(valueField);
		contact_handle['url'] = url;
		contact_handle['country_name'] = country_code;
		contact_handle['country_code'] = country_prefix;
		var onsuccess = function() {
			// Ti.API.error("Save handle was a SUCCESS!!");
			// contact_handles.fetch();
			closeEditPhoneWindow();
		};
		var onerror = function() {};
		if (utils.defined(thisContactHandle)) {
			contact_handle['id'] = thisContactHandle.get('id');
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

function deletePhone() {
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
			closeEditPhoneWindow();
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