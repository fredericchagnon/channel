$.suggestContactWindow.addEventListener('open', function(e) {
	if (OS_ANDROID) {
	    var activity = $.suggestContactWindow.getActivity();
	    activity.actionBar.title = L('suggest_contact');
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeSuggestContactWindow();
	    };  
	    activity.onPrepareOptionsMenu = function(e) {
	        var menu = e.menu;
	    };
	    // activity.invalidateOptionsMenu();
	} else if (OS_IOS) {
		// remove the status bar from the screen of devices that are running iOS 6
		if (Alloy.Globals.iosVersion < 7) {
			$.suggestContactWindow.top = '-20dp';
		}
	}
});

var args = arguments[0] || {};
var first_user_id = args['first_user_id'];
var first_user_fullname = args['first_user_fullname'];
var server = require('server');
var avatar = require('avatar');
var contacts = Alloy.Collections.contacts;

$.suggestContactWindow.addEventListener("close", function() {
	args = null;
	first_user_id = null;
	first_user_fullname = null;
	server = null;
    contacts = null;
    avatar = null;
    $.destroy();
});

function closeSuggestContactWindow() {
	$.suggestContactWindow.close();
}

populateSuggestContactsTable();

function populateSuggestContactsTable() {
	contacts.fetch();
	var tableData = [];
	_.each(contacts.models, function(cntct) {
		// Ti.API.error("Looping through "+JSON.stringify(cntct));
		var thisRowsUserId = cntct.get('user_id');
		Ti.API.error("Cyclying through users "+thisRowsUserId+" and comparing to "+first_user_id)
		if (thisRowsUserId != first_user_id) {
			var cntctLabel = Ti.UI.createLabel({
				left: '70dp',
				text: cntct.get('fullname'),
				color: '#000',
				font: {
					fontFamily: 'Open Sans Cond Light',
					fontWeight: 'light',
					fontSize: '18dp'
				}
			});
			var cntctImage = avatar.generateRowImage({
				user_id: thisRowsUserId,
				persona_id: cntct.get('persona_id'),
				first_name: cntct.get('first_name'),
				last_name: cntct.get('last_name'),
			});
			var cntctRow = Ti.UI.createTableViewRow({
				width: Ti.UI.FILL,
				height: '60dp',
				second_user_id: thisRowsUserId,
				second_user_fullname: cntct.get('fullname'),
			});
			cntctRow.add(cntctImage);
			cntctRow.add(cntctLabel);
			tableData.push(cntctRow);
		}
	});
	$.suggestContactsTable.setData(tableData);
}


function confirmShareContact(_e) {
	var opts = {
		cancel: 1,
		title: String.format(L('suggest_contact_instructions'), first_user_fullname, _e.row.second_user_fullname)
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('suggest_contact'), L('cancel')];
	} else {
		opts.options = [L('suggest_contact'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_ee) {
		if (_ee.index === 0) {
			server.suggestConnection({
				from_id: first_user_id,
				to_id: _e.row.second_user_id,
				onsuccess: function() {
					alert(L('general_success'));
				},
				onerror: function() {
					// alert(L('general_error'));
				}
			});
			closeSuggestContactWindow();
		}
	});
	dialog.show();
}
