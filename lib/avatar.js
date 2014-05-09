var utils = require('utils');

function avatarInitials(_state) {
	var firstCharText = '##';
	var lastCharText = '#';
	if (_state.hasOwnProperty('first_name') && utils.defined(_state.first_name)) {
		firstCharText = _state.first_name.slice(0,1);
	}
	if (_state.hasOwnProperty('last_name') && utils.defined(_state.last_name)) {
		lastCharText = _state.last_name.slice(0,2);
	}
	var firstChar = Ti.UI.createView({
		left: '16dp',
		top: '3dp',
		width: '80dp',
		height: '80dp',
	});
	var firstCharTextLabel = Ti.UI.createLabel({
		text: lastCharText.charAt(0).toUpperCase() + lastCharText.slice(1).toLowerCase(),
		color: '#FFFFFF',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		font: {
			fontFamily: "Open Sans Condensed",
			fontSize: '48dp',
			fontWeight: 'bold'
		}
	});
	firstChar.add(firstCharTextLabel);

	var lastChar = Ti.UI.createView({
		left: '64dp',
		top: '-5dp',
		width: '176dp',
		height: '240dp',
	});
	var lastCharTextLabel = Ti.UI.createLabel({
		text: firstCharText.toUpperCase(),
		color: '#FFFFFF',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		font: {
			fontFamily: 'Open Sans',
			fontSize: '192dp',
			fontStyle: 'Condensed Light',
		}
	});
	lastChar.add(lastCharTextLabel);

	var default_avatar = Ti.UI.createView({
		top: '0dp',
		left: '0dp',
		height: '240dp',
		width: '240dp',
		backgroundColor: '#A2A0C7',
	});
	default_avatar.add(firstChar);
	default_avatar.add(lastChar);
	var avatar_blob = default_avatar.toImage({callback : null, honorScaleFactor : true});
	var newFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, _state.persona_id + ".jpg")
	newFile.write(avatar_blob);
	return newFile.getNativePath();
}

exports.generateContactCardImage = function(_state) {
	var defaultImage = avatarInitials({
		first_name: _state.first_name,
		last_name: _state.last_name,
		persona_id: _state.persona_id,
	});	
	var avatar = Ti.UI.createImageView({
		defaultImage: defaultImage,
		image: 'https://s3.amazonaws.com/avatars.channel/uploads/'+_state.persona_id+'.jpg',
		width: '90dp',
		height: '90dp',
	});
	return avatar;
}

exports.generateRowImage = function(_state) {
	var defaultImage = avatarInitials({
		first_name: _state.first_name,
		last_name: _state.last_name,
		persona_id: _state.persona_id,
	});
	var avatar = Ti.UI.createImageView({
		left: '0dp',
		// defaultImage: defaultImage,
		defaultImage: Titanium.Filesystem.applicationDataDirectory+_state.persona_id+".jpg",
		image: 'https://s3.amazonaws.com/avatars.channel/uploads/'+_state.persona_id+'.jpg',
		width: '60dp',
		height: '60dp',
	});
	return avatar;
}

exports.generateByRowImage = function(_state) {
	var defaultImage = avatarInitials({
		first_name: _state.first_name,
		last_name: _state.last_name,
		persona_id: _state.persona_id,
	});
	var avatar = Ti.UI.createImageView({
		left: '30dp',
		top: '30dp',
		height: '30dp',
		width: '30dp',
		borderColor: '#FFF',
		borderWidth: '1dp',
		defaultImage: defaultImage,
		image: 'https://s3.amazonaws.com/avatars.channel/uploads/'+_state.persona_id+'.jpg',
	});
	return avatar;
}

