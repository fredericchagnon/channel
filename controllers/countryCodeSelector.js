var args = arguments[0] || {};
var windowTitle = args['title'];
var callback = args['callback'];
var utils = require('utils');

if (OS_ANDROID) {
	$.countryCodeSelectorWindow.addEventListener('open', function(e) {
	    var activity = $.countryCodeSelectorWindow.getActivity();
	    activity.actionBar.title = windowTitle;
	    activity.actionBar.displayHomeAsUp = true; 
	    activity.actionBar.onHomeIconItemSelected = function() {
	        closeCountryCodeSelectorWindow();
	    };
	});
} else if (OS_IOS) {
    $.navBarTitle.setText(windowTitle);
    // remove the status bar from the screen of devices that are running iOS 6
    if (Alloy.Globals.iosVersion < 7) {
        $.countryCodeSelectorWindow.top = '-20dp';
    }
}

$.countryCodeSelectorWindow.addEventListener('close', function() {
	args = null;
    windowTitle= null;
	callback = null;
	utils = null;
    $.destroy();
});

exports.populateCountryCodeListView = function(_country_list) {
	var countryHashArray = _.values(_country_list);
    var data = [];
    _.each(countryHashArray, function(_item) {
        var thisRow = Ti.UI.createTableViewRow({
            height: '50dp',
            width: Ti.UI.FILL,
            title: _item['name'] +" ("+_item['prefix']+")",
            name: _item['name'],
            code: _item['code'],
            prefix: _item['prefix'],
            color: '#000000',
            left: '10dp',
            right: '5dp',
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            font: {
                fontFamily: 'Open Sans Cond Light',
                fontSize: '18dp',
                fontWeight: 'light'
            },
        });
        data.push(thisRow);
    });
    $.countryCodeList.setData(data);
	// var items = [];
 //    _.each(countryHashArray, function(_item) {
 //        // Ti.API.error("productItem "+prodIt.get('name'));
 //        items.push({
 //            template: "countryItem",
 //            countryName: {
 //                text: _item['name'] +" ("+_item['prefix']+")"
 //            },
 //            name: _item['name'],
 //            code: _item['code'],
 //            prefix: _item['prefix'],
 //        });
 //    });
 //    Ti.API.error("ABOUT TO SET ITEMS WITH "+JSON.stringify(items))
 //    $.section.setItems(items);
 //    $.countryCodeList.setTop('0dp');
 //    $.countryCodeList.setHeight(Ti.UI.SIZE);
}

exports.populateCountryNameListView = function(_country_list) {
	var countryHashArray = _.values(_country_list);
    var data = [];
    _.each(countryHashArray, function(_item) {
        var thisRow = Ti.UI.createTableViewRow({
            height: '50dp',
            width: Ti.UI.FILL,
            title: _item['name'],
            name: _item['name'],
            color: '#000000',
            left: '10dp',
            right: '5dp',
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            font: {
                fontFamily: 'Open Sans Cond Light',
                fontSize: '18dp',
                fontWeight: 'light'
            },
        });
        data.push(thisRow);
    });
    $.countryCodeList.setData(data);
	// var items = [];
 //    _.each(countryHashArray, function(_item) {
 //        items.push({
 //            template: "countryItem",
 //            countryName: {
 //                text: _item['name']
 //            },
 //            name: _item['name'],
 //        });
 //    });
 //    Ti.API.error("ABOUT TO SET ITEMS WITH "+JSON.stringify(items))
 //    $.section.setItems(items);
 //    $.countryCodeList.setTop('0dp');
 //    $.countryCodeList.setHeight(Ti.UI.SIZE);
}

function closeCountryCodeSelectorWindow() {
	$.countryCodeSelectorWindow.close();
}

function selectCountry(_e) {
	utils.call_callback(callback, _e);
	$.countryCodeSelectorWindow.close();
}