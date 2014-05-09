function getString(_state) {
	var key = _state.key;
	var object = _state.object;
	if ((key === null) || (typeof object.get(key) === 'undefined') || object.get(key) === null) {
		return "";
	}
	return object.get(key);
}

exports.getFullName = function(_object) {
	name = getString({object: _object, key: 'prefix'}) + " " + getString({object: _object, key: 'first_name'}) + " " + getString({object: _object, key: 'middle_name'}) + " " + getString({object: _object, key: 'last_name'}) + " " + getString({object: _object, key: 'suffix'});
	name = name.replace(/\s+/g, " ");
	name = name.replace(/^\s*/g, "");
	return name;
}

exports.getPhoneticName = function(_object) {
	phoneticName = getString({object: _object, key: 'first_name_phonetic'}) + " " + getString({object: _object, key: 'last_name_phonetic'});
	phoneticName = phoneticName.replace(/\s+/g, " ");
	phoneticName = phoneticName.replace(/^\s*/g, "");
	return phoneticName;
}

exports.getJobDepartment = function(_object) {
	var jobTitle = getString({object: _object, key: 'job_title'});
	var department = getString({object: _object, key: 'department'});
	var jobDepartment = jobTitle + ((jobTitle != '' && department != '') ? "-" : "" ) + department;
	jobDepartment = jobDepartment.replace(/\s+/g, " ");
	jobDepartment = jobDepartment.replace(/^\s*/g, "");
	return jobDepartment;
}

exports.getCompany = function(_object) {
	var company = getString({object: _object, key: 'company'});
	return company;
}
