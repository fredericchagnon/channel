if (OS_ANDROID) {
	$.contactHandlesWindow.addEventListener('open', function(e) {
	    var activity = $.contactHandlesWindow.getActivity();
	    activity.actionBar.title = L('manage_handles');
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeContactHandlesWindow();
	    };  
	    activity.onPrepareOptionsMenu = function(e) {
	        var menu = e.menu;
	        var addButton = menu.add({
	            title: L('add_handle'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
	            icon: "images/ic_content_new.png",
	        });
	        addButton.addEventListener("click", function(e) {
	            newContactHandle();
	        });
	    };
	    // activity.invalidateOptionsMenu();
	});
} else if (OS_IOS) {
	// remove the status bar from the screen of devices that are running iOS 6
	if (Alloy.Globals.iosVersion < 7) {
        $.contactHandlesWindow.top = '-20dp';
	}
}

var string = require('alloy/string');
var contact_handles = Alloy.Collections.contact_handles;
contact_handles.fetch();

$.contactHandlesWindow.addEventListener("close", function() {
	string = null;
    contact_handles = null;
    $.destroy();
});


// Encase the title attribute in square brackets
function transformFunction(_model) {
    // Need to convert the model to a JSON object
    var transform = _model.toJSON();
    if (['iphone', 'android', 'blackberry', 'windows', 'mobile'].indexOf(transform.url) > -1) {
		if (OS_ANDROID) {
			transform.image = "/images/ic_handles_mobile.png";
		} else if (OS_IOS) {
			transform.image = "images/ic_handles_mobile.png";
		}
	} else {
		if (OS_ANDROID) {
			transform.image = "/images/ic_handles_"+transform.url+".png";
		} else if (OS_IOS) {
			transform.image = "images/ic_handles_"+transform.url+".png";
		}
	}
    return transform;
}

function closeContactHandlesWindow() {
	$.contactHandlesWindow.close();
}

function newContactHandle() {
	var newContactHandleController = Alloy.createController('newContactHandle');
	var win = newContactHandleController.getView();
	win.addEventListener('close', function(){contact_handles.fetch();});
	win.open(Alloy.CFG.fadeWindow);
}

function openContactHandle(e) {
	// Ti.API.error("Just clicked on row "+JSON.stringify(e));
	var url = null;
	// var thisContactHandle = contact_handles.get(e.section.items[e.itemIndex].properties.handle_id);
	var thisContactHandle = contact_handles.get(e.row.handle_id);
	var thisContactHandleType = thisContactHandle.get('url');
	if (['iphone', 'android', 'blackberry', 'windows', 'mobile'].indexOf(thisContactHandleType) > -1) {
		thisContactHandleType = 'phone';
		url = 'mobile';
	}
	var controller = "edit"+string.ucfirst(string.trim(thisContactHandleType));
	// Ti.API.error("Going to open controller "+controller);
	var contactHandleController = Alloy.createController(controller, {contactHandle:thisContactHandle, url:url});
	var win = contactHandleController.getView();
	win.addEventListener('close', function(){contact_handles.fetch();});
	win.open(Alloy.CFG.slideWindow);
}