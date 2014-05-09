$.inPersonWindow.addEventListener('open', function(e) {
	if (OS_ANDROID) {
	    var activity = $.inPersonWindow.getActivity();
	    activity.actionBar.title = L('scan_qr');
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeInPersonWindow();
	    };  
	    activity.onPrepareOptionsMenu = function(e) {
	        var menu = e.menu;
	        var qrButton = menu.add({
	            title: L('click_to_generate_qr'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
	            icon: "images/ic_action_qr.png",
	        });
	        qrButton.addEventListener("click", function(e) {
	        	//
	        });
	    };
	} else if (OS_IOS) {
		// remove the status bar from the screen of devices that are running iOS 6
		if (Alloy.Globals.iosVersion < 7) {
			$.inPersonWindow.top = '-20dp';
		}
	}
});

var server = require('server');
var preferences = require('preferences');
var TiBar;
if (OS_ANDROID) {
	TiBar = require('com.mwaysolutions.barcode');
} else if (OS_IOS) {
	TiBar = require('tibar');
}
var selectedPersonas;

groupConnection();

$.inPersonWindow.addEventListener("close", function() {
	server = null;
	preferences = null;
	selectedPersonas = null;
    $.destroy();
});

function closeInPersonWindow() {
	$.inPersonWindow.close();
}

function groupConnection(_state) {
	var personas = Alloy.Collections.personas;
	personas.fetch();
	var homePersonaId = personas.where({category: 'Home'})[0].get('id');
	var workPersonaId = personas.where({category: 'Work'})[0].get('id');
	var opts = {
		cancel: 2,
		title: L('group_contact_title')
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('home_me_category_name'), L('work_me_category_name'), L('cancel')];
	} else {
		opts.options = [L('home_me_category_name'), L('work_me_category_name'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_e) {
		if (_e.index === 0) {
			selectedPersonas = [homePersonaId];
		} else if (_e.index === 1) {
			selectedPersonas = [workPersonaId];
		}
		scanQR();
	});
	dialog.show();
}

function scanQR() {
	var configure = {
		classType: "ZBarReaderViewController",
		sourceType: "Camera",
		cameraMode: "Default",
		symbol: {
			"QR-Code" : true,
		},
		config: {
			"showsCameraControls" : true, // (VC)
			"showsZBarControls" : true,
			"tracksSymbols" : true, // the tracking rectangle that highlights barcodes
			"enableCache" : true,
			"showsHelpOnFail" : false,
			"takesPicture" : true
		},
		overlay: $.iosContainer,
	};
	var scan = function() {
		TiBar.scan({
			configure: configure,
			success: function(_data) {
				Ti.API.error('TiBar success callback!');
				if (_data && _data.barcode) {
					var barcodeUrl = ("" + _data.barcode).toLowerCase();
					var prefix = (preferences.getServerPrefix() + "/share/").toLowerCase();
					if (barcodeUrl.indexOf(prefix) === 0) {
						var token = barcodeUrl.substring(prefix.length);
						server.inPersonConnect({token: token, personas:selectedPersonas})
						alert(L('scan_barcode_success'));

					} else {
						alert(L('error_scan_barcode'));
					}
				}
				closeInPersonWindow();
			},
			cancel: function() {
				Ti.API.error('TiBar cancel cancel!');
				closeInPersonWindow();
			},
			error: function() {
				Ti.API.error('TiBar error ERROR!');
				closeInPersonWindow();
			}
		});
	};
	scan();
}

function switchToQR() {

}