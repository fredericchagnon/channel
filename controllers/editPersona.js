var utils = require('utils');
var personas = Alloy.Collections.personas;
personas.fetch();
var windowTitle;
var args = arguments[0] || {};
var thisPersona;

if (args['persona_id'] !== null) {
	thisPersona = personas.get(args['persona_id']);
	windowTitle = String.format(L('status_edit_persona_instructions'), thisPersona.get('category'));
	$.prefixValue.setValue(utils.stringProperty(thisPersona.get('prefix')));
	$.firstNameValue.setValue(utils.stringProperty(thisPersona.get('first_name')));
	$.middleNameValue.setValue(utils.stringProperty(thisPersona.get('middle_name')));
	$.lastNameValue.setValue(utils.stringProperty(thisPersona.get('last_name')));
	$.suffixValue.setValue(utils.stringProperty(thisPersona.get('suffix')));
	$.jobTitleValue.setValue(utils.stringProperty(thisPersona.get('job_title')));
	$.departmentValue.setValue(utils.stringProperty(thisPersona.get('department')));
	$.companyValue.setValue(utils.stringProperty(thisPersona.get('company')));
}

if (OS_ANDROID) {
	$.editPersonaWindow.addEventListener('open', function(e) {
	    var activity = $.editPersonaWindow.getActivity();
	    activity.actionBar.title = windowTitle;
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeEditPersonaWindow();
	    };
	});
} else if (OS_IOS) {
	$.navBarTitle.setText(windowTitle);
	// remove the status bar from the screen of devices that are running iOS 6
	if (Alloy.Globals.iosVersion < 7) {
		$.editPersonaWindow.top = '-20dp';
	}
}

$.editPersonaWindow.addEventListener('close', function() {
	utils = null;
	personas = null;
	thisPersona = null;
    args = null;
	windowTitle = null;
    $.destroy();
});

function focusFirstName() {
	$.firstNameValue.focus();
}

function focusMiddleName() {
	$.middleNameValue.focus();
}

function focusLastName() {
	$.lastNameValue.focus();
}

function focusSuffix() {
	$.suffixValue.focus();
}

function focusJobTitle() {
	$.jobTitleValue.focus();
}

function focusDepartment() {
	$.departmentValue.focus();
}

function focusCompany() {
	$.companyValue.focus();
}

function closeEditPersonaWindow() {
	$.editPersonaWindow.close();
}

function savePersona() {
	var prefix = $.prefixValue.getValue();
	var firstName = $.firstNameValue.getValue();
	var middleName = $.middleNameValue.getValue();
	var lastName = $.lastNameValue.getValue();
	var suffix = $.suffixValue.getValue();
	var jobTitle = $.jobTitleValue.getValue();
	var department = $.departmentValue.getValue();
	var company = $.companyValue.getValue();
	if (firstName.length === 0 || lastName.length === 0) {
		alert(L('error_form_fill'));
	} else {
		var personaToBeSaved = {};
		personaToBeSaved['id'] = thisPersona.get('id');
		personaToBeSaved['prefix'] = prefix;
		personaToBeSaved['first_name'] = firstName;
		personaToBeSaved['middle_name'] = middleName;
		personaToBeSaved['last_name'] = lastName;
		personaToBeSaved['suffix'] = suffix;
		personaToBeSaved['job_title'] = jobTitle;
		personaToBeSaved['department'] = department;
		personaToBeSaved['company'] = company;
		var onsuccess = function() {
			// personas.fetch();
			closeEditPersonaWindow();
		};
		var onerror = function() {
			alert(L('general_error'));
		};
		server.saveUser({
			user: {
				personas: [personaToBeSaved],
			},
			onsuccess: onsuccess,
			onerror: onerror,
		});
	}
}