$.newContactHandleWindow.addEventListener('open', function(e) {
	if (OS_ANDROID) {
	    var activity = $.newContactHandleWindow.getActivity();
	    activity.actionBar.title = L('select_handle_type');
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeNewContactHandleWindow();
	    };  
	    // activity.invalidateOptionsMenu();
	} else if (OS_IOS) {
		$.navBarTitle.setText(L('select_handle_type'));
		// remove the status bar from the screen of devices that are running iOS 6
		if (Alloy.Globals.iosVersion < 7) {
			$.newContactHandleWindow.top = '-20dp';
		}
	}
});

var handles = require('handles');
var string = require('alloy/string');

$.newContactHandleWindow.addEventListener('close', function() {
	handles = null;
	string = null;
    $.destroy();
});

function selectContactHandleType(_state) {
	// Ti.API.error("Clicked on return in a setType with "+JSON.stringify(_state.row));
	var selectedHandleType = string.trim(_state.row.handleType);
	var url = selectedHandleType;
	if (['mobile'].indexOf(selectedHandleType) > -1) {
		selectedHandleType = 'phone';
		url = 'mobile';
	}
	var controller = "edit"+string.ucfirst(selectedHandleType);
	// Ti.API.error("Going to open controller "+controller);
	var contactHandleController = Alloy.createController(controller, {contactHandle:null, url:url});
	var win = contactHandleController.getView();
	win.open(Alloy.CFG.slideWindow);
	closeNewContactHandleWindow();	
}

function closeNewContactHandleWindow() {
	$.newContactHandleWindow.close();
}