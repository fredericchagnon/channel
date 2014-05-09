if (OS_ANDROID) {
	$.connectWindow.addEventListener('open', function(e) {
	    var activity = $.connectWindow.getActivity();
	    activity.actionBar.title = L('connect');
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeConnectWindow();
	    };  
	});
} else if (OS_IOS) {
	if (Alloy.Globals.iosVersion < 7) {
		// remove the status bar from the screen of devices that are running iOS 6
		$.connectWindow.top = '-20dp';
	}
}

var avatar = require('avatar');
var server = require('server');
var searchActive = false;

$.connectWindow.addEventListener("close", function() {
	avatar = null;
	server = null;
	searchActive = null;
    $.destroy();
});

function closeConnectWindow() {
	$.connectWindow.close();
}

function searchCloud(_e) {
	$.searchValue.blur();
	var searchString = $.searchValue.value;
	Ti.API.error("Clicked on search with "+searchString);
	if (searchString.length > 0) {
		server.contactSearch({
			searchString: searchString,
			onsuccess: displaySearchResults,
			onerror: function(_e) {
				if (_e.event.source.status === 404) {
					displayQueueOption({searchString:searchString});
				} else {
					alert(L('general_error'));
				}
			}
		});
	}
}

function cancelSearch() {
	$.searchValue.setValue('');
	$.searchValue.blur();
	$.searchResultsTable.hide();
	disactivateSearchCancelButton();
}

function activateSearchCancelButton(_e) {
	if (!searchActive && _e.value.length > 0) {
		searchActive = true;
		$.searchCancelButton.setBackgroundColor("#333333");
		$.searchCancelButton.setColor("#FFFFFF");
		$.searchCancelButton.addEventListener('click', cancelSearch);
	}
}

function disactivateSearchCancelButton() {
	searchActive = false;
	$.searchCancelButton.setBackgroundColor("#50333333");
	$.searchCancelButton.setColor("#50FFFFFF");
	$.searchCancelButton.removeEventListener('click', cancelSearch);
}

function displaySearchResults(_state) {
	var searchResults = _state.responseObject;
	if(searchResults.length == 0) {
		$.searchResultsTable.hide();
		alert(L('contact_search_empty_result'));
		if ($.searchValue.value.indexOf('@') != -1) {
			displayQueueOption();
		}
		cancelSearch();
	} else {
		if (OS_IOS) {
			$.searchResultsTable.setHeight(searchResults.length*60);
		}
		populateSearchResultsTable(searchResults);
		$.searchResultsTable.show();
	}
}

function populateSearchResultsTable(_searchResults) {
	var tableData = [];
	for (i in _searchResults) {
		var response = _searchResults[i];
		var resultRowLabel = Ti.UI.createLabel({
			left: '70dp',
			text: response.name,
			color: '#555555',
			font: {
				fontFamily: 'Open Sans Condensed',
				fontSize: '18dp',
				fontWeight: 'Bold'
			}
		});
		var resp_user_id = response.id;
		var resp_pers_id = response.persona_id;
		var resp_first_name = response.name.split(' ').slice(0, -1).join(' ');
		var resp_last_name = response.name.split(' ').slice(-1).join(' ');
		var resultAvatarSlug = {
			user_id: resp_user_id,
			persona_id: resp_pers_id,
			first_name: resp_first_name,
			last_name: resp_last_name,
		};
		Ti.API.error("GENERATE AVATAR W "+JSON.stringify(resultAvatarSlug));
		var resultRowImage = avatar.generateRowImage(resultAvatarSlug);
		var resultRow = Ti.UI.createTableViewRow({
			width: Ti.UI.FILL,
			height: '60dp',
			user_id: resp_user_id,
			persona_id: resp_pers_id,
			response: response,
		});
		resultRow.add(resultRowImage);
		resultRow.add(resultRowLabel);
		tableData.push(resultRow);
	}
	$.searchResultsTable.setData(tableData);
}

function displayQueueOption(_state) {
	var opts = {
		cancel: 1,
		title: String.format(L('empty_search_dialog_title'), _state.searchString)
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('confirm_queue_invitation'), L('cancel')];
	} else {
		opts.options = [L('confirm_queue_invitation'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_ee) {
		if (_ee.index === 0) {
			server.queueInvitation({
				email: _state.searchString,
				onsuccess: function() {
					alert(String.format(L('queue_success'), _state.searchString));
					cancelSearch();
					closeConnectWindow();
				},
				onerror: function() {
					alert(String.format(L('queue_error'), _state.searchString));
					cancelSearch();
					closeConnectWindow();
				}
			})
		}
	});
	dialog.show();
}

function groupConnection(_state) {
	var user_id = _state.rowData.user_id;
	var user_name = _state.rowData.response.name;
	var personas = Alloy.Collections.personas;
	personas.fetch();
	var homePersonaId = personas.where({category: 'Home'})[0].get('id');
	var workPersonaId = personas.where({category: 'Work'})[0].get('id');
	var persona_ids;
	var opts = {
		cancel: 2,
		title: String.format(L('group_contact_title'), user_name)
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('home_me_category_name'), L('work_me_category_name'), L('cancel')];
	} else {
		opts.options = [L('home_me_category_name'), L('work_me_category_name'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_e) {
		if (_e.index < 2) {
			if (_e.index === 0) {
				persona_ids = [homePersonaId]
			} else if (_e.index === 1) {
				persona_ids = [workPersonaId]
			}
			server.requestConnection({
				user_id: user_id,
				persona_ids: persona_ids,
				onsuccess: function() {
					closeConnectWindow();
					if (typeof (user_name) === 'undefined') {
						user_name = '';
					}
					alert(String.format(L('alert_you_requested'), user_name));
					cancelSearch();
				},
				onerror: function() {
					cancelSearch();
					closeConnectWindow();
					alert(L('general_error'));
				},
			})
		} else {
			cancelSearch();
		}
	});
	dialog.show();
}