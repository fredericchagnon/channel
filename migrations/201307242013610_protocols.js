migration.up = function(db) {
	db.createTable({
		"columns": {
		    "id": "TEXT",
		    "contact_handle_id": "TEXT",
		    "type": "TEXT",
		    "active": "INTEGER"
		}
	});
};

migration.down = function(db) {
	db.dropTable("protocols");
};
