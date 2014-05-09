migration.up = function(db) {
	db.createTable({
		"columns": {
		    "id": "TEXT",
		    "status_id": "TEXT",
		    "persona_id": "TEXT",
		    "protocol_id": "TEXT",
		    "rank": "INTEGER",
		    "enabled": "INTEGER"
		}
	});
};

migration.down = function(db) {
	db.dropTable("persona_handles");
};
