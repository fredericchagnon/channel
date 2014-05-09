// Get the aruguments passed in
var args = arguments[0] || {};
var url = args["url"];
var beforeloadUrl = args["beforeloadUrl"];
var successCallback = args["successCallback"];
var preferences = require('preferences');
var authentication = require('authentication');
var utils = require('utils');
$.webview.setUrl(url);

if (OS_IOS) {
	$.navBarTitle.setText(L('authentication'));
}

$.webviewWindow.addEventListener('close', function(e) {
	args = null;
	arguments = null;
	url	= null;
	beforeloadUrl = null;
	successCallback = null;
	preferences = null;
	authentication = null;
	utils = null;
});

$.webviewWindow.addEventListener('open', function(e) {
	if (OS_ANDROID) {
	    var activity = $.webviewWindow.getActivity();
	    activity.actionBar.setTitle(L('authentication'));

		// Menu buttons (including overflow items for market setting and info)s
	    activity.onCreateOptionsMenu = function(e) {
	        var menu = e.menu;	                  
	        var appInfo = menu.add({
	            title: L('cancel'),
	            showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
	            icon: "images/ic_navigation_cancel.png",
	        });
	        appInfo.addEventListener("click", function(e) {
	        	closeWebviewWindow();
	        });
	    };
	    activity.invalidateOptionsMenu();
	} else if (OS_IOS) {
		// remove the status bar from the screen of devices that are running iOS 6
		if (Alloy.Globals.iosVersion < 7) {
			$.webviewWindow.top = '-20dp';
		}
	}
}); 

function closeWebviewWindow() {
	$.webviewWindow.close();
}

$.webview.addEventListener('beforeload', function(_e) {
	var url = '' + _e.url;
	if (url.indexOf(beforeloadUrl) != -1) {
		Alloy.Globals.activityIndicator({window : $.webview});
	}
});

$.webview.addEventListener('load', function(_e) {
	Ti.App.fireEvent('cancelActivityIndicator');
	var url = '' + _e.url;
	if (url.indexOf(beforeloadUrl) != -1) {
		$.webviewWindow.url = preferences.getHomepageUrl();
		var token = $.webview.html;
		if (token.indexOf("<body>") != -1 && token.indexOf("</body>") != -1) {
			var a = token.indexOf("<body>") + "<body>".length;
			var b = token.indexOf("</body>");
			token = token.substr(a, b - a);
			var response = JSON.parse(token);
			Ti.App.fireEvent('cancelActivityIndicator');
			Alloy.Globals.activityIndicator({window: $.webview});
			var onsuccess = function() {
				Ti.App.fireEvent('cancelActivityIndicator');
				$.webviewWindow.close();
				utils.call_callback(successCallback);
				Alloy.Globals.fullAppRefresh();
			}
			var onerror = function(message, code) {
				Ti.App.fireEvent('cancelActivityIndicator');
				alert(L('general_error'));
			};
			authentication.oauthenticate({
				login : response.email,
				email : response.email,
				token : response.token,
				onsuccess : onsuccess,
				onerror : onerror
			});
		}
	}
});
