var handles = require('handles');
var utils = require('utils');
var contact_handles = Alloy.Collections.contact_handles;
contact_handles.fetch();
var args = arguments[0] || {};
var windowTitle = L('skype');
Ti.API.error("Opened with "+JSON.stringify(args));
var thisContactHandle;

if (args['contactHandle'] != null) {
	thisContactHandle = contact_handles.get(args['contactHandle']['id']);
	Ti.API.error("Fetched "+JSON.stringify(thisContactHandle));
	$.skypeNameValue.setValue(thisContactHandle.get('name'));
	$.skypeValueValue.setValue(thisContactHandle.get('value'));
	$.deleteSkypeButton.setVisible(true);
} else {
	$.skypeNameValue.setValue(L('skype'));
}

if (OS_ANDROID) {
	$.editSkypeWindow.addEventListener('open', function(e) {
	    var activity = $.editSkypeWindow.getActivity();
	    activity.actionBar.title = windowTitle;
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeEditSkypeWindow();
	    };
	});
} else if (OS_IOS) {
	$.navBarTitle.setText(windowTitle);
	// remove the status bar from the screen of devices that are running iOS 6
	if (Alloy.Globals.iosVersion < 7) {
		$.editSkypeWindow.top = '-20dp';
	}
}

$.editSkypeWindow.addEventListener('close', function() {
	handles = null;
	utils = null;
	contact_handles = null;
	thisContactHandle = null;
    args = null;
	windowTitle = null;
    $.destroy();
});

function focusValue() {
	$.skypeValueValue.focus();
}

function closeEditSkypeWindow() {
	$.editSkypeWindow.close();
}

function saveSkype() {
	var nameField = $.skypeNameValue.getValue();
	var valueField = $.skypeValueValue.getValue();
	if (nameField.length === 0 || valueField.length === 0) {
		alert(L('error_form_fill'));
	} else {
		var contact_handle = {};
		contact_handle['name'] = nameField;
		contact_handle['value'] = valueField;
		contact_handle['url'] = 'skype';
		contact_handle['country_name'] = null;
		contact_handle['country_code'] = null;
		var onsuccess = function() {
			// Ti.API.error("Save handle was a SUCCESS!!");
			// contact_handles.fetch();
			closeEditSkypeWindow();
		};
		var onerror = function() {};
		if (utils.defined(thisContactHandle)) {
			contact_handle['id'] = thisContactHandle.get('id');
			// contact_handle['protocols'] = handles.createProtocolByType('skype');
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

function deleteSkype() {
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
			closeEditSkypeWindow();
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