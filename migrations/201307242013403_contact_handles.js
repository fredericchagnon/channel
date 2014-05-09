migration.up = function(db) {
	db.createTable({
		"columns": {
		    "id": "TEXT",
		    "name": "TEXT",
		    "value": "TEXT",
		    "url": "TEXT",
		    "country_name": "TEXT",
		    "country_code": "TEXT"
		}
	});
};

migration.down = function(db) {
	db.dropTable("contact_handles");
};
