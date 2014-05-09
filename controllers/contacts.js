// var context_id = Math.round( 10000 * Math.random());

var cmcontacts = require('com.fadalabs.contacts');
var utils = require('utils');
var preferences = require('preferences');
var server = require('server');
var connection = require('connection');
var persona = require('persona');
var avatar = require('avatar');

var personas = Alloy.Collections.personas;
var contact_handles = Alloy.Collections.contact_handles;
var persona_handles = Alloy.Collections.persona_handles;
var protocols = Alloy.Collections.protocols;
var statuses = Alloy.Collections.statuses;
var connections = Alloy.Collections.connections;

var channelContactsView, currentGroup, searchContacts;
var oldPrimaryHomePersonaHandle, oldSecondaryHomePersonaHandle, oldPrimaryWorkPersonaHandle, oldSecondaryWorkPersonaHandle;
var primaryHomePersonaHandle, secondaryHomePersonaHandle, primaryWorkPersonaHandle, secondaryWorkPersonaHandle;
var primaryHomeContactHandle, secondaryHomeContactHandle, primaryWorkContactHandle, secondaryWorkContactHandle;
var primaryHomeProtocol, secondaryHomeProtocol, primaryWorkProtocol, secondaryWorkProtocol;

var randomNumberToDeleteCache = new Date();
var homeAvatarCacheBuster = randomNumberToDeleteCache.getTime();
var workAvatarCacheBuster = randomNumberToDeleteCache.getTime();

var groupPickerMenuActive = false;
var settingsPickerMenuActive = false;
var connectPickerMenuActive = false;
var editAvailabilityActive = false;

var new_user = preferences.getNewUser();

personas.fetch();
var homePersonaId = personas.where({category: 'Home'})[0].get('id');
var workPersonaId = personas.where({category: 'Work'})[0].get('id');

statuses.fetch();
var status_id = statuses.at(0).get('id');

var clickDisplaySettingsOptions = function (_e) {};
$.settingsNavBarButton.addEventListener('click', function(_e) {
	clickDisplaySettingsOptions(_e);
});
clickDisplaySettingsOptions = displaySettingsOptions;
var clickDisplayContactGroupOptions = function (_e) {};
$.contactGroupNavBarButton.addEventListener('click', function(_e) {
	clickDisplayContactGroupOptions(_e);
});
clickDisplayContactGroupOptions = displayContactGroupOptions;
var clickDisplayConnectOptions = function (_e) {};
$.connectNavBarButton.addEventListener('click', function(_e) {
	clickDisplayConnectOptions(_e);
});
clickDisplayConnectOptions = displayConnectOptions;

var ContactChannelProxy = function(_e) {};
$.handleSelectorTable.addEventListener('click', function(_e) {
	ContactChannelProxy(_e);
});

var AvailbilityBackgroundProxy = function(_e) {};
$.handleSelector.addEventListener('click', function(_e) {
	AvailbilityBackgroundProxy(_e);
});

$.contactsWindow.addEventListener('close', function(e) {
	cmcontacts = null;
	channelContactsView = null;
	currentGroup = null;
	searchContacts = null;
	personas = null;
	contact_handles = null;
	persona_handles = null;
	protocols = null;
	statuses = null;
	utils = null;
	preferences = null;
	groupPickerMenuActive = null;
	settingsPickerMenuActive = null;
	connectPickerMenuActive = null;
	persona = null;
	avatar = null;
	server = null;
	homePersonaId = null;
	workPersonaId = null;

	randomNumberToDeleteCache = null;
	homeAvatarCacheBuster = null;
	workAvatarCacheBuster = null;

	oldPrimaryHomePersonaHandle = null;
	oldPrimaryWorkPersonaHandle = null;
	oldSecondaryHomePersonaHandle = null;
	oldSecondaryWorkPersonaHandle = null;

	primaryHomePersonaHandle = null;
	secondaryHomePersonaHandle = null;
	primaryWorkPersonaHandle = null;
	secondaryWorkPersonaHandle = null;

	primaryHomeContactHandle = null;
	secondaryHomeContactHandle = null;
	primaryWorkContactHandle = null;
	secondaryWorkContactHandle = null;

	primaryHomeProtocol = null;
	secondaryHomeProtocol = null;
	primaryWorkProtocol = null;
	secondaryWorkProtocol = null;
    $.destroy();
	Ti.App.removeEventListener('refreshMainContactsTable', refreshMainContactsTable);
});

$.contactsWindow.addEventListener('open', function(e) {
	Alloy.Globals.fullAppRefresh();
	if (OS_ANDROID) {
	    var activity = $.contactsWindow.getActivity();
	    activity.actionBar.setLogo('/images/appicon_long.png');
	    activity.actionBar.setTitle('');
	    // Use action bar search view
	    searchContacts = Ti.UI.Android.createSearchView({
	        hintText: L('contact_search_hinttext')
	    });

		// Menu buttons (including overflow items for market setting and info)s
	    activity.onCreateOptionsMenu = function(e) {
	        var menu = e.menu;
	        var searchContacts = menu.add({
	            title: L('search_cloud'),
	            icon: "images/ic_action_search.png",
	            // showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
	            showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW,
	            actionView: searchContacts,
	        });
	        searchContacts.addEventListener("click", function(e) {
	        	// closeWebviewWinsdow();
	        });

	        var addContacts = menu.add({
	            title: L('connect'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
	            icon: "images/ic_social_add_person.png",
	        });
	        addContacts.addEventListener("click", function(e) {
	        	openConnect();
	        });
			var manageHandles = menu.add({
	            title: L('manage_handles'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER,
	            icon: "images/ic_action_search.png",
	        });
	        manageHandles.addEventListener("click", function(e) {
	        	openManageHandles();
	        });

			var deactivate = menu.add({
	            title: L('deactivate_account'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER,
	            icon: "images/ic_alerts_and_states_error.png",
	        });
	        deactivate.addEventListener("click", function(e) {
	        	deactivateAccount();
	        });

			var logout = menu.add({
	            title: L('logout'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER,
	            icon: "images/ic_device_access_accounts.png",
	        });
	        logout.addEventListener("click", function(e) {
	        	logoutAccount();
	        });
	    };
	    activity.invalidateOptionsMenu();
	} else if (OS_IOS) {
		// remove the status bar from the screen of devices that are running iOS 6
		if (Alloy.Globals.iosVersion < 7) {
	        $.contactsWindow.top = '-20dp';
		}
	}
}); 


function refreshConnectionsBadge() {
	connections.fetch();
	var count = connections.length;
	if (count > 0) {
		$.connectBadgeContainer.setOpacity(1.0);
		$.connectBadgeLabel.setText(count);
	} else {
		$.connectBadgeContainer.setOpacity(0.0);
	}
}

function refreshMainContactsTable() {
	// Ti.API.log( "info" , "refreshMainContactsTable - EVENT - START " + context_id ) ;
	refreshContactsFromServer(channelContactsView);
	// Ti.API.log( "info" , "refreshMainContactsTable - EVENT - END" ) ;	
}

Ti.App.addEventListener('refreshConnectionsBadge', refreshConnectionsBadge);

Ti.App.addEventListener('refreshMainContactsTable', refreshMainContactsTable);

function setContactGroupPicker() {
	personas.fetch();
	var data = [];
	data.push({
		title: L('favorite_contacts'),
		leftImage:'images/ic_table_favorites.png',
		filter: 'favorites',
		group_id: null,
		group_name: 'favorites',
		is_me: false,
		className: 'dropDownTableRow',
		'class': 'dropDownTableRow',
		color: '#555555',
		font: {
			fontFamily: 'Open Sans Condensed',
			fontSize: '18dp',
			fontWeight: 'Bold'
		},	
	});
    _.each(personas.models, function(persona) {
    	var leftImage = 'images/ic_table_home.png';
    	if (persona.get('public_name') == 'Work') {
    		leftImage = 'images/ic_table_work.png';
    	}
        data.push({
			title: String.format(L('contact_group'), persona.get('public_name')),
			leftImage: leftImage,
			filter: persona.get('id'),
			group_id: persona.get('id'),
			group_name: persona.get('public_name'),
			is_me: true,
			className: 'dropDownTableRow',
			'class': 'dropDownTableRow',
			color: '#555555',
			font: {
				fontFamily: 'Open Sans Condensed',
				fontSize: '18dp',
				fontWeight: 'Bold'
			},	
        });
	});
	data.push({
		title: L('all_contacts'),
		leftImage:'images/ic_table_all.png',
		filter: 'all',
		group_id: null,
		group_name: 'all',
		is_me: false,
		className: 'dropDownTableRow',
		'class': 'dropDownTableRow',
		color: '#555555',
		font: {
			fontFamily: 'Open Sans Condensed',
			fontSize: '18dp',
			fontWeight: 'Bold'
		},	
	});
	return data;
}

function initializeView() {
	$.editAvailabilityViewContainer.hide();
	var contactGroups = setContactGroupPicker();
	if (OS_IOS) {
		var channelContacts = require('com.fadalabs.channelcontacts');
		channelContactsView = channelContacts.createView({backgroundColor: "#FFFFFF", width: Alloy.CFG.contactCardWidth});
		var groupTableData = [];
		_.each(contactGroups, function(choice) {
		    var row = Ti.UI.createTableViewRow(choice);
		    groupTableData.push(row);
		});
		$.contactGroupSelectorTable.setData(groupTableData);
	} else if (OS_ANDROID) {
		channelContactsView = cmcontacts.createView({top:0, left:0, right:0, bottom:0});
		channelContactsView.search = searchContacts;
		var groupPickerData = [];
		_.each(contactGroups, function(choice) {
		    var row = Ti.UI.createPickerRow(choice);
		    row.class = "contactGroupSelectorRow";
		    groupPickerData.push(row);
		});
		$.contactGroupPicker.add(groupPickerData);

	} else {
		// KILL APP
		alert("This platform isn't supported");
	}
	// Set persona information
	initFilterDictionary(channelContactsView);
	// refresh
	// refreshContactsFromServer(channelContactsView)
	// get the currently selected group
	currentGroup = preferences.getGroupSelected();
	var selectedGroupIndex = contactGroups.map(function(x) {return x.filter;}).indexOf(currentGroup);
	if (OS_IOS) {
		// set the correct title in navbar
		$.navBarCenterTitle.setText(contactGroups[selectedGroupIndex].title);
		$.navBarMenuArrow.setImage('navBarMenuArrowInactive.png');
	} else if (OS_ANDROID) {
		$.contactGroupPicker.setSelectedRow(0, selectedGroupIndex, false);
	}
	channelContactsView.setFilter(currentGroup);
	// Add the event listeners that help communicate with native module
	addEventListenersToView();
	$.contactsView.add(channelContactsView);
	server.listConnections({
		onsuccess: function() {
			Ti.App.fireEvent('refreshConnectionsBadge');
		}
	});
}

function displaySettingsOptions(_state) {
	settingsPickerMenuActive = !settingsPickerMenuActive;
	if (OS_IOS) {
		if (settingsPickerMenuActive) {
			$.availabilitySelector.hide();
			clickDisplayContactGroupOptions = displaySettingsOptions;
			clickDisplayConnectOptions = displaySettingsOptions;
			clickDisplaySettingsOptions = displaySettingsOptions;
			$.shadeView.animate({opacity:1.0,duration:100},function(){
				// call function to aninamte in the tableview
				$.settingsMenuArrow.setImage('navBarMenuArrowActive.png');
				$.settingsMenuArrow.setBackgroundColor('#10FFFFFF');
				$.settingsTable.animate({top : 0, duration : 200}, function(){});
			});
		} else {
			$.settingsTable.animate({top : -180, duration : 200}, function(){
				// call function to aninamte in the tableview
				$.settingsMenuArrow.setImage(null);
				$.settingsMenuArrow.setBackgroundColor('transparent');
				$.shadeView.animate({opacity:0.0,duration:100}, function(){});
				$.availabilitySelector.show();
			});
			clickDisplaySettingsOptions = displaySettingsOptions;
			clickDisplayContactGroupOptions = displayContactGroupOptions;
			clickDisplayConnectOptions = displayConnectOptions;
		}
	}
}

function displayContactGroupOptions(_state) {
	groupPickerMenuActive = !groupPickerMenuActive;
	if (OS_IOS) {
		if (groupPickerMenuActive) {
			$.availabilitySelector.hide();
			clickDisplaySettingsOptions = displayContactGroupOptions;
			clickDisplayContactGroupOptions = displayContactGroupOptions;
			clickDisplayConnectOptions = displayContactGroupOptions;
			$.shadeView.animate({opacity:1.0,duration:100},function(){
				// call function to aninamte in the tableview
				$.navBarMenuArrow.setImage('navBarMenuArrowActive.png');
				$.contactGroupNavBarButton.setBackgroundColor('#10FFFFFF');
				$.contactGroupSelectorTable.animate({top : 0, duration : 200}, function(){});
			});
		} else {
			$.contactGroupSelectorTable.animate({top : -240, duration : 200}, function(){
				// call function to aninamte in the tableview
				if (utils.defined(_state.row)) {
					$.navBarCenterTitle.setText(_state.row.title);
				}
				$.navBarMenuArrow.setImage('navBarMenuArrowInactive.png');
				$.contactGroupNavBarButton.setBackgroundColor('transparent');
				$.shadeView.animate({opacity:0.0,duration:100}, function(){});
				$.availabilitySelector.show();
			});
			clickDisplaySettingsOptions = displaySettingsOptions;
			clickDisplayContactGroupOptions = displayContactGroupOptions;
			clickDisplayConnectOptions = displayConnectOptions;
		}
	}
}

function displayConnectOptions(_state) {
	connectPickerMenuActive = !connectPickerMenuActive;
	if (OS_IOS) {
		if (connectPickerMenuActive) {
			$.availabilitySelector.hide();
			clickDisplaySettingsOptions = displayConnectOptions;
			clickDisplayContactGroupOptions = displayConnectOptions;
			clickDisplayConnectOptions = displayConnectOptions;
			$.shadeView.animate({opacity:1.0,duration:100},function(){
				// call function to aninamte in the tableview
				$.connectMenuArrow.setImage('navBarMenuArrowActive.png');
				$.connectMenuArrow.setBackgroundColor('#10FFFFFF');
				$.connectTable.animate({top : 0, duration : 200}, function(){});
			});
		} else {
			$.connectTable.animate({top : -180, duration : 200}, function(){
				// call function to aninamte in the tableview
				$.connectMenuArrow.setImage(null);
				$.connectMenuArrow.setBackgroundColor('transparent');
				$.shadeView.animate({opacity:0.0,duration:100}, function(){});
				$.availabilitySelector.show();
			});
			clickDisplaySettingsOptions = displaySettingsOptions;
			clickDisplayContactGroupOptions = displayContactGroupOptions;
			clickDisplayConnectOptions = displayConnectOptions;
		}
	}
}

function editAvailability(_state) {
	editAvailabilityActive = !editAvailabilityActive;
	if (OS_IOS) {
		if (editAvailabilityActive) {
			displayPersonas();
			$.navBarTouchBlocker.setTouchEnabled(true);
			$.shadeView.animate({opacity:1.0,duration:100},function(){
				$.navBarTouchBlocker.setBackgroundColor('#03458f');
				$.temporaryNavBarTitle.setText(L('availability'));
				$.editAvailabilityViewContainer.show();
			});
			if (_state.hasOwnProperty('new_user') && _state.new_user) {
				// put a message
				$.newUserInstruction.setOpacity(1.0);
			} else {
				$.newUserInstruction.setOpacity(0.0);
				$.newUserInstruction.setHeight(0.0);
			}
		} else {
			saveAvailability();
			collapseHandleSelector();
			$.temporaryNavBarTitle.setText('');
			$.navBarTouchBlocker.setBackgroundColor('transparent');
			$.navBarTouchBlocker.setTouchEnabled(false);
			$.editAvailabilityViewContainer.hide();
			$.shadeView.animate({opacity:0.0,duration:100}, function(){});
		}
	}
}

function saveAvailability() {
	var oldPrimaryHomePersonaHandleId = null;
	var oldPrimaryWorkPersonaHandleId = null;
	var oldSecondaryHomePersonaHandleId = null;
	var oldSecondaryWorkPersonaHandleId = null;
	if (utils.defined(oldPrimaryHomePersonaHandle) && oldPrimaryHomePersonaHandle != null) {
		oldPrimaryHomePersonaHandleId = oldPrimaryHomePersonaHandle.get('id');
	}
	if (utils.defined(oldPrimaryWorkPersonaHandle) && oldPrimaryWorkPersonaHandle != null) {
		oldPrimaryWorkPersonaHandleId = oldPrimaryWorkPersonaHandle.get('id');
	}
	if (utils.defined(oldSecondaryHomePersonaHandle) && oldSecondaryHomePersonaHandle != null) {
		oldSecondaryHomePersonaHandleId = oldSecondaryHomePersonaHandle.get('id');
	}
	if (utils.defined(oldSecondaryWorkPersonaHandle) && oldSecondaryWorkPersonaHandle != null) {
		oldSecondaryWorkPersonaHandleId = oldSecondaryWorkPersonaHandle.get('id');
	}
	var primaryHomePersonaHandleId = null;
	var primaryWorkPersonaHandleId = null;
	var secondaryHomePersonaHandleId = null;
	var secondaryWorkPersonaHandleId = null;
	if (utils.defined(primaryHomePersonaHandle) && primaryHomePersonaHandle != null) {
		primaryHomePersonaHandleId = primaryHomePersonaHandle.get('id');
	}
	if (utils.defined(primaryWorkPersonaHandle) && primaryWorkPersonaHandle != null) {
		primaryWorkPersonaHandleId = primaryWorkPersonaHandle.get('id');
	}
	if (utils.defined(secondaryHomePersonaHandle) && secondaryHomePersonaHandle != null) {
		secondaryHomePersonaHandleId = secondaryHomePersonaHandle.get('id');
	}
	if (utils.defined(secondaryWorkPersonaHandle) && secondaryWorkPersonaHandle != null) {
		secondaryWorkPersonaHandleId = secondaryWorkPersonaHandle.get('id');
	}
	// Only call server if the status has changed
	if (oldPrimaryHomePersonaHandleId != primaryHomePersonaHandleId || oldPrimaryWorkPersonaHandleId != primaryWorkPersonaHandleId || oldSecondaryHomePersonaHandleId != secondaryHomePersonaHandleId || oldSecondaryWorkPersonaHandleId != secondaryWorkPersonaHandleId) {
		persona_handles.fetch();
		var personaHandles = [];
		_.each(persona_handles.where({status_id: status_id}), function(ph) {
			if (primaryHomePersonaHandleId == ph.get('id') || primaryWorkPersonaHandleId == ph.get('id')) {
				ph.save({rank: 1, enabled: 1});
				personaHandles.push(ph)
			} else if (secondaryHomePersonaHandleId == ph.get('id') || secondaryWorkPersonaHandleId == ph.get('id')) {
				ph.save({rank: 2, enabled: 1});
				personaHandles.push(ph)
			} else {
				ph.save({rank: 99, enabled: 0});
				personaHandles.push(ph)
			}
		});
		server.saveAvailbility({
			status_id: status_id,
			persona_handles: personaHandles,
			onsuccess: function(_e) {
				oldPrimaryHomePersonaHandle = primaryHomePersonaHandle;
				oldPrimaryWorkPersonaHandle = primaryWorkPersonaHandle;
				oldSecondaryHomePersonaHandle = secondaryHomePersonaHandle;
				oldSecondaryWorkPersonaHandle = secondaryWorkPersonaHandle;
				// alert(L('general_success'));
			},
			onerror: function(_e) {
				alert(L('general_error'));
			},
		});
	}
}

function selectContactGroup(_state) {
	var _groupSelected = _state.row.filter;
	preferences.setGroupSelected(_groupSelected);
	channelContactsView.setFilter(_groupSelected);
	currentGroup = _groupSelected;
	displayContactGroupOptions(_state);
}

function openManageHandles(_state) {
	displaySettingsOptions();
	var contactHandlesController = Alloy.createController('contactHandles');
	var win = contactHandlesController.getView();
	win.open(Alloy.CFG.slideWindow);
}

function deactivateAccount(_state) {
	displaySettingsOptions();
	var opts = {
		destructive: 0,
		title: L('deactivate_account_confirm')
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('deactivate_account'), L('cancel')];
	} else {
		opts.options = [L('deactivate_account'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			Alloy.Globals.deactivateAccount({window:$.contactsWindow});
		}
	});
	dialog.show();
}

function logoutAccount(_state) {
	displaySettingsOptions();
	var opts = {
		destructive: 0,
		title: L('logout_confirm')
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('logout'), L('cancel')];
	} else {
		opts.options = [L('logout'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			Alloy.Globals.logout({
				window:$.contactsWindow
			});
		}
	});
	dialog.show();
}

function openConnectInPerson(_state) {
	displayConnectOptions();
	var inPersonController = Alloy.createController('inPerson');
	var win = inPersonController.getView();
	win.open(Alloy.CFG.slideWindow);
}

function openConnect(_state) {
	displayConnectOptions();
	var connectController = Alloy.createController('connect');
	var win = connectController.getView();
	win.open(Alloy.CFG.slideWindow);
}

function openConnectionRequests(_state) {
	displayConnectOptions();
	var pendingConnectionsController = Alloy.createController('pendingConnections');
	var win = pendingConnectionsController.getView();
	win.open(Alloy.CFG.slideWindow);
}

function initFilterDictionary(_contactsTable) {
	personas.fetch();
	if (utils.defined(personas)) {
		var personaIds = {};
	    _.each(personas.models, function(persona) {
	    	if (persona.get('category') === "Home") {
	    		personaIds['home_me'] = persona.get('id')
	    	}
	    	if (persona.get('category') === "Work") {
	    		personaIds['work_me'] = persona.get('id')
	    	}
	    });
		_contactsTable.setFilterDictionary(personaIds);
	}
}

function refreshContactsFromServer(_contactsTable) {
	// Ti.API.log( "info" , "refreshContactsFromServer FUNCTION - START " + context_id);
	server.listContacts({
		onsuccess: function(_e) {
			// Ti.API.log( "info" , "refreshContactsFromServer listContacts - START ");
			_contactsTable.setData({contacts:_e});
			channelContactsView.setFilter(currentGroup);
			// Ti.API.log( "info" , "refreshContactsFromServer listContacts - END ");
		},
		onerror: function(_e) {
			channelContactsView.setFilter(currentGroup);
			// Ti.API.error("The server call to refresh contacts returned error "+JSON.stringify(_e));
		}
	});
	// Ti.API.log( "info" , "refreshContactsFromServer FUNCTION - END ");
}

function addEventListenersToView() {
	// Pull-to-refresh event
	channelContactsView.addEventListener('pullToRefesh', function(_e) {
		Alloy.Globals.fullAppRefresh({
			onsuccess : function() {
				// refresh_main_window();
				Ti.App.fireEvent('refresh_navbar');
			},
			onerror : function() {
				utils.error('Error refreshing list of contacts');
			}
		});
	});
	// listener to change a contact's favorite status
	channelContactsView.addEventListener('setFavorite', function(_e) {
		// only call server if channel contact
		if (_e.connection_id != null && _e.connection_id != "") {
			if (_e.flag === "true") {
				server.setFavorite({
					connection_id: _e.connection_id,
				})
			} else {
				server.unsetFavorite({
					connection_id: _e.connection_id,
				})
			}
		}		
	});
	// listener to change a contact's groups
	channelContactsView.addEventListener('groupContact', function(_e) {
		connection.group({
			slug: {connection_id: _e.connection_id, fullname: _e.fullName, currentGroup: currentGroup},
			callback: server.groupContact,
		});
	});
	// listener to share a contact
	channelContactsView.addEventListener('shareContact', function(_e) {
		var first_user_id = _e.contact.user_id;
		if (first_user_id === null) {
			if (_e.contact.home_me.hasOwnProperty('user_id')) {
				first_user_id = _e.contact.home_me.user_id;
			} else if (_e.contact.work_me.hasOwnProperty('user_id')) {
				first_user_id = _e.contact.work_me.user_id;
			}
		}
		var suggestContactController = Alloy.createController('suggestContact', {first_user_id: first_user_id, first_user_fullname: _e.fullName});
		var win = suggestContactController.getView();
		win.open(Alloy.CFG.slideWindow);
	});
	// listener to chane a contact's favorite status
	channelContactsView.addEventListener('disconnectContact', function(_e) {
		connection.disconnect({
			slug: {connection_id: _e.connection_id, fullname: _e.fullName},
			callback: server.disconnectContact,
		});
	});

	channelContactsView.addEventListener('channelCMB', function(_e) {
		server.requestCMB({
			id: _e.contact.user_id,
		})
	});

	channelContactsView.addEventListener('channelAction', function(_e) {
		utils.open_url(_e);
	});

	channelContactsView.addEventListener('localAction', function(_e) {
		var localHandles = _e.handles;
		var numberOfOptions = localHandles.length;
		var optionsArray = [];
		var actionsArray = [];
		for (var i = 0; i < numberOfOptions; ++i) {
			var protocol = localHandles[i].url;
			var value = localHandles[i].value;
			var name = localHandles[i].label;
			var option_label = L(protocol+'_action_word') + " " + name + ": " + value;
			var option_action = {url : protocol, value : value};
			optionsArray.push(option_label);
			actionsArray.push(option_action);
		}
		optionsArray.push(L('cancel'));
		var option = Ti.UI.createOptionDialog({
			options : optionsArray,
			actions: actionsArray,
			cancel : numberOfOptions,
			// title : L(_e.url+'-button-action-word'),
		});
		option.addEventListener('click', function(opt) {
			if (opt.index != numberOfOptions) {
				utils.open_url(opt.source.actions[opt.index]);
			}
		});
		option.show();
	});
}

initializeView();
initializeAvailabilityView();

function initializeAvailabilityView() {
	contact_handles.fetch();
	persona_handles.fetch();
	protocols.fetch();
	var postProtocols = protocols.where({type: 'post'});
	var postProtocolIds = [];
	_.each(postProtocols, function(pr) {
		postProtocolIds.push(pr.get('id'));
	});
	var homePersonaHandles = [];
	_.each(persona_handles.where({status_id: status_id, persona_id: homePersonaId, enabled: 1}), function(ph) {
		if (postProtocolIds.indexOf(ph.get('protocol_id')) < 0) {
			homePersonaHandles.push(ph);
		}
	});
	if (homePersonaHandles.length > 0) {
		primaryHomePersonaHandle = persona_handles.where({status_id: status_id, persona_id: homePersonaId, protocol_id: homePersonaHandles[0].get('protocol_id')})[0];
		oldPrimaryHomePersonaHandle = primaryHomePersonaHandle;
		primaryHomeProtocol = protocols.get(primaryHomePersonaHandle.get('protocol_id'));
		primaryHomeContactHandle = contact_handles.get(primaryHomeProtocol.get('contact_handle_id'));
		if (homePersonaHandles.length > 1) {
			secondaryHomePersonaHandle = persona_handles.where({status_id: status_id, persona_id: homePersonaId, protocol_id: homePersonaHandles[1].get('protocol_id')})[0];
			oldSecondaryHomePersonaHandle = secondaryHomePersonaHandle;
			secondaryHomeProtocol = protocols.get(secondaryHomePersonaHandle.get('protocol_id'));
			secondaryHomeContactHandle = contact_handles.get(secondaryHomeProtocol.get('contact_handle_id'));
		}
	}
	displayPrimaryHomeContactChannel();
	displaySecondaryHomeContactChannel();
	var workPersonaHandles = [];
	_.each(persona_handles.where({status_id: status_id, persona_id: workPersonaId, enabled: 1}), function(ph) {
		if (postProtocolIds.indexOf(ph.get('protocol_id')) < 0) {
			workPersonaHandles.push(ph);
		}
	});
	if (workPersonaHandles.length > 0) {
		primaryWorkPersonaHandle = persona_handles.where({status_id: status_id, persona_id: workPersonaId, protocol_id: workPersonaHandles[0].get('protocol_id')})[0];
		oldPrimaryWorkPersonaHandle = primaryWorkPersonaHandle;
		primaryWorkProtocol = protocols.get(primaryWorkPersonaHandle.get('protocol_id'));
		primaryWorkContactHandle = contact_handles.get(primaryWorkProtocol.get('contact_handle_id'));
		if (workPersonaHandles.length > 1) {
			secondaryWorkPersonaHandle = persona_handles.where({status_id: status_id, persona_id: workPersonaId, protocol_id: workPersonaHandles[1].get('protocol_id')})[0];
			oldSecondaryWorkPersonaHandle = secondaryWorkPersonaHandle;
			secondaryWorkProtocol = protocols.get(secondaryWorkPersonaHandle.get('protocol_id'));
			secondaryWorkContactHandle = contact_handles.get(secondaryWorkProtocol.get('contact_handle_id'));
		}
	}
	displayPrimaryWorkContactChannel();
	displaySecondaryWorkContactChannel();
}

function displayPrimaryHomeContactChannel() {
	$.homePrimaryContactChannel.setBackgroundColor('#3FA9F5');
	if (primaryHomePersonaHandle == null) {
		// $.homePrimaryContactChannelActionImage.setImage('images/ic_actions_cmb.png');
		// $.homePrimaryContactChannelActionLabel.setText(L('contact_me_back'));
		$.homePrimaryContactChannel.setBackgroundColor('#B1B1B1');
		$.homePrimaryContactChannelActionImage.setImage('images/ic_actions_more.png');
		$.homePrimaryContactChannelActionImage.setTop('auto');
		$.homePrimaryContactChannelActionLabel.setText('');
	} else {
		$.homePrimaryContactChannel.setBackgroundColor('#3FA9F5');
		$.homePrimaryContactChannelActionImage.setTop('0dp');
		$.homePrimaryContactChannelActionImage.setImage('images/ic_actions_'+primaryHomeProtocol.get('type')+'.png');
		$.homePrimaryContactChannelActionLabel.setText(primaryHomeContactHandle.get('name'));
	}
}

function displaySecondaryHomeContactChannel() {
	if (secondaryHomePersonaHandle == null) {
		$.homeSecondaryContactChannel.setBackgroundColor('#B1B1B1');
		$.homeSecondaryContactChannelActionImage.setImage('images/ic_actions_more.png');
		$.homeSecondaryContactChannelActionImage.setTop('auto');
		$.homeSecondaryContactChannelActionLabel.setText('');
	} else {
		$.homeSecondaryContactChannel.setBackgroundColor('#3FA9F5');
		$.homeSecondaryContactChannelActionImage.setTop('0dp');
		$.homeSecondaryContactChannelActionImage.setImage('images/ic_actions_'+secondaryHomeProtocol.get('type')+'.png');
		$.homeSecondaryContactChannelActionLabel.setText(secondaryHomeContactHandle.get('name'));
	}
}

function displayPrimaryWorkContactChannel() {
	$.workPrimaryContactChannel.setBackgroundColor('#3FA9F5');
	if (primaryWorkPersonaHandle == null) {
		// $.workPrimaryContactChannelActionImage.setImage('images/ic_actions_cmb.png');
		// $.workPrimaryContactChannelActionLabel.setText(L('contact_me_back'));
		$.workPrimaryContactChannel.setBackgroundColor('#B1B1B1');
		$.workPrimaryContactChannelActionImage.setImage('images/ic_actions_more.png');
		$.workPrimaryContactChannelActionImage.setTop('auto');
		$.workPrimaryContactChannelActionLabel.setText('');
	} else {
		$.workPrimaryContactChannel.setBackgroundColor('#3FA9F5');
		$.workPrimaryContactChannelActionImage.setTop('0dp');
		$.workPrimaryContactChannelActionImage.setImage('images/ic_actions_'+primaryWorkProtocol.get('type')+'.png');
		$.workPrimaryContactChannelActionLabel.setText(primaryWorkContactHandle.get('name'));
	}
}

function displaySecondaryWorkContactChannel() {
	if (secondaryWorkPersonaHandle == null) {
		$.workSecondaryContactChannel.setBackgroundColor('#B1B1B1');
		$.workSecondaryContactChannelActionImage.setImage('images/ic_actions_more.png');
		$.workSecondaryContactChannelActionImage.setTop('auto');
		$.workSecondaryContactChannelActionLabel.setText('');
	} else {
		$.workSecondaryContactChannel.setBackgroundColor('#3FA9F5');
		$.workSecondaryContactChannelActionImage.setTop('0dp');
		$.workSecondaryContactChannelActionImage.setImage('images/ic_actions_'+secondaryWorkProtocol.get('type')+'.png');
		$.workSecondaryContactChannelActionLabel.setText(secondaryWorkContactHandle.get('name'));
	}
}

function displayPersonas() {
	personas.fetch();
	var homePersona = personas.get(homePersonaId);
	var workPersona = personas.get(workPersonaId);

	$.homeContactCardAvatar.setImage('https://s3.amazonaws.com/avatars.channel/uploads/'+homePersonaId+'.jpg?cacheClear='+homeAvatarCacheBuster);
	$.workContactCardAvatar.setImage('https://s3.amazonaws.com/avatars.channel/uploads/'+workPersonaId+'.jpg?cacheClear='+workAvatarCacheBuster);

	$.homeContactCardNameLabel.setText(persona.getFullName(homePersona));
	$.workContactCardNameLabel.setText(persona.getFullName(workPersona));

	var homeJob = persona.getJobDepartment(homePersona);
	var homeCompany = persona.getCompany(homePersona);
	var workJob = persona.getJobDepartment(workPersona);
	var workCompany = persona.getCompany(workPersona);

    if ((homeJob == null || homeJob.length == 0) && (homeCompany == null || homeCompany.length == 0)) {
        // don't do anything
    } else {
        if ((homeJob != null && homeJob.length > 0) && (homeCompany == null || homeCompany.length == 0)) {
            $.homeContactCardJobDeptLabel.setText(homeJob);
        } else if ((homeJob == null || homeJob.length == 0) && (homeCompany != null && homeCompany.length > 0)) {
            $.homeContactCardJobDeptLabel.setText(homeCompany);
        } else {
            $.homeContactCardJobDeptLabel.setText(homeCompany+" - "+homeJob);
        }
    }

    if ((workJob == null || workJob.length == 0) && (workCompany == null || workCompany.length == 0)) {
        // don't do anything
    } else {
        if ((workJob != null && workJob.length > 0) && (workCompany == null || workCompany.length == 0)) {
            $.workContactCardJobDeptLabel.setText(workJob);
        } else if ((workJob == null || workJob.length == 0) && (workCompany != null && workCompany.length > 0)) {
            $.workContactCardJobDeptLabel.setText(workCompany);
        } else {
            $.workContactCardJobDeptLabel.setText(workCompany+" - "+workJob);
        }
    }
}

function editHomePersonaInfo() {
	editPersona({persona_id: homePersonaId});
}

function editWorkPersonaInfo() {
	editPersona({persona_id: workPersonaId});
}

function editHomeAvatar() {
	randomNumberToDeleteCache = new Date();
	editAvatar({
		persona_id: homePersonaId,
		setAvatar: function(_e) {
			$.homeContactCardAvatar.setImage(_e.image);
		},
		cacheBust: function(_e) {
			homeAvatarCacheBuster = randomNumberToDeleteCache.getTime();
		}
	});
}

function editWorkAvatar() {
	randomNumberToDeleteCache = new Date();
	editAvatar({
		persona_id: workPersonaId,
		setAvatar: function(_e) {
			$.workContactCardAvatar.setImage(_e.image);
		},
		cacheBust: function() {
			workAvatarCacheBuster = randomNumberToDeleteCache.getTime();
		}
	});
}

function editPersona(_state) {
	var editPersonaController = Alloy.createController('editPersona', {persona_id:_state.persona_id});
	var win = editPersonaController.getView();
	win.addEventListener('close', displayPersonas);
	win.open(Alloy.CFG.fadeWindow);
}

function editAvatar(_state) {
	var opts = {
		title: L(''),
		cancel : 2,
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('take_a_photo'), L('choose_from_library'), L('cancel')];
	} else {
		opts.options = [L('take_a_photo'), L('choose_from_library'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			Ti.Media.showCamera({
				success: function(_e) {
					var avatar = _e.media;
					var path = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, _state.persona_id + ".jpg");
					path.write(avatar);
					utils.call_callback(_state.setAvatar, {image: avatar});
					server.saveAvatar({
						persona_id: _state.persona_id,
						blob: path,
						onsuccess: function() {
							utils.call_callback(_state.cacheBust, {});
							displayPersonas();
						}
					});
				},
				cancel: function() {},
				autoHide: true,
				showControls: true,
			});
		} else if (e.index == 1) {
			Ti.Media.openPhotoGallery({
				success: function(_e) {
					var avatar = _e.media;
					var path = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, _state.persona_id + ".jpg");
					path.write(avatar);
					utils.call_callback(_state.setAvatar, {image: avatar});
					server.saveAvatar({
						persona_id: _state.persona_id,
						blob: path,
						onsuccess: function() {
							utils.call_callback(_state.cacheBust, {});
							displayPersonas();
						}
					});
				},
				cancel: function() {},
				autoHide: true,
				showControls: true,
			});
		}
	});
	dialog.show();
}

function collectActionProtocols() {
	protocols.fetch();
	contact_handles.fetch();
	var actionProtocols = [];
	_.each(protocols.models, function(_pr) {
		if (_pr.get('active') == 1 && _pr.get('type') != 'post') {
			var thisContactHandle = contact_handles.get(_pr.get('contact_handle_id'));
			var thisActionProtocol = {
				protocol_id: _pr.get('id'),
				protocol_type: _pr.get('type'),
				protocol_name: thisContactHandle.get('name'),
				protocol_value: thisContactHandle.get('value'),
			};
			actionProtocols.push(thisActionProtocol);
		}
	});
	return actionProtocols;
}

function editPrimaryHomeContactChannel() {
	$.homePrimaryContactChannel.setBackgroundColor('#0052AF');
	var actionProtocols = collectActionProtocols();
	var actionProtocolsTableData = createProtocolRows(actionProtocols);
	$.handleSelectorTable.setData(actionProtocolsTableData);
	ContactChannelProxy = setPrimaryHomeContactChannel;
	$.handleSelector.animate({opacity: 1.0, duration: 100}, function() {
		$.handleSelectorTable.animate({left: 0, duration: 200}, function() {});
		AvailbilityBackgroundProxy = collapseHandleSelector;
		// $.handleSelector.addEventListener('click', collapseHandleSelector);
	});
}

function editSecondaryHomeContactChannel() {
	$.homeSecondaryContactChannel.setBackgroundColor('#0052AF');
	var actionProtocols = collectActionProtocols();
	var actionProtocolsTableData = createProtocolRows(actionProtocols);
	$.handleSelectorTable.setData(actionProtocolsTableData);
	ContactChannelProxy = setSecondaryHomeContactChannel;
	$.handleSelector.animate({opacity: 1.0, duration: 100}, function() {
		$.handleSelectorTable.animate({left: 0, duration: 200}, function() {});
		AvailbilityBackgroundProxy = collapseHandleSelector;
	});
}

function editPrimaryWorkContactChannel() {
	$.workPrimaryContactChannel.setBackgroundColor('#0052AF');
	var actionProtocols = collectActionProtocols();
	var actionProtocolsTableData = createProtocolRows(actionProtocols);
	$.handleSelectorTable.setData(actionProtocolsTableData);
	ContactChannelProxy = setPrimaryWorkContactChannel;
	$.handleSelector.animate({opacity: 1.0, duration: 100}, function() {
		$.handleSelectorTable.animate({left: 0, duration: 200}, function() {});
		AvailbilityBackgroundProxy = collapseHandleSelector;
	});
}

function editSecondaryWorkContactChannel() {
	$.workSecondaryContactChannel.setBackgroundColor('#0052AF');
	var actionProtocols = collectActionProtocols();
	var actionProtocolsTableData = createProtocolRows(actionProtocols);
	$.handleSelectorTable.setData(actionProtocolsTableData);
	ContactChannelProxy = setSecondaryWorkContactChannel;
	$.handleSelector.animate({opacity: 1.0, duration: 100}, function() {
		$.handleSelectorTable.animate({left: 0, duration: 200}, function() {});
		AvailbilityBackgroundProxy = collapseHandleSelector;
	});
}

function collapseHandleSelector() {
	AvailbilityBackgroundProxy = function(){};
	ContactChannelProxy = function(){};
	displayPrimaryHomeContactChannel();
	displaySecondaryHomeContactChannel();
	displayPrimaryWorkContactChannel();
	displaySecondaryWorkContactChannel();
	$.handleSelectorTable.animate({left: -80, duration: 200}, function() {
		$.handleSelector.animate({opacity: 0.0, duration: 100}, function() {});
	});	
}

function addNewContactHandle(_state) {
	var newContactHandleController = Alloy.createController('newContactHandle');
	var win = newContactHandleController.getView();
	win.addEventListener('close', function() {
		utils.call_callback(_state.onsuccess);
	});
	win.open(Alloy.CFG.fadeWindow);
}

function setPrimaryHomeContactChannel(_e) {
	if (primaryHomePersonaHandle != null) {
		primaryHomePersonaHandle.save({rank: 99, enabled: 0});
	}
	var selectedProtocolId = _e.row.protocol_id;
	if (selectedProtocolId != null && selectedProtocolId != 'add') {
		primaryHomeProtocol = protocols.get(selectedProtocolId);
		primaryHomeContactHandle = contact_handles.get(primaryHomeProtocol.get('contact_handle_id'));
		primaryHomePersonaHandle = persona_handles.where({status_id: status_id, persona_id: homePersonaId, protocol_id: selectedProtocolId})[0];
		primaryHomePersonaHandle.save({rank: 1, enabled: 1});
		if (secondaryHomePersonaHandle != null && primaryHomePersonaHandle.id == secondaryHomePersonaHandle.id) {
			secondaryHomeProtocol = null;
			secondaryHomeContactHandle = null;
			secondaryHomePersonaHandle = null;
		}
	} else if (selectedProtocolId == 'add') {
		addNewContactHandle({
			onsuccess: function() {
				// setTimeout(function(){editPrimaryHomeContactChannel()}, 200);
			}
		});
	} else {
		if (secondaryHomePersonaHandle != null) {
			primaryHomeProtocol = secondaryHomeProtocol;
			primaryHomeContactHandle = secondaryHomeContactHandle;
			primaryHomePersonaHandle = secondaryHomePersonaHandle;
			primaryHomePersonaHandle.save({rank: 1, enabled: 1});
			secondaryHomeProtocol = null;
			secondaryHomeContactHandle = null;
			secondaryHomePersonaHandle = null;
		} else {
			primaryHomeProtocol = null;
			primaryHomeContactHandle = null;
			primaryHomePersonaHandle = null;			
		}
	}
	collapseHandleSelector();
}

function setSecondaryHomeContactChannel(_e) {
	if (secondaryHomePersonaHandle != null) {
		secondaryHomePersonaHandle.save({rank: 99, enabled: 0});
	}
	var selectedProtocolId = _e.row.protocol_id;
	if (selectedProtocolId != null && selectedProtocolId != 'add') {
		secondaryHomeProtocol = protocols.get(selectedProtocolId);
		secondaryHomeContactHandle = contact_handles.get(secondaryHomeProtocol.get('contact_handle_id'));
		secondaryHomePersonaHandle = persona_handles.where({status_id: status_id, persona_id: homePersonaId, protocol_id: selectedProtocolId})[0];
		if (primaryHomePersonaHandle == null) {
			primaryHomeProtocol = secondaryHomeProtocol;
			primaryHomeContactHandle = secondaryHomeContactHandle;
			primaryHomePersonaHandle = secondaryHomePersonaHandle;
			primaryHomePersonaHandle.save({rank: 1, enabled: 1});
			secondaryHomeProtocol = null;
			secondaryHomeContactHandle = null;
			secondaryHomePersonaHandle = null;
		} else if (secondaryHomePersonaHandle.id == primaryHomePersonaHandle.id) {
			secondaryHomeProtocol = null;
			secondaryHomeContactHandle = null;
			secondaryHomePersonaHandle = null;
		} else {
			secondaryHomePersonaHandle.save({rank: 2, enabled: 1});
		}
	} else if (selectedProtocolId == 'add') {
		addNewContactHandle({
			onsuccess: function() {
				// setTimeout(function(){editSecondaryHomeContactChannel()}, 200);
			}
		});
	} else {
		secondaryHomeProtocol = null;
		secondaryHomeContactHandle = null;
		secondaryHomePersonaHandle = null;
	}
	collapseHandleSelector();
}

function setPrimaryWorkContactChannel(_e) {
	if (primaryWorkPersonaHandle != null) {
		primaryWorkPersonaHandle.save({rank: 99, enabled: 0});
	}
	var selectedProtocolId = _e.row.protocol_id;
	if (selectedProtocolId != null && selectedProtocolId != 'add') {
		primaryWorkProtocol = protocols.get(selectedProtocolId);
		primaryWorkContactHandle = contact_handles.get(primaryWorkProtocol.get('contact_handle_id'));
		primaryWorkPersonaHandle = persona_handles.where({status_id: status_id, persona_id: workPersonaId, protocol_id: selectedProtocolId})[0];
		primaryWorkPersonaHandle.save({rank: 1, enabled: 1});
		if (secondaryWorkPersonaHandle != null && primaryWorkPersonaHandle.id == secondaryWorkPersonaHandle.id) {
			secondaryWorkProtocol = null;
			secondaryWorkContactHandle = null;
			secondaryWorkPersonaHandle = null;
		}
	} else if (selectedProtocolId == 'add') {
		addNewContactHandle({
			onsuccess: function() {
				// setTimeout(function(){editPrimaryWorkContactChannel()}, 200);
			}
		});
	} else {
		if (secondaryWorkPersonaHandle != null) {
			primaryWorkProtocol = secondaryWorkProtocol;
			primaryWorkContactHandle = secondaryWorkContactHandle;
			primaryWorkPersonaHandle = secondaryWorkPersonaHandle;
			primaryWorkPersonaHandle.save({rank: 1, enabled: 1});
			secondaryWorkProtocol = null;
			secondaryWorkContactHandle = null;
			secondaryWorkPersonaHandle = null;
		} else {
			primaryWorkProtocol = null;
			primaryWorkContactHandle = null;
			primaryWorkPersonaHandle = null;			
		}
	}
	collapseHandleSelector();
}

function setSecondaryWorkContactChannel(_e) {
	if (secondaryWorkPersonaHandle != null) {
		secondaryWorkPersonaHandle.save({rank: 99, enabled: 0});
	}
	var selectedProtocolId = _e.row.protocol_id;
	if (selectedProtocolId != null && selectedProtocolId != 'add') {
		secondaryWorkProtocol = protocols.get(selectedProtocolId);
		secondaryWorkContactHandle = contact_handles.get(secondaryWorkProtocol.get('contact_handle_id'));
		secondaryWorkPersonaHandle = persona_handles.where({status_id: status_id, persona_id: workPersonaId, protocol_id: selectedProtocolId})[0];
		if (primaryWorkPersonaHandle == null) {
			primaryWorkProtocol = secondaryWorkProtocol;
			primaryWorkContactHandle = secondaryWorkContactHandle;
			primaryWorkPersonaHandle = secondaryWorkPersonaHandle;
			primaryWorkPersonaHandle.save({rank: 1, enabled: 1});
			secondaryWorkProtocol = null;
			secondaryWorkContactHandle = null;
			secondaryWorkPersonaHandle = null;
		} else if (secondaryWorkPersonaHandle.id == primaryWorkPersonaHandle.id) {
			secondaryWorkProtocol = null;
			secondaryWorkContactHandle = null;
			secondaryWorkPersonaHandle = null;
		} else {
			secondaryWorkPersonaHandle.save({rank: 2, enabled: 1});
		}
	} else if (selectedProtocolId == 'add') {
		addNewContactHandle({
			onsuccess: function() {
				// setTimeout(function(){editSecondaryWorkContactChannel()}, 200);
			}
		});
	} else {
		secondaryWorkProtocol = null;
		secondaryWorkContactHandle = null;
		secondaryWorkPersonaHandle = null;
	}
	collapseHandleSelector();
}

function createProtocolRows(_hash) {
	var returnData = [];
	var nullRowLabel = Ti.UI.createLabel({
		text: L('disable'),
		textAlign: 'center',
		bottom: '0dp',
		height: '15dp',
		font: {
			fontFamily: 'Open Sans Condensed',
			fontWeight: 'Bold',
			fontSize: '12dp'
		},
		color: '#000000',
	});
	var nullRowIcon = Ti.UI.createImageView({
		top: '0dp',
		height: '30dp',
		width: '30dp',
		image: 'images/ic_actions_disable.png',
	});
	var nullRow = Ti.UI.createTableViewRow({
		width: '80dp',
		height: '45dp',
		protocol_id: null,
		protocol_value: null,
		backgroundColor: '#B1B1B1',
	});
	nullRow.add(nullRowLabel);
	nullRow.add(nullRowIcon);
	returnData.push(nullRow);
	_.each(_hash, function(_hashItem) {
		var thisRowLabel = Ti.UI.createLabel({
			text: _hashItem['protocol_name'],
			textAlign: 'center',
			bottom: '0dp',
			height: '15dp',
			font: {
				fontFamily: 'Open Sans Condensed',
				fontWeight: 'Bold',
				fontSize: '12dp'
			},
			color: '#FFFFFF',
		});
		var thisRowIcon = Ti.UI.createImageView({
			top: '0dp',
			height: '30dp',
			width: '30dp',
			image: 'images/ic_actions_'+_hashItem['protocol_type']+'.png',
		});
		var thisRow = Ti.UI.createTableViewRow({
			width: '80dp',
			height: '45dp',
			protocol_id: _hashItem['protocol_id'],
			protocol_value: _hashItem['protocol_value'],
			backgroundColor: '#3FA9F5',
		});
		thisRow.add(thisRowLabel);
		thisRow.add(thisRowIcon);
		returnData.push(thisRow);
	});
	var addRowLabel = Ti.UI.createLabel({
		text: L('add_handle'),
		textAlign: 'center',
		bottom: '0dp',
		height: '15dp',
		font: {
			fontFamily: 'Open Sans Condensed',
			fontWeight: 'Bold',
			fontSize: '12dp'
		},
		color: '#000000',
	});
	var addRowIcon = Ti.UI.createImageView({
		top: '0dp',
		height: '30dp',
		width: '30dp',
		image: 'images/ic_actions_add.png',
	});
	var addRow = Ti.UI.createTableViewRow({
		width: '80dp',
		height: '45dp',
		protocol_id: 'add',
		protocol_value: null,
		backgroundColor: '#B1B1B1',
	});
	addRow.add(addRowLabel);
	addRow.add(addRowIcon);
	returnData.push(addRow);
	return returnData;
}

if (new_user) {
	Ti.App.Properties.setBool('new_user', false);
	editAvailability({
		new_user: true
	});
}
