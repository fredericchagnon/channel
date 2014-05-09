var handles = require('handles');
var utils = require('utils');
var contact_handles = Alloy.Collections.contact_handles;
contact_handles.fetch();
var args = arguments[0] || {};
var windowTitle = L('email');
Ti.API.error("Opened with "+JSON.stringify(args));
var thisContactHandle;

if (args['contactHandle'] != null) {
	thisContactHandle = contact_handles.get(args['contactHandle']['id']);
	Ti.API.error("Fetched "+JSON.stringify(thisContactHandle));
	$.emailNameValue.setValue(thisContactHandle.get('name'));
	$.emailValueValue.setValue(thisContactHandle.get('value'));
	$.deleteEmailButton.setVisible(true);
}

if (OS_ANDROID) {
	$.editEmailWindow.addEventListener('open', function(e) {
	    var activity = $.editEmailWindow.getActivity();
	    activity.actionBar.title = windowTitle;
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeEditEmailWindow();
	    };
	});
} else if (OS_IOS) {
	$.navBarTitle.setText(windowTitle);
	// remove the status bar from the screen of devices that are running iOS 6
	if (Alloy.Globals.iosVersion < 7) {
		$.editEmailWindow.top = '-20dp';
	}
}

$.editEmailWindow.addEventListener('close', function() {
	handles = null;
	utils = null;
	contact_handles = null;
	thisContactHandle = null;
    args = null;
	windowTitle = null;
    $.destroy();
});

function focusValue() {
	$.emailValueValue.focus();
}

function closeEditEmailWindow() {
	$.editEmailWindow.close();
}

function saveEmail() {
	var nameField = $.emailNameValue.getValue();
	var valueField = $.emailValueValue.getValue();
	if (nameField.length === 0 || valueField.length === 0) {
		alert(L('error_form_fill'));
	} else {
		var contact_handle = {};
		contact_handle['name'] = nameField;
		contact_handle['value'] = valueField;
		contact_handle['url'] = 'email';
		contact_handle['country_name'] = null;
		contact_handle['country_code'] = null;
		var onsuccess = function() {
			// Ti.API.error("Save handle was a SUCCESS!!");
			// contact_handles.fetch();
			closeEditEmailWindow();
		};
		var onerror = function() {};
		if (utils.defined(thisContactHandle)) {
			contact_handle['id'] = thisContactHandle.get('id');
			// contact_handle['protocols'] = handles.createProtocolByType('email');
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

function deleteEmail() {
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
			closeEditEmailWindow();
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