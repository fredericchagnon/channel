migration.up = function(db) {
	db.createTable({
		"columns": {
		    "id": "TEXT",
		    "user_id": "TEXT",
		    "persona_id": "TEXT",
		    "first_name": "TEXT",
		    "last_name": "TEXT",
		    "fullname": "TEXT"
		}
	});
};

migration.down = function(db) {
	db.dropTable("contacts");
};
