exports.groupPending = function(_state) {
	var personas = Alloy.Collections.personas;
	personas.fetch();
	var homePersonaId = personas.where({category: 'Home'})[0].get('id');
	var workPersonaId = personas.where({category: 'Work'})[0].get('id');
	var title = String.format(L('group_contact_title'), _state.slug.fullname);
	var opts = {
		cancel: 2,
		title: title,
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('home_me_category_name'), L('work_me_category_name'), L('cancel')];
	} else {
		opts.options = [L('home_me_category_name'), L('work_me_category_name'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_e) {
		if (_e.index === 0) {
			_state.slug.persona_ids = [homePersonaId];
			_state.callback(_state.slug);
		} else if (_e.index === 1) {
			_state.slug.persona_ids = [workPersonaId];
			_state.callback(_state.slug);
		}
	});
	dialog.show();
}

exports.group = function(_state) {
	var personas = Alloy.Collections.personas;
	personas.fetch();
	var homePersonaId = personas.where({category: 'Home'})[0].get('id');
	var workPersonaId = personas.where({category: 'Work'})[0].get('id');
	var title = String.format(L('group_contact_title'), _state.slug.fullname);
	var switch_group_name = L('work_me_category_name');
	if (_state.slug.currentGroup === homePersonaId) {
		_state.slug.persona_ids = [workPersonaId];
	} else {
		_state.slug.persona_ids = [homePersonaId];
		switch_group_name = L('home_me_category_name');
	}
	var opts = {
		cancel: 1,
		title: title,
	};
	if (OS_ANDROID){
		opts.buttonNames = [switch_group_name, L('cancel')];
	} else {
		opts.options = [switch_group_name, L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_e) {
		if (_e.index === 0) {
			_state.callback(_state.slug);
		}
	});
	dialog.show();
}

exports.disconnect = function(_state) {
	var opts = {
		destructive: 0,
		cancel: 1,
		title: String.format(L('confirm_disconnect'), _state.slug.fullname),
	};
	if (OS_ANDROID){
		opts.buttonNames = [L('disconnect_contact'), L('cancel')];
	} else {
		opts.options = [L('disconnect_contact'), L('cancel')];
	}
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.addEventListener('click', function(_e) {
		if (_e.index === 0) {
			_state.callback(_state.slug);
		}
	});
	dialog.show();
}
