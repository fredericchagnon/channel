var _logout_dialog_is_up;
var preferences = require('preferences');
var utils = require('utils');
var local_database = require('local_database');

// this is url for facebook
exports.get_facebook_url = function () {
    return preferences.getServerPrefix() + "/users/auth/facebook";
}

// this is url for google
exports.get_google_url = function () {
    return preferences.getServerPrefix() + "/users/auth/google";
}

exports.server_call = function(_params) {
    _logout_dialog_is_up = false;
    _params.data.user = _params.data.user ? _params.data.user : {};
    _params.data.user.id = preferences.getUserId();
    _params.data.user.authentication_token = preferences.getAuthenticationToken();
    _params.data.user.device = preferences.deviceInfo();;
    _params.data.user.device.unique_identifier = preferences.getDeviceId();

    // if authentication missing error call
    if (_params.data['authentication_token_skip'] !== true) {
        if (_params.data.user['authentication_token'] === '' || !_params.data.user['authentication_token']) {
            _params.onerror(401, L('error_api_401_title'));
            return;
        }
    }
    var onerror = _params.onerror;
    var onsuccess = _params.onsuccess;

    _params.onsuccess = function(_e) {
        var user_id = preferences.getUserId();
        var serverResponse = _e.responseObject;
        if (user_id !== null && !utils.isEmpty(serverResponse) && serverResponse.hasOwnProperty('id') && serverResponse.id === user_id) {
            local_database.updateUser(serverResponse);
        }
        utils.call_callback(onsuccess, _e);
    }
    raw_server_call(_params);
}

exports.bare_server_call = function(_params) {
    raw_server_call(_params);
}

function raw_server_call(_params) {
    if (typeof (_params.retry_count) === 'undefined') {
        _params.retry_count = 2;
    }
    var connection = Ti.Network.createHTTPClient({
        onload: function(_e) {
            if (connection.status === 401) {
                forceLogout();
            }
            if (connection.status !== 200) {
                retryCallingServer(_params, connection, _e);
            } else {
                _params.onsuccess({
                    responseObject: JSON.parse(connection.responseText),
                    event: _e
                });
            }
        },
        onerror: function(_e) {
            if (connection.status === 401) {
                forceLogout();
            }
            retryCallingServer(_params, connection, _e);
        },
    });
    connection.setTimeout(preferences.getServerTimeout());
    _params.method = _params.method || "POST";
    connection.enableKeepAlive = false;
    connection.open(_params.method, preferences.getServerPrefix() + _params.url);
    connection.setRequestHeader("Content-Type", "application/json");
    if (Alloy.Globals.networkCheck()) {
        connection.send(JSON.stringify(_params.data));        
    } else {
        utils.call_callback(_params.onerror, {});
    }
}

function forceLogout() {
    if (!_logout_dialog_is_up && preferences.getAuthenticationToken() !== null) {
        _logout_dialog_is_up = true;
        // fix for full_application reload in app2.js
        Ti.App.fireEvent('loading_complete');

        var alert = Ti.UI.createAlertDialog({
            title : L('error_api_401_title'),
            message : L('error_api_401_text'),
            buttonNames : [L('logout'), L('cancel')],
            cancel : 1
        });
        alert.addEventListener("click", function(e) {
            _logout_dialog_is_up = false;
            if (e.index == 0) {
                //TODO: wrap logout somewhere ... probably services.auth.logout();
                Ti.App.fireEvent("logout");
            }
        });
        alert.show();
    }
}

function retryCallingServer(_params, _connection, _e) {
    try {
        utils.info("onload: Error communicating with server - connected: " + _params.method + " " + preferences.getServerPrefix() + _params.url);
        utils.info("onload: Error communicating with server - connected: " + JSON.stringify(_params.data));
        utils.info("onload: Error communicating with server - connected: " + _connection.connected);
        utils.info("onload: Error communicating with server - readyState " + _connection.readyState);
        utils.info("onload: Error communicating with server - responseText " + _connection.responseText);
        utils.info("onload: Error communicating with server - status " + _connection.status);
    } catch( ex ) {
        Ti.API.info(ex);
    }
    // well it may have had been due to the some sort of error
    _params.retry_count = _params.retry_count - 1;
    if (_params.retry_count > 0) {
        _.delay(raw_server_call, 1000, _params);
    } else {
        _params.onerror(_connection.status, _e);
    }
}