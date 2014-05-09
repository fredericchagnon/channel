$.pendingConnectionsWindow.addEventListener('open', function(e) {
	if (OS_ANDROID) {
	    var activity = $.pendingConnectionsWindow.getActivity();
	    activity.actionBar.title = L('connection_requests');
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closePendingConnectionsWindow();
	    };  
	} else if (OS_IOS) {
		// remove the status bar from the screen of devices that are running iOS 6
		if (Alloy.Globals.iosVersion < 7) {
			$.pendingConnectionsWindow.top = '-20dp';
		}
	}
});

var avatar = require('avatar');
var server = require('server');
var connection = require('connection');
var connections = Alloy.Collections.connections;

$.pendingConnectionsWindow.addEventListener("close", function() {
	avatar = null;
	server = null;
    connections = null;
    $.destroy();
});

populatePendingConnectionsTable();

function populatePendingConnectionsTable() {
	connections.fetch();
	Ti.App.fireEvent('refreshConnectionsBadge');
	// populate & show table if there are any connections to show
	if (connections.length > 0) {
		$.pendingConnectionsView.show();
		$.emptyPendingConnectionsView.hide();
		var tableData = [];
		// INCOMING REQUESTS
		var incomingRequests = connections.where({type: 'incoming_requests'});
		if (incomingRequests.length > 0) {
			var incomingRequestsSectionView = Ti.UI.createView({
				height: '21dp',
				width: Ti.UI.FILL,
				backgroundColor: '#DDD'
			});
			var incomingRequestsSectionLabel = Ti.UI.createLabel({
				left: '5dp',
				color: '#000',
				font: {
					fontFamily: 'Open Sans Condensed',
					fontSize: '12dp',
					fontWeight: 'Bold'
				},
				text: L('incoming_requests_title'),
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			});
			incomingRequestsSectionView.add(incomingRequestsSectionLabel);
			var incomingRequestsSection = Ti.UI.createTableViewSection({
				headerView: incomingRequestsSectionView,
			});
			tableData.push(incomingRequestsSection);
			_.each(incomingRequests, function(ir) {
				var irlabel = Ti.UI.createLabel({
					left: '70dp',
					text: ir.get('from_name'),
					color: '#555555',
					font: {
						fontFamily: 'Open Sans Condensed',
						fontWeight: 'Bold',
						fontSize: '18dp'
					}
				});
				var irimage = avatar.generateRowImage({
					user_id: ir.get('from_id'),
					persona_id: ir.get('from_persona_id'),
					first_name: ir.get('from_name').split(' ').slice(0, -1).join(' '),
					last_name: ir.get('from_name').split(' ').slice(-1).join(' '),
				});
				var irrow = Ti.UI.createTableViewRow({
					width: Ti.UI.FILL,
					height: '60dp',
					request_id: ir.get('id'),
					type: 'request',
					fullname: ir.get('from_name'),
				});
				irrow.add(irimage);
				irrow.add(irlabel);
				tableData.push(irrow);
			});
		}
		// INCOMING SUGGESTS
		var incomingSuggests = connections.where({type: 'incoming_suggests'});
		Ti.API.error("incomingSuggests "+JSON.stringify(incomingSuggests));
		if (incomingSuggests.length > 0) {
			var incomingSuggestsSectionView = Ti.UI.createView({
				height: '21dp',
				width: Ti.UI.FILL,
				backgroundColor: '#DDD'
			});
			var incomingSuggestsSectionLabel = Ti.UI.createLabel({
				left: '5dp',
				color: '#000',
				font: {
					fontFamily: 'Open Sans Condensed',
					fontSize: '12dp',
					fontWeight: 'Bold'
				},
				text: L('incoming_suggests_title'),
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			});
			incomingSuggestsSectionView.add(incomingSuggestsSectionLabel);
			var incomingSuggestsSection = Ti.UI.createTableViewSection({
				headerView: incomingSuggestsSectionView
			});
			tableData.push(incomingSuggestsSection);
			_.each(incomingSuggests, function(is) {
				var islabel = Ti.UI.createLabel({
					left: '70dp',
					top: '5dp',
					text: is.get('other_name'),
					color: '#555555',
					font: {
						fontFamily: 'Open Sans Condensed',
						fontWeight: 'Bold',
						fontSize: '18dp'
					}
				});
				var isimage = avatar.generateRowImage({
					user_id: is.get('other_id'),
					persona_id: is.get('other_persona_id'),
					first_name: is.get('other_name').split(' ').slice(0, -1).join(' '),
					last_name: is.get('other_name').split(' ').slice(-1).join(' '),
				});
				var isrow = Ti.UI.createTableViewRow({
					width: Ti.UI.FILL,
					height: '60dp',
					request_id: is.get('id'),
					type: 'suggest',
					fullname: is.get('other_name'),
				});
				isrow.add(isimage);
				isrow.add(islabel);
				if (is.get('by_id') === Ti.App.Properties.getString('user_id', null)) {
					var bylabel = Ti.UI.createLabel({
						left: '70dp',
						bottom: '5dp',
						text: L('automatically_generated_suggestion'),
						color: '#555555',
						font: {
							fontFamily: 'Open Sans',
							fontStyle: 'Condensed Light',
							fontSize: '12dp'
						}
					});
					isrow.add(bylabel);
				} else {
					var bylabel = Ti.UI.createLabel({
						left: '70dp',
						bottom: '5dp',
						text: String.format(L('suggested_by'), is.get('by_name')),
						color: '#555555',
						font: {
							fontFamily: 'Open Sans',
							fontStyle: 'Condensed Light',
							fontSize: '12dp'
						}
					});
					var byimage = avatar.generateByRowImage({
						user_id: is.get('by_id'),
						persona_id: is.get('by_persona_id'),
						first_name: is.get('by_name').split(' ').slice(0, -1).join(' '),
						last_name: is.get('by_name').split(' ').slice(-1).join(' '),
					});
					isrow.add(byimage);
					isrow.add(bylabel);
				}
				tableData.push(isrow);
			});
		}
		// var outgoingRequests = connections.where({type: 'outgoing_requests'});
		// if (outgoingRequests.length > 0) {
		// 	var outgoingRequestsSectionLabel = Ti.UI.createLabel({
		// 		left: '21dp',
		// 		color: '#000',
		// 		font: {
		// 			fontSize: '10dp',
		// 			fontWeight: 'bold'
		// 		},
		// 		text: L('outgoing_requests_title'),
		// 		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		// 	});
		// 	var outgoingRequestsSection = Ti.UI.createTableViewSection({
		// 		height: '21dp',
		// 		width: Ti.UI.FILL,
		// 		backgroundColor: '#777',
		// 	});
		// 	outgoingRequestsSection.setHeaderView(outgoingRequestsSectionLabel);
		// 	tableData.push(outgoingRequestsSection);
		// 	_.each(outgoingRequests, function(or) {
		// 		var orlabel = Ti.UI.createLabel({
		// 			left: '70dp',
		// 			text: or.get('to_name'),
		// 			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		// 			color: '#000',
		// 			font: {
		// 				fontSize: '16dp'
		// 			},
		// 		});
		// 		var orimage = avatar.generateRowImage({
		// 			user_id: or.get('to_id'),
		// 			persona_id: or.get('to_persona_id'),
		// 			first_name: or.get('to_name').split(' ').slice(0, -1).join(' '),
		// 			last_name: or.get('to_name').split(' ').slice(-1).join(' '),
		// 		});
		// 		var orrow = Ti.UI.createTableViewRow({
		// 			width: Ti.UI.FILL,
		// 			height: '60dp',
		// 			request_id: or.get('id'),
		// 		});
		// 		orrow.add(orimage);
		// 		orrow.add(orlabel);
		// 		tableData.push(orrow);
		// 	});
		// }
		$.pendingConnectionsTable.setData(tableData);
	} else {
		$.pendingConnectionsView.hide();
		$.emptyPendingConnectionsView.show();
	}
}

function closePendingConnectionsWindow() {
	$.pendingConnectionsWindow.close();
}

function actOnPendingIncomingConnection(_e) {
	var opts = {
		cancel: 2,
		destructive: 1,
		title: L('accept_request_prompt_title')
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('confirm_accept_request'), L('confirm_reject_request'), L('cancel')];
	} else {
		opts.options = [L('confirm_accept_request'), L('confirm_reject_request'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_ee) {
		if (_ee.index === 0) {
			groupConnection({
				type: _e.row.type,
				id: _e.row.request_id,
				fullname: _e.row.fullname,
			});
		} else if (_ee.index === 1) {
			rejectConnection({
				type: _e.row.type,
				id: _e.row.request_id,
				fullname: _e.row.fullname,
			});
		}
	});
	dialog.show();
}

function rejectConnection(_state) {
	if (_state.type === 'request') {
		server.rejectRequest({
			id: _state.id,
			onsuccess: function() {
				server.listConnections({
					onsuccess: populatePendingConnectionsTable,
				});
			},
			// onerror: alert(L('general_error')),
		});
	} else if (_state.type === 'suggest') {
		server.rejectSuggest({
			id: _state.id,
			onsuccess: function() {
				server.listConnections({
					onsuccess: populatePendingConnectionsTable,
				});
			},
			// onerror: alert(L('general_error')),
		});
	}
}

function groupConnection(_state) {
	connection.groupPending({
		slug: {type: _state.type, id: _state.id, fullname: _state.fullname},
		callback: acceptConnection,
	});
}

function acceptConnection(_state) {
	if (_state.type === 'request') {
		server.acceptRequest({
			id: _state.id,
			persona_ids: _state.persona_ids,
			onsuccess: function() {
				server.listConnections({
					onsuccess: populatePendingConnectionsTable,
				});
			},
			// onerror: alert(L('general_error')),
		});
	} else if (_state.type === 'suggest') {
		server.acceptSuggest({
			id: _state.id,
			persona_ids: _state.persona_ids,
			onsuccess: function() {
				server.listConnections({
					onsuccess: populatePendingConnectionsTable,
				});
			},
			// onerror: alert(L('general_error')),
		});
	}

}